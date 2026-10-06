// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockIDR
 * @notice ERC-20 mock token representing Indonesian Rupiah for testnet demonstration.
 *         6 decimals. Public mint for demo purposes only.
 *
 * @dev NOT a real stablecoin. NOT pegged to any fiat currency.
 *      Deployed exclusively on testnets for hackathon demonstration.
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 1 (FR-C01)
 *   - docs/02_ECONOMIC_MODEL.md, Section 2 (parameter defaults)
 *   - docs/00_README_INDEX.md, Glossary (MockIDR: 6 decimals)
 */
contract MockIDR is ERC20 {
    /**
     * @notice Constructs the MockIDR token with 6 decimals
     * @dev Name and symbol chosen to clearly indicate this is a mock token
     */
    constructor() ERC20("Mock Indonesian Rupiah", "MockIDR") {}

    /**
     * @notice Returns 6 decimals to match Rupiah precision
     * @dev Critical: Must return 6, not the default 18
     *      All economic calculations in docs assume 6 decimals
     * @return uint8 Always returns 6
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Public mint function for testnet demonstration
     * @dev Allows anyone to mint tokens for testing purposes
     *      This is ONLY acceptable for testnet/demo environments
     *      Production implementation would require access control
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in 6 decimal precision)
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
