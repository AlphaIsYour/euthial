// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {AgreementFactory} from "../src/AgreementFactory.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {MockIDR} from "../src/MockIDR.sol";

contract AgreementFactoryTest is Test {
    AgreementFactory public factory;
    MockIDR public token;

    address public owner = makeAddr("owner");
    address public dealAdmin = makeAddr("dealAdmin");
    address public landlord = makeAddr("landlord");
    address public tenant = makeAddr("tenant");
    address public contractor = makeAddr("contractor");
    address public inspector = makeAddr("inspector");
    address public arbiter = makeAddr("arbiter");
    address public attestor = makeAddr("attestor");
    address public creator = makeAddr("creator");
    address public stranger = makeAddr("stranger");

    uint256 constant BUDGET = 150_000_000e6;
    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint16 constant SENIOR_MULTIPLE_BPS = 12500;
    uint16 constant JUNIOR_MULTIPLE_BPS = 14000;

    function setUp() public {
        token = new MockIDR();
        factory = new AgreementFactory(owner);
    }

    function _defaultParams() internal view returns (AgreementFactory.DealParams memory) {
        return AgreementFactory.DealParams({
            asset: address(token),
            dealAdmin: dealAdmin,
            landlord: landlord,
            tenant: tenant,
            contractor: contractor,
            inspector: inspector,
            arbiter: arbiter,
            attestor: attestor,
            budget: BUDGET,
            seniorPrincipal: SENIOR_PRINCIPAL,
            juniorPrincipal: JUNIOR_PRINCIPAL,
            seniorMultipleBps: SENIOR_MULTIPLE_BPS,
            juniorMultipleBps: JUNIOR_MULTIPLE_BPS,
            targetTenorDays: 540,
            maxTenorDays: 720,
            floorRatioBps: 6000,
            toleranceBps: 100,
            cureDays: 7,
            maxExcusedDays: 30,
            fundraiseDeadline: uint64(block.timestamp + 30 days),
            buildDeadline: uint64(block.timestamp + 60 days),
            leaseEndDay: uint32(block.timestamp + 1080 days),
            seniorName: "Senior Vault",
            seniorSymbol: "sVLT",
            juniorName: "Junior Vault",
            juniorSymbol: "jVLT"
        });
    }

    function test_Constructor_InitialOwner() public view {
        assertEq(factory.owner(), owner);
        assertEq(factory.dealCount(), 0);
    }

    function test_Constructor_RevertZeroAddress() public {
        vm.expectRevert(AgreementFactory.InvalidAddress.selector);
        new AgreementFactory(address(0));
    }

    function test_CreateDeal_Success() public {
        AgreementFactory.DealParams memory p = _defaultParams();

        vm.prank(owner);
        (uint256 dealId, AgreementFactory.DealAddresses memory addrs) = factory.createDeal(p);

        assertEq(dealId, 0);
        assertEq(factory.dealCount(), 1);
        assertTrue(addrs.seniorVault != address(0));
        assertTrue(addrs.juniorVault != address(0));
        assertTrue(addrs.router != address(0));
        assertTrue(addrs.agreement != address(0));

        // Verify wiring
        FitOutAgreement agreement = FitOutAgreement(addrs.agreement);
        TrancheVault seniorVault = TrancheVault(addrs.seniorVault);
        TrancheVault juniorVault = TrancheVault(addrs.juniorVault);
        WaterfallRouter router = WaterfallRouter(addrs.router);

        assertEq(agreement.router(), address(router));
        assertEq(seniorVault.agreement(), address(agreement));
        assertEq(juniorVault.agreement(), address(agreement));
        assertEq(seniorVault.router(), address(router));
        assertEq(juniorVault.router(), address(router));

        // Admin transferred to dealAdmin
        assertEq(seniorVault.admin(), dealAdmin);
        assertEq(juniorVault.admin(), dealAdmin);

        // Registry lookup
        AgreementFactory.DealAddresses memory lookup = factory.getDeal(0);
        assertEq(lookup.agreement, address(agreement));

        AgreementFactory.DealAddresses[] memory allDeals = factory.getAllDeals();
        assertEq(allDeals.length, 1);
        assertEq(allDeals[0].agreement, address(agreement));
    }

    function test_CreateDeal_AuthorizedCreator() public {
        AgreementFactory.DealParams memory p = _defaultParams();

        vm.prank(owner);
        factory.setDealCreator(creator, true);
        assertTrue(factory.dealCreators(creator));

        vm.prank(creator);
        (uint256 dealId, ) = factory.createDeal(p);
        assertEq(dealId, 0);
    }

    function test_CreateDeal_RevertUnauthorized() public {
        AgreementFactory.DealParams memory p = _defaultParams();

        vm.prank(stranger);
        vm.expectRevert(AgreementFactory.Unauthorized.selector);
        factory.createDeal(p);
    }

    function test_CreateDeal_RevertInvalidAddress() public {
        AgreementFactory.DealParams memory p = _defaultParams();
        p.asset = address(0);

        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidAddress.selector);
        factory.createDeal(p);

        p = _defaultParams();
        p.dealAdmin = address(0);
        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidAddress.selector);
        factory.createDeal(p);

        p = _defaultParams();
        p.attestor = address(0);
        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidAddress.selector);
        factory.createDeal(p);
    }

    function test_CreateDeal_RevertInvalidBudget() public {
        AgreementFactory.DealParams memory p = _defaultParams();
        p.budget = 0;

        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidBudget.selector);
        factory.createDeal(p);

        p = _defaultParams();
        p.seniorPrincipal = 100_000_000e6; // mismatch with budget
        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidBudget.selector);
        factory.createDeal(p);
    }

    function test_CreateDeal_RevertInvalidClaimMultiple() public {
        AgreementFactory.DealParams memory p = _defaultParams();
        p.seniorMultipleBps = 9000; // < 10000

        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidClaimMultiple.selector);
        factory.createDeal(p);

        p = _defaultParams();
        p.juniorMultipleBps = 11000; // < seniorMultipleBps (12500)
        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidClaimMultiple.selector);
        factory.createDeal(p);
    }

    function test_GetDeal_RevertNotFound() public {
        vm.expectRevert(AgreementFactory.DealNotFound.selector);
        factory.getDeal(99);
    }

    function test_SetDealCreator_OnlyOwner() public {
        vm.prank(stranger);
        vm.expectRevert();
        factory.setDealCreator(stranger, true);

        vm.prank(owner);
        vm.expectRevert(AgreementFactory.InvalidAddress.selector);
        factory.setDealCreator(address(0), true);
    }

    function test_CommitCID_And_GetMilestoneCIDs() public {
        AgreementFactory.DealParams memory p = _defaultParams();
        vm.prank(owner);
        (, AgreementFactory.DealAddresses memory addrs) = factory.createDeal(p);

        FitOutAgreement agreement = FitOutAgreement(addrs.agreement);

        // Commit CID as inspector
        vm.prank(inspector);
        agreement.commitCID(0, "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

        string[] memory cids = agreement.getMilestoneCIDs(0);
        assertEq(cids.length, 1);
        assertEq(cids[0], "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");

        // Landlord can also commit
        vm.prank(landlord);
        agreement.commitCID(0, "bafybeicg2ggwti5qzwtg4");
        cids = agreement.getMilestoneCIDs(0);
        assertEq(cids.length, 2);

        // Stranger reverts
        vm.prank(stranger);
        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        agreement.commitCID(0, "test-cid");

        // Empty CID reverts
        vm.prank(inspector);
        vm.expectRevert(FitOutAgreement.EmptyCID.selector);
        agreement.commitCID(0, "");

        // Milestone index >= 3 reverts
        vm.prank(inspector);
        vm.expectRevert(FitOutAgreement.InvalidState.selector);
        agreement.commitCID(3, "valid-cid");
    }
}
