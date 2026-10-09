// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {Constants} from "./Constants.sol";

contract TestHelpers is Test, Constants {
    /**
     * @notice Assert that a split respects INV-01: pull <= G
     */
    function assertINV01(WaterfallRouter.SplitResult memory split, uint256 G) public pure {
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        require(totalPull <= G, "INV-01 violated: pull > G");
    }

    /**
     * @notice Assert senior is fully paid before junior receives anything
     */
    function assertINV03(uint256 seniorPaid, uint256 seniorClaim, uint256 juniorPaid) public pure {
        if (juniorPaid > 0) {
            require(seniorPaid == seniorClaim, "INV-03 violated: junior paid but senior not full");
        }
    }

    /**
     * @notice Assert floor is non-decreasing (monotonic)
     */
    function assertFloorMonotonic(uint256 d1, uint256 d2, uint256 floor1, uint256 floor2) public pure {
        if (d2 > d1) {
            require(floor2 >= floor1, "Floor not monotonic");
        }
    }

    /**
     * @notice Assert floor never exceeds total claim
     */
    function assertFloorBounded(uint256 floor) public pure {
        require(floor <= TOTAL_CLAIM, "Floor exceeds total claim");
    }

    /**
     * @notice Verify waterfall split computation for Phase A
     * @dev Given G, verify split = (landlord, senior, junior, excess)
     */
    function verifyPhaseASplit(
        uint256 G,
        uint256 seniorRemaining,
        uint256 juniorRemaining
    ) public pure returns (uint256 landlord, uint256 senior, uint256 junior) {
        landlord = (G * LANDLORD_TAKE_BPS) / BPS_DENOMINATOR;
        uint256 investorPool = (G * INVESTOR_TAKE_BPS) / BPS_DENOMINATOR;
        
        senior = seniorRemaining < investorPool ? seniorRemaining : investorPool;
        uint256 afterSenior = investorPool - senior;
        junior = juniorRemaining < afterSenior ? juniorRemaining : afterSenior;
        
        return (landlord, senior, junior);
    }

    /**
     * @notice Verify waterfall split computation for Phase B
     */
    function verifyPhaseBSplit(uint256 G)
        public pure returns (uint256 landlord, uint256 royalty)
    {
        landlord = (G * LANDLORD_TAKE_BPS_B) / BPS_DENOMINATOR;
        royalty = (G * ROYALTY_BPS) / BPS_DENOMINATOR;
        return (landlord, royalty);
    }

    /**
     * @notice Check if a value is within tolerance basis points of expected
     */
    function isWithinTolerance(
        uint256 actual,
        uint256 expected,
        uint256 toleranceBps
    ) public pure returns (bool) {
        if (expected == 0) return actual == 0;
        uint256 maxDeviation = (expected * toleranceBps) / BPS_DENOMINATOR;
        return actual >= expected - maxDeviation && actual <= expected + maxDeviation;
    }

    /**
     * @notice Calculate expected senior portion of investor take
     */
    function calcSeniorPortion(uint256 seniorRemaining, uint256 investorPool)
        public pure returns (uint256)
    {
        return seniorRemaining < investorPool ? seniorRemaining : investorPool;
    }

    /**
     * @notice Calculate expected junior portion of investor take
     */
    function calcJuniorPortion(uint256 juniorRemaining, uint256 investorPool, uint256 seniorPortion)
        public pure returns (uint256)
    {
        uint256 availableForJunior = investorPool - seniorPortion;
        return juniorRemaining < availableForJunior ? juniorRemaining : availableForJunior;
    }
}
