// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {EuthialIDR} from "../../src/EuthialIDR.sol";

contract EuthialIDRTest is Test {
    EuthialIDR public token;
    address public admin = address(this);
    address public minter = makeAddr("minter");
    address public user = makeAddr("user");
    address public other = makeAddr("other");

    function setUp() public {
        token = new EuthialIDR(admin, 0);
    }

    function test_Constructor_GrantsAdminRole() public view {
        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_Constructor_GrantsMinterRole() public view {
        assertTrue(token.hasRole(token.MINTER_ROLE(), admin));
    }

    function test_Constructor_ZeroAddressAdmin_Reverts() public {
        vm.expectRevert(EuthialIDR.ZeroAddressAdmin.selector);
        new EuthialIDR(address(0), 0);
    }

    function test_Constructor_InitialSupply_Minted() public {
        uint256 initialSupply = 1_000_000e6;
        EuthialIDR newToken = new EuthialIDR(admin, initialSupply);
        assertEq(newToken.balanceOf(admin), initialSupply);
        assertEq(newToken.totalSupply(), initialSupply);
    }

    function test_Decimals_Returns6() public view {
        assertEq(token.decimals(), 6);
    }

    function test_Mint_Authorized_Success() public {
        uint256 amount = 1_000_000e6;
        token.mint(user, amount);
        assertEq(token.balanceOf(user), amount);
        assertEq(token.totalSupply(), amount);
    }

    function test_Mint_Unauthorized_Reverts() public {
        vm.prank(other);
        vm.expectRevert();
        token.mint(user, 1_000_000e6);
    }

    function test_Mint_MinterRole_Success() public {
        token.grantRole(token.MINTER_ROLE(), minter);
        vm.prank(minter);
        token.mint(user, 1_000_000e6);
        assertEq(token.balanceOf(user), 1_000_000e6);
    }

    function test_Mint_ExceedsMaxSupply_Reverts() public {
        uint256 tooMuch = token.MAX_SUPPLY() + 1;
        vm.expectRevert(abi.encodeWithSelector(
            EuthialIDR.ExceedsMaxSupply.selector, tooMuch, token.MAX_SUPPLY()
        ));
        token.mint(user, tooMuch);
    }

    function test_Mint_NearMaxSupply_Success() public {
        uint256 near = token.MAX_SUPPLY() - 1e6;
        token.mint(user, near);
        assertEq(token.balanceOf(user), near);
    }

    function test_Mint_ZeroAmount() public {
        token.mint(user, 0);
        assertEq(token.balanceOf(user), 0);
    }

    function test_Burn_Success() public {
        uint256 amount = 1_000_000e6;
        token.mint(user, amount);
        vm.prank(user);
        token.burn(500_000e6);
        assertEq(token.balanceOf(user), amount - 500_000e6);
    }

    function test_Burn_InsufficientBalance_Reverts() public {
        token.mint(user, 1_000_000e6);
        vm.prank(user);
        vm.expectRevert();
        token.burn(2_000_000e6);
    }

    function test_GrantRole_AdminCanGrant() public {
        token.grantRole(token.MINTER_ROLE(), minter);
        assertTrue(token.hasRole(token.MINTER_ROLE(), minter));
    }

    function test_RevokeRole_AdminCanRevoke() public {
        token.grantRole(token.MINTER_ROLE(), minter);
        token.revokeRole(token.MINTER_ROLE(), minter);
        assertFalse(token.hasRole(token.MINTER_ROLE(), minter));
    }

    function test_RevokeRole_MinterCannotMintAfter() public {
        token.grantRole(token.MINTER_ROLE(), minter);
        token.revokeRole(token.MINTER_ROLE(), minter);
        vm.prank(minter);
        vm.expectRevert();
        token.mint(user, 1_000_000e6);
    }

    function test_Mint_MaxSupply_Exactly() public {
        token.mint(user, token.MAX_SUPPLY());
        assertEq(token.totalSupply(), token.MAX_SUPPLY());
    }

    function test_Transfer_AfterMint() public {
        token.mint(user, 1_000_000e6);
        vm.prank(user);
        token.transfer(other, 500_000e6);
        assertEq(token.balanceOf(user), 500_000e6);
        assertEq(token.balanceOf(other), 500_000e6);
    }

    function test_Approve_AndTransferFrom() public {
        token.mint(user, 1_000_000e6);
        vm.prank(user);
        token.approve(other, 500_000e6);
        vm.prank(other);
        token.transferFrom(user, other, 500_000e6);
        assertEq(token.balanceOf(user), 500_000e6);
        assertEq(token.balanceOf(other), 500_000e6);
    }
}
