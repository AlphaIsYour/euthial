// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WaterfallRouter
 * @notice Verifies EIP-712 signed settlement attestations and computes
 *         the waterfall split across Senior vault, Junior vault, and Landlord.
 *
 * @dev Settlement flow:
 *   1. Attestor signs Settlement struct via EIP-712.
 *   2. Anyone (relayer) calls settle(Settlement, signature).
 *   3. Router verifies signature, enforces monotonic dayId, checks MAX_GAP.
 *   4. Computes split per Phase A or Phase B formulas.
 *   5. Pulls only the non-tenant portion (pull = landlordAmt + investorAmt)
 *      from attestor via SafeERC20 transferFrom.
 *   6. Distributes to SeniorVault.onRepayment(), JuniorVault.onRepayment(),
 *      and landlord address.
 *   7. Hooks into FitOutAgreement for covenant evaluation.
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 5.1, 5.2, 8
 *   - docs/02_ECONOMIC_MODEL.md, Section 3 (waterfall definition)
 *
 * Invariants:
 *   - INV-01: landlordAmt + toSenior + toJunior = pull <= G.
 *   - INV-02: Router token balance unchanged after settle().
 *   - INV-03: juniorPaid > 0 implies seniorPaid == seniorClaim.
 *   - INV-06: dayId strictly monotonic; one settlement per dayId.
 */

// TODO: Implement with OpenZeppelin v5 (EIP712, ECDSA, SafeERC20, ReentrancyGuard)
// See GitHub Issue #02 for full specification and AI agent prompt.
