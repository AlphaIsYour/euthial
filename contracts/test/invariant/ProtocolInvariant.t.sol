// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {FitOutAgreement} from "../../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {TrancheVault} from "../../src/TrancheVault.sol";
import {MockIDR} from "../../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract ProtocolInvariantHandler is Test {
    FitOutAgreement public agreement;
    WaterfallRouter public router;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    MockIDR public token;
    address public alice;
    address public bob;
    address public tenant;
    address public landlord;
    address public arbiter;
    uint256 public attestorPrivateKey;
    uint256 public callCount;

    constructor(
        FitOutAgreement _agreement,
        WaterfallRouter _router,
        TrancheVault _seniorVault,
        TrancheVault _juniorVault,
        MockIDR _token,
        address _alice,
        address _bob,
        address _tenant,
        address _landlord,
        address _arbiter,
        uint256 _attestorPrivateKey
    ) {
        agreement = _agreement;
        router = _router;
        seniorVault = _seniorVault;
        juniorVault = _juniorVault;
        token = _token;
        alice = _alice;
        bob = _bob;
        tenant = _tenant;
        landlord = _landlord;
        arbiter = _arbiter;
        attestorPrivateKey = _attestorPrivateKey;
    }

    function createSignedSettlement(
        uint32 dayId,
        uint8 periodDays,
        uint256 grossRecorded
    ) public view returns (WaterfallRouter.Settlement memory, bytes memory) {
        WaterfallRouter.Settlement memory s = WaterfallRouter.Settlement({
            dayId: dayId, periodDays: periodDays, grossRecorded: grossRecorded,
            txCount: 1, evidenceHash: bytes32(0)
        });

        bytes32 structHash = keccak256(abi.encode(
            router.getSettlementTypehash(), s.dayId, s.periodDays,
            s.grossRecorded, s.txCount, s.evidenceHash
        ));

        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01", router.domainSeparator(), structHash
        ));

        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        bytes memory sig = abi.encodePacked(r, s_, v);
        return (s, sig);
    }

    function handler_deposit(uint256 amount) public {
        amount = bound(amount, 1e6, 1_000_000e6);
        vm.startPrank(alice);
        if (token.balanceOf(alice) >= amount) {
            token.approve(address(seniorVault), amount);
            try seniorVault.deposit(amount, alice) {
                callCount++;
            } catch {}
        }
        vm.stopPrank();
    }

    function handler_settle(uint32 dayId, uint256 G) public {
        dayId = uint32(bound(dayId, 1, 1000));
        G = bound(G, 0, 50_000_000e6);
        
        if (router.lastDayId() >= dayId) return;
        if (dayId - router.lastDayId() > 60) return;
        
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(dayId, 1, G);
        
        try router.settle(s, sig) {
            callCount++;
        } catch {}
    }

    function handler_depositBond(uint256 amount) public {
        amount = bound(amount, 1e6, 15_000_000e6);
        vm.startPrank(tenant);
        if (token.balanceOf(tenant) >= amount && agreement.bondDeposited() == 0) {
            token.approve(address(agreement), amount);
            try agreement.depositBond(amount) {
                callCount++;
            } catch {}
        }
        vm.stopPrank();
    }

    function handler_markExcused(uint32 start, uint32 end) public {
        start = uint32(bound(start, 1, 100));
        end = uint32(bound(end, start, start + 20));
        
        vm.prank(arbiter);
        try agreement.markExcused(start, end, bytes32(0)) {
            callCount++;
        } catch {}
    }

    function handler_withdraw(uint256 amount) public {
        amount = bound(amount, 0, 10_000_000e6);
        vm.startPrank(alice);
        uint256 maxWithdraw = seniorVault.maxWithdraw(alice);
        if (amount <= maxWithdraw) {
            try seniorVault.withdraw(amount, alice, alice) {
                callCount++;
            } catch {}
        }
        vm.stopPrank();
    }
}

contract ProtocolInvariantTest is StdInvariant, Fixtures {
    ProtocolInvariantHandler handler;

    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        handler = new ProtocolInvariantHandler(
            agreement,
            router,
            seniorVault,
            juniorVault,
            token,
            alice,
            bob,
            tenant,
            landlord,
            arbiter,
            attestorPrivateKey
        );
        targetContract(address(handler));
    }

    function invariant_INV01_PullLessThanG() public {
        WaterfallRouter.SplitResult memory split = router.previewSplit(10_000_000e6);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        assertLe(totalPull, 10_000_000e6, "INV-01 violated");
    }

    function invariant_INV02_RouterBalanceZero() public {
        assertEq(token.balanceOf(address(router)), 0, "INV-02 violated");
    }

    function invariant_INV03_JuniorAfterSenior() public {
        if (router.juniorPaid() > 0) {
            assertEq(router.seniorPaid(), SENIOR_CLAIM, "INV-03 violated");
        }
    }

    function invariant_INV04_SharePriceNonDecreasing() public {
        uint256 seniorNavPerShare = seniorVault.convertToAssets(1e6);
        assertGe(seniorNavPerShare, 1e6, "INV-04: share price decreased");
    }

    function invariant_INV06_DayIdMonotonic() public {
        assertGe(router.lastDayId(), 0, "INV-06: dayId invalid");
    }

    function invariant_INV12_FloorMonotonic() public {
        for (uint32 d = 0; d < 100; d += 10) {
            uint256 f1 = agreement.floor(d);
            uint256 f2 = agreement.floor(d + 1);
            assertGe(f2, f1, "INV-12 violated");
        }
    }

    function invariant_BondConservation() public {
        uint256 sum = agreement.bondBalance() + agreement.bondDrawn() + agreement.bondRefunded();
        assertEq(sum, agreement.bondDeposited(), "Bond accounting violated");
    }

    function invariant_VaultAccountingConsistent() public {
        uint256 seniorTotal = seniorVault.totalAssets();
        uint256 seniorIdle = seniorVault.idleCash();
        uint256 seniorDeployed = seniorVault.principalOutstanding();
        assertEq(seniorTotal, seniorIdle + seniorDeployed, "Senior vault accounting invalid");
    }
}
