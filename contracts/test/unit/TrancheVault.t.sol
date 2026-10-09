// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {TrancheVault} from "../../src/TrancheVault.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract TrancheVaultTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
    }

    function test_Deposit_Basic() public {
        uint256 amount = 100_000_000e6;
        vm.startPrank(alice);
        token.approve(address(seniorVault), amount);
        uint256 shares = seniorVault.deposit(amount, alice);
        vm.stopPrank();
        assertEq(seniorVault.balanceOf(alice), shares);
        assertEq(seniorVault.idleCash(), amount);
    }

    function test_Deposit_Multiple() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 50_000_000e6);
        seniorVault.deposit(50_000_000e6, alice);
        vm.stopPrank();
        vm.startPrank(bob);
        token.approve(address(seniorVault), 75_000_000e6);
        seniorVault.deposit(75_000_000e6, bob);
        vm.stopPrank();
        assertEq(seniorVault.totalAssets(), 125_000_000e6);
    }

    function test_Withdraw_LimitedByIdleCash() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 100_000_000e6);
        seniorVault.deposit(100_000_000e6, alice);
        vm.stopPrank();
        vm.prank(address(agreement));
        seniorVault.deploy(60_000_000e6, contractor);
        assertEq(seniorVault.maxWithdraw(alice), 40_000_000e6);
    }

    function test_Deploy_OnlyAgreement() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 100_000_000e6);
        seniorVault.deposit(100_000_000e6, alice);
        vm.stopPrank();
        vm.prank(bob);
        vm.expectRevert(TrancheVault.OnlyAgreement.selector);
        seniorVault.deploy(50_000_000e6, contractor);
    }

    function test_Deploy_UpdatesAccounting() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 100_000_000e6);
        seniorVault.deposit(100_000_000e6, alice);
        vm.stopPrank();
        vm.prank(address(agreement));
        seniorVault.deploy(60_000_000e6, contractor);
        assertEq(seniorVault.idleCash(), 40_000_000e6);
        assertEq(seniorVault.principalOutstanding(), 60_000_000e6);
    }

    function test_Repayment_FullRecovery() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 100_000_000e6);
        seniorVault.deposit(100_000_000e6, alice);
        vm.stopPrank();
        vm.prank(address(agreement));
        seniorVault.deploy(100_000_000e6, contractor);
        vm.startPrank(address(router));
        token.approve(address(seniorVault), 120_000_000e6);
        seniorVault.onRepayment(120_000_000e6);
        vm.stopPrank();
        assertEq(seniorVault.principalOutstanding(), 0);
        assertEq(seniorVault.idleCash(), 120_000_000e6);
    }

    function test_Transfer_AllowlistRequired() public {
        vm.startPrank(alice);
        token.approve(address(seniorVault), 100_000_000e6);
        uint256 shares = seniorVault.deposit(100_000_000e6, alice);
        vm.stopPrank();
        address notAllowed = makeAddr("notAllowed");
        vm.startPrank(alice);
        vm.expectRevert(TrancheVault.RecipientNotAllowlisted.selector);
        seniorVault.transfer(notAllowed, shares / 2);
        vm.stopPrank();
    }

    function test_SetAgreement_OnlyOnce() public {
        vm.expectRevert();
        seniorVault.setAgreement(makeAddr("new"));
    }

    function test_SetAllowlist_OnlyAdmin() public {
        vm.prank(alice);
        vm.expectRevert(TrancheVault.OnlyAdmin.selector);
        seniorVault.setAllowlist(bob, true);
    }
}
