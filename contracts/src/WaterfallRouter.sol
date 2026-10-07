// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title WaterfallRouter
 * @notice Verifies EIP-712 signed settlement attestations and computes
 *         the waterfall split across Senior vault, Junior vault, and Landlord.
 *
 * @dev Settlement flow:
 *   1. Attestor signs Settlement struct via EIP-712.
 *   2. Anyone (relayer) calls settle(Settlement, signature).
 *   3. Router verifies signature, enforces monotonic dayId, checks MAX_GAP.
 *   4. Computes split per Phase A or Phase B formulas.
 *   5. Pulls only the non-tenant portion (pull = landlordAmt + investorAmt)
 *      from attestor via SafeERC20 transferFrom.
 *   6. Distributes to SeniorVault.onRepayment(), JuniorVault.onRepayment(),
 *      and landlord address.
 *   7. Hooks into FitOutAgreement for covenant evaluation.
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 5.1, 5.2, 8
 *   - docs/02_ECONOMIC_MODEL.md, Section 3 (waterfall definition)
 *
 * Invariants:
 *   - INV-01: landlordAmt + toSenior + toJunior = pull <= G.
 *   - INV-02: Router token balance unchanged after settle() (enforced as balance == 0 for pass-through design).
 *   - INV-03: juniorPaid > 0 implies seniorPaid == seniorClaim (senior-first distribution).
 *   - INV-06: dayId strictly monotonic; one settlement per dayId.
 *
 * Phase Semantics:
 *   - Phase A (Amortization): Active while seniorPaid < seniorClaim OR juniorPaid < juniorClaim
 *   - Phase B (Residual): Active when seniorPaid >= seniorClaim AND juniorPaid >= juniorClaim
 *   Note: "Phase" here refers to waterfall distribution mode, distinct from FitOutAgreement lifecycle phases.
 *
 * Agreement Integration (DEFERRED to Phase 2):
 *   - Specification 05 Section 8.2 item 7 requires calling Agreement.onSettlement() for covenant evaluation.
 *   - This is intentionally deferred until FitOutAgreement.sol implementation is complete.
 *   - Current implementation focuses on waterfall correctness and can be verified independently.
 *   - Phase/pause enforcement (OPERATING, RESIDUAL) is FitOutAgreement's responsibility, not WaterfallRouter's.
 */
