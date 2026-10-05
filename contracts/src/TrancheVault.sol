// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TrancheVault
 * @notice ERC-4626 vault with internal accounting (idleCash + principalOutstanding),
 *         share transfer allowlist, and phase-gated withdrawals.
 *         Instantiated twice per agreement: Senior and Junior.
 *
 * @dev Key design decisions:
 *   - Internal accounting prevents share inflation attacks via token donation.
 *   - Deposit only during FUNDRAISING phase at 1:1 share price.
 *   - Repayment prioritizes principal recovery before recognizing yield.
 *   - Transfer restricted to allowlisted addresses (no AMM, no secondary market).
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 7
 *   - docs/09_DECISION_LOG_OPEN_QUESTIONS.md, D-10
 *
 * Invariants:
 *   - INV-04: Share price non-decreasing except writeOffRemaining().
 *   - INV-05: idleCash <= token.balanceOf(vault).
 *   - INV-14: Transfer only to allowlisted addresses.
 */

// TODO: Implement ERC-4626 with OpenZeppelin v5
// See GitHub Issue #01 for full specification and AI agent prompt.
