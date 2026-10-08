// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title EuthialIDR
 * @notice Controlled ERC-20 token representing digital Indonesian Rupiah (IDR) for the Euthial Protocol.
 *         Precision: 6 decimals (1 IDR = 1,000,000 token units).
 *         Max Supply: 1,000,000,000 IDR (1 Billion IDR).
 *
 * @dev Replaces MockIDR for production and testnet environments.
 *      Key security features:
 *      - Role-Based Access Control: Only authorized addresses with MINTER_ROLE can mint.
 *      - Hard supply cap: Total supply cannot exceed MAX_SUPPLY.
 *      - Burnable: Token holders or authorized burners can redeem/burn tokens.
 *      - EIP-2612 Permit: Supports gasless approvals for frictionless UX.
 *
 * References:
 *   - Issue #48: Upgrade MockIDR -> EuthialIDR (Controlled ERC-20 Stablecoin)
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 1 (FR-C01)
 *   - docs/00_README_INDEX.md, Glossary (EuthialIDR: 6 decimals)
 */
contract EuthialIDR is ERC20, ERC20Burnable, ERC20Permit, AccessControl {
    /// @notice Role identifier for addresses allowed to mint new tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Absolute maximum supply cap: 1,000,000,000 IDR with 6 decimals (10^15 units)
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e6;

    /// @notice Custom error thrown when minting would breach the maximum supply cap
    error ExceedsMaxSupply(uint256 attempted, uint256 maxSupply);

    /// @notice Custom error thrown when admin address is zero
    error ZeroAddressAdmin();

    /**
     * @notice Emitted when tokens are minted by an authorized minter
     * @param minter The address executing the mint
     * @param to The recipient of minted tokens
     * @param amount The quantity of tokens minted
     */
    event Minted(address indexed minter, address indexed to, uint256 amount);

    /**
     * @notice Constructs the EuthialIDR token
     * @param initialAdmin Address granted DEFAULT_ADMIN_ROLE and MINTER_ROLE
     * @param initialSupply Optional initial supply minted to the admin (can be 0)
     */
    constructor(address initialAdmin, uint256 initialSupply)
        ERC20("Euthial Indonesian Rupiah", "EuthIDR")
        ERC20Permit("Euthial Indonesian Rupiah")
    {
        if (initialAdmin == address(0)) {
            revert ZeroAddressAdmin();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(MINTER_ROLE, initialAdmin);

        if (initialSupply > 0) {
            if (initialSupply > MAX_SUPPLY) {
                revert ExceedsMaxSupply(initialSupply, MAX_SUPPLY);
            }
            _mint(initialAdmin, initialSupply);
            emit Minted(initialAdmin, initialAdmin, initialSupply);
        }
    }

    /**
     * @notice Returns 6 decimals to match standard Rupiah / stablecoin precision
     * @return uint8 Always returns 6
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Controlled mint function restricted to accounts with MINTER_ROLE
     * @dev Replaces the unconstrained public mint from MockIDR
     * @param to The recipient address
     * @param amount Amount of tokens to mint (in 6 decimals)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (totalSupply() + amount > MAX_SUPPLY) {
            revert ExceedsMaxSupply(totalSupply() + amount, MAX_SUPPLY);
        }
        _mint(to, amount);
        emit Minted(msg.sender, to, amount);
    }
}
