// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Constants
 * @notice Shared protocol parameters for all tests
 * @dev References: docs/05_SMART_CONTRACT_SPEC.md Section 3, docs/02_ECONOMIC_MODEL.md Section 2
 */
contract Constants {
    // ========================================
    // Budget & Principal
    // ========================================
    uint256 public constant BUDGET = 150_000_000e6;
    uint256 public constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 public constant JUNIOR_PRINCIPAL = 30_000_000e6;

    // ========================================
    // Multiples & Claims
    // ========================================
    uint16 public constant SENIOR_MULTIPLE_BPS = 12500; // 1.25x
    uint16 public constant JUNIOR_MULTIPLE_BPS = 14000; // 1.40x
    uint256 public constant SENIOR_CLAIM = 150_000_000e6; // 120M × 1.25
    uint256 public constant JUNIOR_CLAIM = 42_000_000e6; // 30M × 1.40
    uint256 public constant TOTAL_CLAIM = 192_000_000e6;

    // ========================================
    // Bond
    // ========================================
    uint256 public constant BOND_AMOUNT = 15_000_000e6; // 10% of budget

    // ========================================
    // Time Parameters (in logical days)
    // ========================================
    uint32 public constant TARGET_TENOR_DAYS = 540; // 18 months
    uint32 public constant MAX_TENOR_DAYS = 720; // 24 months
    uint16 public constant CURE_DAYS = 7;
    uint8 public constant HEALTH_WINDOW_DAYS = 14;
    uint16 public constant MAX_EXCUSED_DAYS = 30;

    // ========================================
    // Waterfall & Distribution (basis points)
    // ========================================
    uint16 public constant LANDLORD_TAKE_BPS = 500; // 5%
    uint16 public constant INVESTOR_TAKE_BPS = 1500; // 15%
    uint16 public constant LANDLORD_TAKE_BPS_B = 500; // 5% Phase B
    uint16 public constant ROYALTY_BPS = 200; // 2%

    // ========================================
    // Floor & Covenant
    // ========================================
    uint16 public constant FLOOR_RATIO_BPS = 6000; // 60%
    uint16 public constant TOLERANCE_BPS = 100; // 1%
    uint16 public constant ASSUMED_COST_RATIO_BPS = 6000; // 60%

    // ========================================
    // Token Decimals
    // ========================================
    uint8 public constant DECIMALS = 6;

    // ========================================
    // Test Constants
    // ========================================
    uint256 public constant INITIAL_MINT = 1_000_000_000e6; // 1B tokens for testing
    uint256 public constant TEST_GROSS_AMOUNT = 10_000_000e6; // 10M daily settlement

    // ========================================
    // Basis Point Denominator
    // ========================================
    uint256 public constant BPS_DENOMINATOR = 10000;
}
