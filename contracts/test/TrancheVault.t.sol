// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TrancheVault Test Suite
 * @notice Comprehensive tests for TrancheVault implementation
 * @dev Test IDs referenced from docs/05_SMART_CONTRACT_SPEC.md, Section 13
 *      Tests cover T-02, T-17, T-18, T-24, INV-04, INV-05
 */
contract TrancheVaultTest is Test {
    MockIDR public token;
    TrancheVault public vault;
    
    address public admin = address(this);
    address public agreement = makeAddr("agreement");
    address public router = makeAddr("router");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public contractor = makeAddr("contractor");
    
    uint256 constant INITIAL_MINT = 1_000_000_000e6; // 1B IDR

    function setUp() public {
        token = new MockIDR();
        vault = new TrancheVault(IERC20(address(token)), "Senior Tranche Vault", "sTRV", admin);
        
        vault.setAgreement(agreement);
        vault.setRouter(router);
        vault.setAllowlist(alice, true);
        vault.setAllowlist(bob, true);
        
        token.mint(alice, INITIAL_MINT);
        token.mint(bob, INITIAL_MINT);
        token.mint(router, INITIAL_MINT);
    }

    // ========================================
    // T-02: Basic Vault Operations
    // ========================================

    function test_T02_BasicDeposit() public {
        uint256 depositAmount = 100_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        uint256 shares = vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        assertEq(vault.balanceOf(alice), shares);
        assertEq(vault.idleCash(), depositAmount);
        assertEq(vault.totalAssets(), depositAmount);
        assertEq(vault.principalOutstanding(), 0);
    }

    function test_T02_WithdrawalLimitedByIdleCash() public {
        uint256 depositAmount = 100_000_000e6;
        uint256 deployAmount = 60_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        vm.prank(agreement);
        vault.deploy(deployAmount, contractor);
        
        uint256 maxWithdrawable = vault.maxWithdraw(alice);
        assertEq(maxWithdrawable, depositAmount - deployAmount);
        
        vm.startPrank(alice);
        vm.expectRevert(TrancheVault.InsufficientIdleCash.selector);
        vault.withdraw(depositAmount, alice, alice);
        vm.stopPrank();
    }

    function test_T02_TotalAssetsCalculation() public {
        uint256 depositAmount = 150_000_000e6;
        uint256 deployAmount = 120_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        vm.prank(agreement);
        vault.deploy(deployAmount, contractor);
        
        assertEq(vault.totalAssets(), depositAmount);
        assertEq(vault.idleCash(), depositAmount - deployAmount);
        assertEq(vault.principalOutstanding(), deployAmount);
    }

    // ========================================
    // T-17: Repayment & Principal Recovery
    // ========================================

    function test_T17_RepaymentPrincipalFirst() public {
        uint256 depositAmount = 100_000_000e6;
        uint256 deployAmount = 100_000_000e6;
        uint256 repaymentAmount = 120_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        vm.prank(agreement);
        vault.deploy(deployAmount, contractor);
        
        vm.startPrank(router);
        token.approve(address(vault), repaymentAmount);
        vault.onRepayment(repaymentAmount);
        vm.stopPrank();
        
        assertEq(vault.principalOutstanding(), 0, "Principal fully recovered");
        assertEq(vault.idleCash(), repaymentAmount, "All repayment in idleCash");
    }

    function test_T17_PartialRepayment() public {
        uint256 depositAmount = 100_000_000e6;
        uint256 deployAmount = 100_000_000e6;
        uint256 partialRepayment = 50_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        vm.prank(agreement);
        vault.deploy(deployAmount, contractor);
        
        vm.startPrank(router);
        token.approve(address(vault), partialRepayment);
        vault.onRepayment(partialRepayment);
        vm.stopPrank();
        
        assertEq(vault.principalOutstanding(), deployAmount - partialRepayment);
        assertEq(vault.idleCash(), partialRepayment);
    }

    // ========================================
    // T-18: Write-Off & Share Price Impact
    // ========================================

    function test_T18_WriteOffReducesSharePrice() public {
        uint256 depositAmount = 150_000_000e6;
        uint256 deployAmount = 120_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        vm.prank(agreement);
        vault.deploy(deployAmount, contractor);
        
        uint256 sharePriceBefore = vault.convertToAssets(1e6);
        
        vm.prank(agreement);
        vault.writeOffRemaining();
        
        uint256 sharePriceAfter = vault.convertToAssets(1e6);
        assertLt(sharePriceAfter, sharePriceBefore, "Share price decreased");
        assertEq(vault.principalOutstanding(), 0, "Principal written off");
    }

    // ========================================
    // T-24: Donation Attack Protection
    // ========================================

    function testFuzz_T24_DonationDoesNotInflateShares(uint256 donationAmount) public {
        donationAmount = bound(donationAmount, 1e6, 1_000_000_000e6);
        
        uint256 depositAmount = 100_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        vault.deposit(depositAmount, alice);
        vm.stopPrank();
        
        uint256 totalAssetsBefore = vault.totalAssets();
        uint256 idleCashBefore = vault.idleCash();
        uint256 principalBefore = vault.principalOutstanding();
        uint256 sharePriceBefore = vault.convertToAssets(1e6);
        
        token.mint(address(vault), donationAmount);
        
        assertEq(vault.totalAssets(), totalAssetsBefore, "totalAssets unchanged");
        assertEq(vault.idleCash(), idleCashBefore, "idleCash unchanged");
        assertEq(vault.principalOutstanding(), principalBefore, "principalOutstanding unchanged");
        assertEq(vault.convertToAssets(1e6), sharePriceBefore, "Share price unchanged");
    }

    function test_T24_DonationScenarioExtended() public {
        uint256 aliceDeposit = 100_000_000e6;
        uint256 donationAmount = 50_000_000e6;
        uint256 bobDeposit = 50_000_000e6;
        
        vm.startPrank(alice);
        token.approve(address(vault), aliceDeposit);
        vault.deposit(aliceDeposit, alice);
        vm.stopPrank();
        
        uint256 sharePriceBefore = vault.convertToAssets(1e6);
        
        token.mint(address(vault), donationAmount);
        
        assertEq(vault.convertToAssets(1e6), sharePriceBefore, "Donation did not change price");
        
        vm.startPrank(bob);
        token.approve(address(vault), bobDeposit);
        uint256 bobShares = vault.deposit(bobDeposit, bob);
        vm.stopPrank();
        
        assertApproxEqRel(bobShares, bobDeposit, 0.01e18, "Bob got fair rate");
        assertEq(vault.totalAssets(), aliceDeposit + bobDeposit, "Only deposits counted");
    }

    // ========================================
    // Access Control Tests
    // ========================================

    function test_OnlyAgreementCanDeploy() public {
        vm.expectRevert(TrancheVault.OnlyAgreement.selector);
        vault.deploy(1000e6, contractor);
    }

    function test_TransferToNonAllowlistedReverts() public {
        uint256 depositAmount = 100_000_000e6;
        address charlie = makeAddr("charlie");
        
        vm.startPrank(alice);
        token.approve(address(vault), depositAmount);
        uint256 shares = vault.deposit(depositAmount, alice);
        
        vm.expectRevert(TrancheVault.RecipientNotAllowlisted.selector);
        vault.transfer(charlie, shares);
        vm.stopPrank();
    }

    function test_MockIDRHas6Decimals() public {
        assertEq(token.decimals(), 6, "MockIDR must have 6 decimals");
    }
}
