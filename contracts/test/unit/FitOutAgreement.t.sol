// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../../src/FitOutAgreement.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract FitOutAgreementTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
    }

    function test_Constructor_DerivedClaims() public view {
        assertEq(agreement.seniorClaim(), SENIOR_CLAIM);
        assertEq(agreement.juniorClaim(), JUNIOR_CLAIM);
        assertEq(agreement.totalClaim(), TOTAL_CLAIM);
    }

    function test_Constructor_BondAmount() public view {
        assertEq(agreement.bondAmount(), BOND_AMOUNT);
    }

    function test_Floor_d0_Returns0() public view {
        assertEq(agreement.floor(0), 0);
    }

    function test_Floor_TargetTenor() public view {
        uint256 f540 = agreement.floor(540);
        assertEq(f540, 115_200_000e6);
    }

    function test_Floor_MaxTenor() public view {
        uint256 f720 = agreement.floor(720);
        assertEq(f720, TOTAL_CLAIM);
    }

    function test_Floor_Beyond() public view {
        uint256 f1000 = agreement.floor(1000);
        assertEq(f1000, TOTAL_CLAIM);
    }

    function test_INV12_FloorMonotonic() public view {
        for (uint32 d = 0; d < 800; d += 50) {
            uint256 f1 = agreement.floor(d);
            uint256 f2 = agreement.floor(d + 1);
            assertGe(f2, f1);
            assertLe(f2, TOTAL_CLAIM);
        }
    }

    function test_Bond_Deposit_OnlyTenant() public {
        vm.prank(landlord);
        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        agreement.depositBond(BOND_AMOUNT);
    }

    function test_Bond_Deposit_Success() public {
        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond(BOND_AMOUNT);
        vm.stopPrank();
        assertEq(agreement.bondBalance(), BOND_AMOUNT);
    }

    function test_Bond_Deposit_OnlyOnce() public {
        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT * 2);
        agreement.depositBond(BOND_AMOUNT);
        vm.expectRevert(FitOutAgreement.BondAlreadyDeposited.selector);
        agreement.depositBond(BOND_AMOUNT);
        vm.stopPrank();
    }

    function test_Bond_Conservation() public view {
        assertEq(agreement.bondBalance() + agreement.bondDrawn() + agreement.bondRefunded(),
            agreement.bondDeposited());
    }

    function test_ExcusedDays_OnlyArbiter() public {
        vm.prank(landlord);
        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        agreement.markExcused(1, 7, bytes32(0));
    }

    function test_LogicalDays_Initial() public view {
        assertEq(agreement.logicalDays(), 0);
    }

    function test_CurrentFloor_Initial() public view {
        assertEq(agreement.currentFloor(), 0);
    }

    function test_Milestone_GetZero() public view {
        (uint16 bps, FitOutAgreement.MilestoneStatus status,,,,) = agreement.getMilestone(0);
        assertEq(bps, 3000);
        assertEq(uint256(status), 0);
    }

    function test_Milestone_GetOne() public view {
        (uint16 bps,,,,, ) = agreement.getMilestone(1);
        assertEq(bps, 4000);
    }

    function test_Milestone_GetTwo() public view {
        (uint16 bps,,,,, ) = agreement.getMilestone(2);
        assertEq(bps, 3000);
    }

    function test_BondConservation() public {
        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond(BOND_AMOUNT);
        vm.stopPrank();
        assertTrue(agreement.bondConservation());
    }
}
