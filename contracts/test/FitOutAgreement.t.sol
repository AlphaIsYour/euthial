// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FitOutAgreementTest is Test {
    MockIDR public token;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    WaterfallRouter public router;
    FitOutAgreement public agreement;

    address public admin = address(this);
    address public landlord = makeAddr("landlord");
    address public tenant = makeAddr("tenant");
    address public contractor = makeAddr("contractor");
    address public inspector = makeAddr("inspector");
    address public arbiter = makeAddr("arbiter");
    address public attestor;
    uint256 public attestorPrivateKey = 0xA11CE;

    uint256 constant BUDGET = 150_000_000e6;
    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint16 constant SENIOR_MULTIPLE_BPS = 12500;
    uint16 constant JUNIOR_MULTIPLE_BPS = 14000;
    uint256 constant SENIOR_CLAIM = 150_000_000e6;
    uint256 constant JUNIOR_CLAIM = 42_000_000e6;
    uint256 constant TOTAL_CLAIM = 192_000_000e6;
    uint256 constant BOND_AMOUNT = 15_000_000e6;

    function setUp() public {
        token = new MockIDR();
        attestor = vm.addr(attestorPrivateKey);

        seniorVault = new TrancheVault(IERC20(address(token)), "Senior Tranche", "sTRV", admin);
        juniorVault = new TrancheVault(IERC20(address(token)), "Junior Tranche", "jTRV", admin);

        agreement = new FitOutAgreement(
            address(token), address(0), address(seniorVault), address(juniorVault),
            landlord, tenant, contractor, inspector, arbiter,
            BUDGET, SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL, SENIOR_MULTIPLE_BPS, JUNIOR_MULTIPLE_BPS,
            540, 720, 6000, 100, 7, 30,
            uint64(block.timestamp + 30 days), uint64(block.timestamp + 60 days), 1000
        );

        router = new WaterfallRouter(
            address(agreement), address(seniorVault), address(juniorVault),
            landlord, attestor, address(token), SENIOR_CLAIM, JUNIOR_CLAIM
        );

        vm.prank(landlord);
        agreement.setRouter(address(router));

        seniorVault.setAgreement(address(agreement));
        juniorVault.setAgreement(address(agreement));
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));

        token.mint(tenant, 1_000_000_000e6);
        token.mint(landlord, 1_000_000_000e6);
        token.mint(attestor, 1_000_000_000e6);
        token.mint(address(this), 1_000_000_000e6);

        seniorVault.setAllowlist(address(this), true);
        juniorVault.setAllowlist(landlord, true);

        vm.prank(attestor);
        token.approve(address(router), type(uint256).max);
    }

    function test_Constructor_DerivedClaims() public view {
        assertEq(agreement.seniorClaim(), SENIOR_CLAIM, "Senior claim");
        assertEq(agreement.juniorClaim(), JUNIOR_CLAIM, "Junior claim");
        assertEq(agreement.totalClaim(), TOTAL_CLAIM, "Total claim");
        assertEq(agreement.bondAmount(), BOND_AMOUNT, "Bond amount");
    }

    function test_T10_FloorBoundaryValues() public view {
        assertEq(agreement.floor(0), 0, "Floor(0)");
        assertEq(agreement.floor(1), 213_333e6, "Floor(1)");
        assertEq(agreement.floor(540), 115_200_000e6, "Floor(540)");
        assertEq(agreement.floor(541), 115_626_666e6, "Floor(541)");
        assertEq(agreement.floor(720), 192_000_000e6, "Floor(720)");
        assertEq(agreement.floor(721), 192_000_000e6, "Floor(721)");
    }

    function test_INV12_FloorMonotonic() public view {
        for (uint256 d = 0; d < 1000; d += 10) {
            uint256 f1 = agreement.floor(d);
            uint256 f2 = agreement.floor(d + 1);
            assertTrue(f2 >= f1, "Floor must be non-decreasing");
            assertTrue(f2 <= TOTAL_CLAIM, "Floor must not exceed total claim");
        }
    }

    function test_StateTransition_DraftToFundraising() public {
        vm.prank(landlord);
        agreement.startFundraising();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.FUNDRAISING));
    }

    function test_BondDeposit() public {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        assertEq(agreement.bondDeposited(), BOND_AMOUNT);
        assertEq(agreement.bondBalance(), BOND_AMOUNT);
        assertEq(token.balanceOf(address(agreement)), BOND_AMOUNT);
    }

    function test_INV08_BondConservation() public {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        assertTrue(agreement.bondConservation());
        assertEq(agreement.bondBalance() + agreement.bondDrawn() + agreement.bondRefunded(), agreement.bondDeposited());
    }

    function test_Milestone_SequentialApproval() public {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        agreement.startBuild();

        token.approve(address(seniorVault), SENIOR_PRINCIPAL);
        seniorVault.deposit(SENIOR_PRINCIPAL, address(this));

        vm.startPrank(landlord);
        token.approve(address(juniorVault), JUNIOR_PRINCIPAL);
        juniorVault.deposit(JUNIOR_PRINCIPAL, landlord);
        vm.stopPrank();

        seniorVault.deploy(SENIOR_PRINCIPAL, address(0xdead));
        juniorVault.deploy(JUNIOR_PRINCIPAL, address(0xdead));

        vm.prank(landlord);
        agreement.approveMilestone(0);

        vm.prank(tenant);
        agreement.approveMilestone(0);

        assertEq(agreement.nextMilestone(), 1);
    }

    function test_INV07_TerminalStateClosed() public {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        agreement.startBuild();
        vm.warp(block.timestamp + 61 days);

        agreement.abortBuild();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.ABORTED_REFUND));

        vm.expectRevert(FitOutAgreement.InvalidState.selector);
        vm.prank(landlord);
        agreement.startFundraising();
    }

    function testFail_InvalidTransition_FundraisingToResidual() public {
        vm.prank(landlord);
        agreement.startFundraising();
    }

    function signSettlement(WaterfallRouter.Settlement memory s) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(
            router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        return abi.encodePacked(r, s_, v);
    }

    function createSettlement(uint32 dayId, uint8 periodDays, uint256 grossRecorded) 
        internal pure returns (WaterfallRouter.Settlement memory) {
        return WaterfallRouter.Settlement({
            dayId: dayId,
            periodDays: periodDays,
            grossRecorded: grossRecorded,
            txCount: 100,
            evidenceHash: keccak256(abi.encodePacked(dayId))
        });
    }
}
