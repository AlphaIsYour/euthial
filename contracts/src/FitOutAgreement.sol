// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title FitOutAgreement
 * @notice Master contract managing the lifecycle of a single ruko fit-out
 *         financing agreement. Handles parameters, state machine, bond escrow,
 *         milestone releases, and covenant escalation logic.
 *
 * @dev State machine phases:
 *   DRAFT -> FUNDRAISING -> BUILDING -> OPERATING -> RESIDUAL -> CLOSED
 *   With failure branches: FAILED_REFUND, ABORTED_REFUND
 *   And default branch: STEP_IN -> LIQUIDATING -> CLOSED
 *
 * Key design decision (D-21):
 *   If bond draw results in total claim being fully paid, transition to
 *   RESIDUAL takes priority over STEP_IN, even if breachCount >= 2.
 *
 * Covenant sub-states (during OPERATING):
 *   HEALTHY -> WARNING -> CURE -> BREACHED -> STEP_IN
 *   ORACLE_STALE overlays any state when attestation gap >= 3 logical days.
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 3, 4, 5.4-5.6, 6
 *   - docs/09_DECISION_LOG_OPEN_QUESTIONS.md, D-21 (claim fulfillment priority)
 *
 * Invariants:
 *   - INV-07: Phase transitions only per defined table; terminal phases absorbing.
 *   - INV-08: bondBalance + bondDrawn + bondRefunded == bondDeposited.
 *   - INV-09: Each milestone released at most once; total releases <= budget.
 *   - INV-10: No admin path to move vault/bond/router funds.
 *   - INV-12: Floor(d) non-decreasing and <= totalClaim.
 */

// TODO: Implement state machine, covenant, bond, and milestone logic.
// See GitHub Issue #03 for full specification and AI agent prompt.
