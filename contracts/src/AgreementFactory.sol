// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TrancheVault} from "./TrancheVault.sol";
import {FitOutAgreement} from "./FitOutAgreement.sol";
import {WaterfallRouter} from "./WaterfallRouter.sol";

/**
 * @title AgreementFactory
 * @notice Atomically deploys and wires a full suite of Euthial protocol contracts:
 *         - Senior TrancheVault (ERC-4626)
 *         - Junior TrancheVault (ERC-4626)
 *         - FitOutAgreement
 *         - WaterfallRouter
 *
 * All contracts are cross-configured and verified in a single transaction.
 */
contract AgreementFactory is Ownable {
    struct DealParams {
        address asset;
        address dealAdmin;
        address landlord;
        address tenant;
        address contractor;
        address inspector;
        address arbiter;
        address attestor;
        uint256 budget;
        uint256 seniorPrincipal;
        uint256 juniorPrincipal;
        uint16 seniorMultipleBps;
        uint16 juniorMultipleBps;
        uint32 targetTenorDays;
        uint32 maxTenorDays;
        uint16 floorRatioBps;
        uint16 toleranceBps;
        uint16 cureDays;
        uint16 maxExcusedDays;
        uint64 fundraiseDeadline;
        uint64 buildDeadline;
        uint32 leaseEndDay;
        string seniorName;
        string seniorSymbol;
        string juniorName;
        string juniorSymbol;
    }

    struct DealAddresses {
        address seniorVault;
        address juniorVault;
        address router;
        address agreement;
    }

    /// @notice Registered deals mapped by dealId
    mapping(uint256 => DealAddresses) public deals;
    /// @notice Total deals created
    uint256 public dealCount;

    /// @notice Whitelist of creators authorized to deploy deals
    mapping(address => bool) public dealCreators;

    event DealCreated(
        uint256 indexed dealId,
        address indexed agreement,
        address seniorVault,
        address juniorVault,
        address router,
        address landlord,
        address tenant
    );
    event DealCreatorUpdated(address indexed creator, bool allowed);

    error Unauthorized();
    error InvalidAddress();
    error InvalidBudget();
    error InvalidClaimMultiple();
    error DealNotFound();

    constructor(address initialOwner) Ownable(initialOwner) {
        if (initialOwner == address(0)) revert InvalidAddress();
    }

    function setDealCreator(address creator, bool allowed) external onlyOwner {
        if (creator == address(0)) revert InvalidAddress();
        dealCreators[creator] = allowed;
        emit DealCreatorUpdated(creator, allowed);
    }

    function createDeal(DealParams calldata p) external returns (uint256 dealId, DealAddresses memory addrs) {
        if (msg.sender != owner() && !dealCreators[msg.sender]) revert Unauthorized();

        if (
            p.asset == address(0) ||
            p.dealAdmin == address(0) ||
            p.landlord == address(0) ||
            p.tenant == address(0) ||
            p.contractor == address(0) ||
            p.inspector == address(0) ||
            p.arbiter == address(0) ||
            p.attestor == address(0)
        ) revert InvalidAddress();

        if (p.budget == 0 || p.seniorPrincipal == 0 || p.juniorPrincipal == 0 || p.seniorPrincipal + p.juniorPrincipal != p.budget) {
            revert InvalidBudget();
        }

        if (p.seniorMultipleBps < 10000 || p.juniorMultipleBps < p.seniorMultipleBps) {
            revert InvalidClaimMultiple();
        }

        // 1. Deploy Senior and Junior Tranche Vaults
        TrancheVault seniorVault = new TrancheVault(
            IERC20(p.asset),
            p.seniorName,
            p.seniorSymbol,
            address(this)
        );

        TrancheVault juniorVault = new TrancheVault(
            IERC20(p.asset),
            p.juniorName,
            p.juniorSymbol,
            address(this)
        );

        // 2. Deploy FitOutAgreement
        FitOutAgreement agreement = new FitOutAgreement(
            p.asset,
            address(0),
            address(seniorVault),
            address(juniorVault),
            p.landlord,
            p.tenant,
            p.contractor,
            p.inspector,
            p.arbiter,
            p.budget,
            p.seniorPrincipal,
            p.juniorPrincipal,
            p.seniorMultipleBps,
            p.juniorMultipleBps,
            p.targetTenorDays,
            p.maxTenorDays,
            p.floorRatioBps,
            p.toleranceBps,
            p.cureDays,
            p.maxExcusedDays,
            p.fundraiseDeadline,
            p.buildDeadline,
            p.leaseEndDay
        );

        // 3. Compute claims and deploy WaterfallRouter
        uint256 seniorClaim = (p.seniorPrincipal * p.seniorMultipleBps) / 10000;
        uint256 juniorClaim = (p.juniorPrincipal * p.juniorMultipleBps) / 10000;

        WaterfallRouter router = new WaterfallRouter(
            address(agreement),
            address(seniorVault),
            address(juniorVault),
            p.landlord,
            p.attestor,
            p.asset,
            seniorClaim,
            juniorClaim
        );

        // 4. Connect agreements and vaults
        agreement.setRouter(address(router));
        seniorVault.setAgreement(address(agreement));
        juniorVault.setAgreement(address(agreement));
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));

        // 5. Transfer admin rights to deal admin
        seniorVault.transferAdmin(p.dealAdmin);
        juniorVault.transferAdmin(p.dealAdmin);

        // 6. Record and emit
        dealId = dealCount++;
        addrs = DealAddresses({
            seniorVault: address(seniorVault),
            juniorVault: address(juniorVault),
            router: address(router),
            agreement: address(agreement)
        });
        deals[dealId] = addrs;

        emit DealCreated(
            dealId,
            address(agreement),
            address(seniorVault),
            address(juniorVault),
            address(router),
            p.landlord,
            p.tenant
        );

        return (dealId, addrs);
    }

    function getDeal(uint256 dealId) external view returns (DealAddresses memory) {
        if (dealId >= dealCount) revert DealNotFound();
        return deals[dealId];
    }

    function getAllDeals() external view returns (DealAddresses[] memory) {
        DealAddresses[] memory allDeals = new DealAddresses[](dealCount);
        for (uint256 i = 0; i < dealCount; i++) {
            allDeals[i] = deals[i];
        }
        return allDeals;
    }
}
