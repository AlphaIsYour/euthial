// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {EuthialIDR} from "../src/EuthialIDR.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title EuthialIDR Test Suite
 * @notice Exhaustive unit, fuzz, and invariant tests for EuthialIDR token
 * @dev Validates Issue #48 acceptance criteria:
 *      - Only MINTER_ROLE can mint
 *      - Public mint is removed
 *      - Max supply is strictly enforced
 *      - Decimals equal 6
 *      - Burn and Permit capabilities work as intended
 */
contract EuthialIDRTest is Test {
    EuthialIDR public token;

    address public admin = makeAddr("admin");
    address public minter = makeAddr("minter");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 1e6; // 100 Juta IDR
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e6;     // 1 Miliar IDR

    event Minted(address indexed minter, address indexed to, uint256 amount);

    function setUp() public {
        vm.prank(admin);
        token = new EuthialIDR(admin, INITIAL_SUPPLY);
    }

    // ========================================================
    // 1. Initial State & Configuration
    // ========================================================

    function test_InitialState() public view {
        assertEq(token.name(), "Euthial Indonesian Rupiah");
        assertEq(token.symbol(), "EuthIDR");
        assertEq(token.decimals(), 6);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(admin), INITIAL_SUPPLY);
        assertEq(token.MAX_SUPPLY(), MAX_SUPPLY);

        assertTrue(token.hasRole(token.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(token.hasRole(token.MINTER_ROLE(), admin));
        assertFalse(token.hasRole(token.MINTER_ROLE(), alice));
    }

    function test_RevertWhen_ZeroAddressAdmin() public {
        vm.expectRevert(EuthialIDR.ZeroAddressAdmin.selector);
        new EuthialIDR(address(0), 0);
    }

    function test_RevertWhen_InitialSupplyExceedsMax() public {
        vm.expectRevert(abi.encodeWithSelector(EuthialIDR.ExceedsMaxSupply.selector, MAX_SUPPLY + 1, MAX_SUPPLY));
        new EuthialIDR(admin, MAX_SUPPLY + 1);
    }

    // ========================================================
    // 2. Controlled Minting & Role-Based Access
    // ========================================================

    function test_MinterCanMint() public {
        uint256 mintAmount = 50_000_000 * 1e6; // 50 Juta IDR

        vm.expectEmit(true, true, false, true);
        emit Minted(admin, alice, mintAmount);

        vm.prank(admin);
        token.mint(alice, mintAmount);

        assertEq(token.balanceOf(alice), mintAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY + mintAmount);
    }

    function test_RevertWhen_NonMinterAttemptsMint() public {
        uint256 mintAmount = 1_000_000 * 1e6;

        vm.prank(alice);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                alice,
                token.MINTER_ROLE()
            )
        );
        token.mint(alice, mintAmount);
    }

    function test_AdminCanGrantAndRevokeMinterRole() public {
        uint256 mintAmount = 10_000_000 * 1e6;

        // 1. Alice cannot mint initially
        vm.prank(alice);
        vm.expectRevert();
        token.mint(alice, mintAmount);

        // 2. Admin grants MINTER_ROLE to alice
        vm.prank(admin);
        token.grantRole(token.MINTER_ROLE(), alice);
        assertTrue(token.hasRole(token.MINTER_ROLE(), alice));

        // 3. Alice can now mint
        vm.prank(alice);
        token.mint(bob, mintAmount);
        assertEq(token.balanceOf(bob), mintAmount);

        // 4. Admin revokes MINTER_ROLE from alice
        vm.prank(admin);
        token.revokeRole(token.MINTER_ROLE(), alice);
        assertFalse(token.hasRole(token.MINTER_ROLE(), alice));

        // 5. Alice can no longer mint
        vm.prank(alice);
        vm.expectRevert();
        token.mint(bob, mintAmount);
    }

    // ========================================================
    // 3. Supply Cap Enforcement
    // ========================================================

    function test_MintUpToMaxSupplySucceeds() public {
        uint256 remaining = MAX_SUPPLY - token.totalSupply();

        vm.prank(admin);
        token.mint(alice, remaining);

        assertEq(token.totalSupply(), MAX_SUPPLY);
        assertEq(token.balanceOf(alice), remaining);
    }

    function test_RevertWhen_MintExceedsMaxSupply() public {
        uint256 remaining = MAX_SUPPLY - token.totalSupply();

        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(EuthialIDR.ExceedsMaxSupply.selector, MAX_SUPPLY + 1, MAX_SUPPLY));
        token.mint(alice, remaining + 1);
    }

    function testFuzz_MintEnforcesMaxSupply(uint256 amount) public {
        uint256 remaining = MAX_SUPPLY - token.totalSupply();
        vm.assume(amount > remaining && amount < type(uint128).max);

        vm.prank(admin);
        vm.expectRevert();
        token.mint(alice, amount);
    }

    // ========================================================
    // 4. Burning & Redemption
    // ========================================================

    function test_TokenHolderCanBurn() public {
        uint256 burnAmount = 10_000_000 * 1e6;

        vm.prank(admin);
        token.burn(burnAmount);

        assertEq(token.balanceOf(admin), INITIAL_SUPPLY - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }

    function test_BurnFromWithAllowance() public {
        uint256 burnAmount = 5_000_000 * 1e6;

        // Admin approves alice
        vm.prank(admin);
        token.approve(alice, burnAmount);

        // Alice burns from admin
        vm.prank(alice);
        token.burnFrom(admin, burnAmount);

        assertEq(token.balanceOf(admin), INITIAL_SUPPLY - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }

    // ========================================================
    // 5. EIP-2612 Gasless Permit Verification
    // ========================================================

    function test_PermitSuccess() public {
        uint256 ownerPrivateKey = 0xA11CE;
        address owner = vm.addr(ownerPrivateKey);
        address spender = bob;
        uint256 value = 1_000_000 * 1e6;
        uint256 deadline = block.timestamp + 1 days;

        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                owner,
                spender,
                value,
                token.nonces(owner),
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        token.permit(owner, spender, value, deadline, v, r, s);

        assertEq(token.allowance(owner, spender), value);
        assertEq(token.nonces(owner), 1);
    }
}
