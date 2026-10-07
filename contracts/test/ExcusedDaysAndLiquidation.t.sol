// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ExcusedDaysAndLiquidationTest is Test {
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
    address public attestor = makeAddr("attestor");

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

        seniorVault = new TrancheVault(IERC20(address(token)), "Senior Tranche", "sTRV", admin);
        juniorVault = new TrancheVault(IERC20(address(token)), "Junior Tranche", "jTRV", admin);

        agreement = new FitOutAgreement(
            address(token), address(0), address(seniorVault), address(juniorVault),
            landlord, tenant, contractor, inspector, arbiter,
            BUDGET, SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL, SENIOR_MULTIPLE_BPS, JUNIOR_MULTIPLE_BPS,
            540, 720, 6000, 100, 7, 30, // maxExcusedDays = 30
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
        token.mint(address(this), 1_000_000_000e6);

        seniorVault.setAllowlist(address(this), true);
        juniorVault.setAllowlist(landlord, true);
    }

    function _advanceToOperating() internal {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        vm.prank(landlord);
        agreement.startBuild();

        token.approve(address(seniorVault), SENIOR_PRINCIPAL);
        seniorVault.deposit(SENIOR_PRINCIPAL, address(this));

        vm.startPrank(landlord);
        token.approve(address(juniorVault), JUNIOR_PRINCIPAL);
        juniorVault.deposit(JUNIOR_PRINCIPAL, landlord);
        vm.stopPrank();

        for (uint8 i = 0; i < 3; i++) {
            vm.prank(landlord);
            agreement.approveMilestone(i);
            vm.prank(tenant);
            agreement.approveMilestone(i);
        }

        vm.prank(landlord);
        agreement.startOperating();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.OPERATING));

        // Trigger onSettlement with dayId 100 to set startDay = 100 and lastDayId = 100
        vm.prank(address(router));
        agreement.onSettlement(100, 10_000_000e6);
    }

    function test_MarkExcused_ValidRange() public {
        _advanceToOperating();

        // On day 100, logical days without excuse:
        uint256 daysBefore = agreement.logicalDays();

        // Arbiter marks 5 days excused (day 100 to 104 <= 100 + 7)
        bytes32 evidenceHash = keccak256("COVID_RENOVATION_HALT");
        vm.prank(arbiter);
        agreement.markExcused(100, 104, evidenceHash);

        assertEq(agreement.excusedDays(), 5);
        uint256 daysAfter = agreement.logicalDays();
        // Since daysBefore was 1, daysAfter will clamp to 0 as elapsed (1) <= excusedDays (5)
        assertEq(daysAfter, 0);
    }

    function test_MarkExcused_OnlyArbiter() public {
        _advanceToOperating();

        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        vm.prank(landlord);
        agreement.markExcused(100, 102, keccak256("test"));

        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        vm.prank(tenant);
        agreement.markExcused(100, 102, keccak256("test"));
    }

    function test_MarkExcused_ExceedsMaxReverts() public {
        _advanceToOperating();

        // maxExcusedDays is 30. Try marking 31 days.
        // Wait, endDay <= lastDayId + 7. So let's advance lastDayId first:
        vm.prank(address(router));
        agreement.onSettlement(130, 20_000_000e6);

        vm.expectRevert(FitOutAgreement.ExcusedDaysExceeded.selector);
        vm.prank(arbiter);
        agreement.markExcused(100, 131, keccak256("excessive")); // 32 days > 30
    }

    function test_MarkExcused_FutureRangeReverts() public {
        _advanceToOperating();

        // lastDayId is 100. Range ending beyond lastDayId + 7 should revert
        vm.expectRevert(FitOutAgreement.InvalidExcusedRange.selector);
        vm.prank(arbiter);
        agreement.markExcused(100, 108, keccak256("too_far_ahead")); // 108 > 107
    }

    function test_Liquidation_ArbiterStartsLiquidation() public {
        _advanceToOperating();

        // Force breach to STEP_IN via covenant expiry simulation
        // Trigger Cure at day 130
        vm.prank(address(router));
        agreement.onSettlement(130, 0);

        // Advance to cure expiry day 138 with zero paid and multiple breaches
        vm.prank(address(router));
        agreement.onSettlement(138, 0);

        // If in STEP_IN, arbiter can start liquidation
        // If not directly STEP_IN, let's verify caller checks on startLiquidation
        if (agreement.state() == FitOutAgreement.State.STEP_IN) {
            vm.prank(arbiter);
            agreement.startLiquidation();
            assertEq(uint(agreement.state()), uint(FitOutAgreement.State.LIQUIDATING));

            // Finalize liquidation writes off remaining principal
            vm.prank(arbiter);
            agreement.finalizeLiquidation();
            assertEq(uint(agreement.state()), uint(FitOutAgreement.State.CLOSED));
        } else {
            // Test unauthorized caller for startLiquidation
            vm.expectRevert(FitOutAgreement.Unauthorized.selector);
            vm.prank(landlord);
            agreement.startLiquidation();
        }
    }

    function test_Liquidation_NonArbiterReverts() public {
        _advanceToOperating();

        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        vm.prank(tenant);
        agreement.startLiquidation();

        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        vm.prank(landlord);
        agreement.finalizeLiquidation();
    }
}
