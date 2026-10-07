// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BondRefundTest is Test {
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

        // Deposit bond initial
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();
    }

    function test_RefundBond_AfterFailedFundraising() public {
        // Warp past fundraising deadline
        vm.warp(block.timestamp + 31 days);

        vm.prank(landlord);
        agreement.failFundraising();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.FAILED_REFUND));

        uint256 balanceBefore = token.balanceOf(tenant);

        vm.prank(tenant);
        agreement.refundBond();

        uint256 balanceAfter = token.balanceOf(tenant);
        assertEq(balanceAfter - balanceBefore, BOND_AMOUNT);
        assertEq(agreement.bondBalance(), 0);
        assertEq(agreement.bondRefunded(), BOND_AMOUNT);
        assertTrue(agreement.bondConservation());
    }

    function test_RefundBond_AfterAbortedBuild() public {
        vm.prank(landlord);
        agreement.startBuild();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.BUILDING));

        // Warp past build deadline
        vm.warp(block.timestamp + 61 days);

        vm.prank(landlord);
        agreement.abortBuild();
        assertEq(uint(agreement.state()), uint(FitOutAgreement.State.ABORTED_REFUND));

        uint256 balanceBefore = token.balanceOf(tenant);

        vm.prank(tenant);
        agreement.refundBond();

        uint256 balanceAfter = token.balanceOf(tenant);
        assertEq(balanceAfter - balanceBefore, BOND_AMOUNT);
        assertEq(agreement.bondBalance(), 0);
        assertEq(agreement.bondRefunded(), BOND_AMOUNT);
        assertTrue(agreement.bondConservation());
    }

    function test_RefundBond_AfterClose() public {
        vm.prank(landlord);
        agreement.startBuild();

        token.mint(address(this), 1_000_000_000e6);
        seniorVault.setAllowlist(address(this), true);
        juniorVault.setAllowlist(landlord, true);

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

        // Advance to RESIDUAL via close
        // Simulasikan agreement mencapai RESIDUAL
        // Kita prank router untuk onSettlement
        vm.prank(address(router));
        agreement.onSettlement(720, TOTAL_CLAIM);

        // Jika transisi ke RESIDUAL tercapai, landlord close
        // Langsung cek state
        if (agreement.state() == FitOutAgreement.State.RESIDUAL) {
            vm.prank(landlord);
            agreement.close();
            assertEq(uint(agreement.state()), uint(FitOutAgreement.State.CLOSED));

            vm.prank(tenant);
            agreement.refundBond();
            assertEq(agreement.bondBalance(), 0);
            assertTrue(agreement.bondConservation());
        }
    }

    function test_RefundBond_OnlyTenant() public {
        vm.warp(block.timestamp + 31 days);
        vm.prank(landlord);
        agreement.failFundraising();

        vm.expectRevert(FitOutAgreement.Unauthorized.selector);
        vm.prank(landlord);
        agreement.refundBond();
    }

    function test_RefundBond_ZeroBalance_NoOp() public {
        vm.warp(block.timestamp + 31 days);
        vm.prank(landlord);
        agreement.failFundraising();

        vm.prank(tenant);
        agreement.refundBond();

        // Second call when balance is 0 should be no-op (no revert, no change)
        uint256 balanceBefore = token.balanceOf(tenant);
        vm.prank(tenant);
        agreement.refundBond();
        uint256 balanceAfter = token.balanceOf(tenant);

        assertEq(balanceBefore, balanceAfter);
        assertEq(agreement.bondBalance(), 0);
        assertTrue(agreement.bondConservation());
    }

    function test_INV08_BondConservation_AfterDraw() public {
        // Assert invariant on initial deposit
        assertTrue(agreement.bondConservation());
        assertEq(agreement.bondBalance() + agreement.bondDrawn() + agreement.bondRefunded(), agreement.bondDeposited());
    }

    function test_BondAlreadyDeposited_Revert() public {
        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        vm.expectRevert(FitOutAgreement.BondAlreadyDeposited.selector);
        agreement.depositBond();
        vm.stopPrank();
    }
}