contract WaterfallRouter is EIP712, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Math for uint256;

    // ========================================
    // State Variables
    // ========================================

    address public immutable agreement;
    address public immutable seniorVault;
    address public immutable juniorVault;
    address public immutable landlord;
    address public immutable attestor;
    IERC20 public immutable asset;
    uint256 public immutable seniorClaim;
    uint256 public immutable juniorClaim;
    
    uint256 public seniorPaid;
    uint256 public juniorPaid;
    uint32 public lastDayId;
    uint32 public startDay;
    mapping(uint32 => bool) public settled;

    // ========================================
    // Constants
    // ========================================

    uint16 public constant LANDLORD_TAKE_BPS = 500;      // 5%
    uint16 public constant INVESTOR_TAKE_BPS = 1500;     // 15%
    uint16 public constant LANDLORD_TAKE_BPS_B = 500;    // 5%
    uint16 public constant ROYALTY_BPS = 200;            // 2%
    uint32 public constant MAX_GAP = 60;
    uint16 private constant BPS_DENOMINATOR = 10_000;

    // ========================================
    // Structs and Types
    // ========================================

    struct Settlement {
        uint32 dayId;
        uint8 periodDays;
        uint256 grossRecorded;
        uint32 txCount;
        bytes32 evidenceHash;
    }

    enum Phase {
        PhaseA,
        PhaseB
    }

    struct SplitResult {
        uint256 landlordAmt;
        uint256 toSenior;
        uint256 toJunior;
        uint256 tenantRetainOrExcess;
        Phase phase;
    }

    // ========================================
    // Events
    // ========================================

    event SettlementRecorded(
        uint32 indexed dayId,
        uint8 periodDays,
        uint256 grossRecorded,
        uint256 landlordAmt,
        uint256 toSenior,
        uint256 toJunior,
        uint256 tenantRetain,
        bytes32 evidenceHash,
        Phase phase
    );

    event PhaseSwitchedToResidual(uint32 indexed dayId, uint256 totalPaid);

    // ========================================
    // Errors
    // ========================================

    error InvalidPeriodDays();
    error InvalidSignature();
    error SettlementAlreadyRecorded();
    error DayIdNotMonotonic();
    error GapTooLarge();
    error ZeroAddress();

    // ========================================
    // EIP-712 Type Hash
    // ========================================

    bytes32 private constant SETTLEMENT_TYPEHASH =
        keccak256(
            "Settlement(uint32 dayId,uint8 periodDays,uint256 grossRecorded,uint32 txCount,bytes32 evidenceHash)"
        );

    // ========================================
    // Constructor
    // ========================================

    constructor(
        address agreement_,
        address seniorVault_,
        address juniorVault_,
        address landlord_,
        address attestor_,
        address asset_,
        uint256 seniorClaim_,
        uint256 juniorClaim_
    ) EIP712("FitOutRouter", "1") {
        if (agreement_ == address(0)) revert ZeroAddress();
        if (seniorVault_ == address(0)) revert ZeroAddress();
        if (juniorVault_ == address(0)) revert ZeroAddress();
        if (landlord_ == address(0)) revert ZeroAddress();
        if (attestor_ == address(0)) revert ZeroAddress();
        if (asset_ == address(0)) revert ZeroAddress();

        agreement = agreement_;
        seniorVault = seniorVault_;
        juniorVault = juniorVault_;
        landlord = landlord_;
        attestor = attestor_;
        asset = IERC20(asset_);
        seniorClaim = seniorClaim_;
        juniorClaim = juniorClaim_;
    }

    // ========================================
    // Main Settlement Function
    // ========================================

    function settle(Settlement calldata s, bytes calldata signature) external nonReentrant {
        // 1. Validate period days
        if (s.periodDays == 0 || s.periodDays > 31) revert InvalidPeriodDays();

        // 2. Verify signature
        bytes32 structHash = keccak256(
            abi.encode(SETTLEMENT_TYPEHASH, s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash)
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, signature);
        if (signer != attestor) revert InvalidSignature();

        // 3. Check monotonicity and replay protection
        if (settled[s.dayId]) revert SettlementAlreadyRecorded();

        uint32 periodStart = s.dayId - s.periodDays + 1;
        if (lastDayId != 0 && periodStart <= lastDayId) revert DayIdNotMonotonic();

        // 4. Check MAX_GAP
        if (lastDayId != 0 && s.dayId > lastDayId + MAX_GAP) revert GapTooLarge();

        // 5. Set startDay on first settlement (D-24: beginning of first period)
        if (startDay == 0) {
            startDay = periodStart;
        }

        // 6. Compute waterfall split
        SplitResult memory split = _computeWaterfall(s.grossRecorded);

        // 7. Mark as settled BEFORE external calls (CEI pattern)
        settled[s.dayId] = true;
        lastDayId = s.dayId;

        // 8. Update paid amounts
        uint256 seniorPaidBefore = seniorPaid;
        uint256 juniorPaidBefore = juniorPaid;
        seniorPaid += split.toSenior;
        juniorPaid += split.toJunior;

        // 9. Check for Phase A -> B transition
        bool transitioned = false;
        if (seniorPaidBefore < seniorClaim || juniorPaidBefore < juniorClaim) {
            if (seniorPaid >= seniorClaim && juniorPaid >= juniorClaim) {
                transitioned = true;
            }
        }

        // 10. Execute distributions (Checks-Effects-Interactions)
        uint256 pull = split.landlordAmt + split.toSenior + split.toJunior;

        if (pull > 0) {
            // Pull from attestor
            asset.safeTransferFrom(attestor, address(this), pull);

            // Distribute to landlord
            if (split.landlordAmt > 0) {
                asset.safeTransfer(landlord, split.landlordAmt);
            }

            // Distribute to senior vault
            if (split.toSenior > 0) {
                asset.forceApprove(seniorVault, split.toSenior);
                ITrancheVault(seniorVault).onRepayment(split.toSenior);
                asset.forceApprove(seniorVault, 0);
            }

            // Distribute to junior vault
            if (split.toJunior > 0) {
                asset.forceApprove(juniorVault, split.toJunior);
                ITrancheVault(juniorVault).onRepayment(split.toJunior);
                asset.forceApprove(juniorVault, 0);
            }

            // Verify router balance is unchanged (INV-02)
            require(asset.balanceOf(address(this)) == 0, "Router balance non-zero");
        }

        // 11. Emit events
        emit SettlementRecorded(
            s.dayId,
            s.periodDays,
            s.grossRecorded,
            split.landlordAmt,
            split.toSenior,
            split.toJunior,
            split.tenantRetainOrExcess,
            s.evidenceHash,
            split.phase
        );

        if (transitioned) {
            emit PhaseSwitchedToResidual(s.dayId, seniorPaid + juniorPaid);
        }

        // 11. Hook into Agreement for covenant evaluation
        if (agreement != address(0)) {
            IFitOutAgreement(agreement).onSettlement(s.dayId, seniorPaid + juniorPaid);
        }
    }

    // ========================================
    // Waterfall Computation (Internal)
    // ========================================

    function _computeWaterfall(uint256 G) internal view returns (SplitResult memory split) {
        Phase currentPhase = _currentPhase();
        split.phase = currentPhase;

        if (currentPhase == Phase.PhaseA) {
            // Phase A: Amortization
            split.landlordAmt = (G * LANDLORD_TAKE_BPS) / BPS_DENOMINATOR;
            uint256 investorPool = (G * INVESTOR_TAKE_BPS) / BPS_DENOMINATOR;

            // Sequential distribution: senior first, then junior
            uint256 seniorRemaining = seniorClaim - seniorPaid;
            uint256 juniorRemaining = juniorClaim - juniorPaid;

            split.toSenior = Math.min(investorPool, seniorRemaining);
            uint256 afterSenior = investorPool - split.toSenior;
            split.toJunior = Math.min(afterSenior, juniorRemaining);

            // Excess goes back to tenant (not pulled)
            uint256 excess = afterSenior - split.toJunior;
            split.tenantRetainOrExcess = excess;

            // Verify INV-01
            uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
            require(totalPull <= G, "INV-01: pull exceeds G");
        } else {
            // Phase B: Residual
            split.landlordAmt = (G * LANDLORD_TAKE_BPS_B) / BPS_DENOMINATOR;
            split.toJunior = (G * ROYALTY_BPS) / BPS_DENOMINATOR;
            split.toSenior = 0;
            split.tenantRetainOrExcess = G - split.landlordAmt - split.toJunior;

            // Verify INV-01
            uint256 totalPull = split.landlordAmt + split.toJunior;
            require(totalPull <= G, "INV-01: pull exceeds G");
        }

        return split;
    }

    function _currentPhase() internal view returns (Phase) {
        if (seniorPaid < seniorClaim || juniorPaid < juniorClaim) {
            return Phase.PhaseA;
        }
        return Phase.PhaseB;
    }

    // ========================================
    // View Functions
    // ========================================

    function currentPhase() external view returns (Phase) {
        return _currentPhase();
    }

    function seniorOutstandingClaim() external view returns (uint256) {
        if (seniorPaid >= seniorClaim) return 0;
        return seniorClaim - seniorPaid;
    }

    function juniorOutstandingClaim() external view returns (uint256) {
        if (juniorPaid >= juniorClaim) return 0;
        return juniorClaim - juniorPaid;
    }

    function claimPaidTotal() external view returns (uint256) {
        return seniorPaid + juniorPaid;
    }

    function previewSplit(uint256 G) external view returns (SplitResult memory split) {
        return _computeWaterfall(G);
    }

    function settlementOf(uint32 dayId) external view returns (bool) {
        return settled[dayId];
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function getSettlementTypehash() external pure returns (bytes32) {
        return SETTLEMENT_TYPEHASH;
    }
}

// ========================================
// Interface
// ========================================

interface ITrancheVault {
    function onRepayment(uint256 amount) external;
}

interface IFitOutAgreement {
    function onSettlement(uint32 dayId, uint256 cumulativeInvestorPaid) external;
}

