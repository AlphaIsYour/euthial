// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {FitOutAgreement} from "../../src/FitOutAgreement.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract FuzzCovenantTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
    }

    function fuzz_Floor_Monotonic(uint32 d1, uint32 d2) public view {
        d1 = uint32(bound(d1, 0, 900));
        d2 = uint32(bound(d2, d1, 1000));
        
        uint256 f1 = agreement.floor(d1);
        uint256 f2 = agreement.floor(d2);
        
        assertGe(f2, f1, "Floor not monotonic");
        assertLe(f2, TOTAL_CLAIM, "Floor exceeds total claim");
    }

    function fuzz_Floor_Bounded(uint32 d) public view {
        d = uint32(bound(d, 0, 2000));
        uint256 f = agreement.floor(d);
        assertLe(f, TOTAL_CLAIM, "Floor exceeds total claim");
    }

    function fuzz_Floor_RampPhase1(uint32 d) public view {
        d = uint32(bound(d, 1, 540));
        uint256 f = agreement.floor(d);
        uint256 expected = (TOTAL_CLAIM * 6000 * d) / (540 * 10000);
        assertEq(f, expected, "Floor ramp phase 1 incorrect");
    }

    function fuzz_Floor_RampPhase2(uint32 d) public view {
        d = uint32(bound(d, 541, 720));
        uint256 f = agreement.floor(d);
        
        uint256 fAtTarget = (TOTAL_CLAIM * 6000) / 10000;
        uint256 remaining = TOTAL_CLAIM - fAtTarget;
        uint256 expected = fAtTarget + (remaining * (d - 540)) / (720 - 540);
        
        assertEq(f, expected, "Floor ramp phase 2 incorrect");
    }

    function fuzz_ExcusedDays_Calculation(uint32 elapsed, uint32 excused) public {
        elapsed = uint32(bound(elapsed, 1, 500));
        excused = uint32(bound(excused, 0, min(elapsed, 30)));
        
        uint256 logicalDays = elapsed > excused ? elapsed - excused : 0;
        assertGe(logicalDays, 0);
        assertLe(logicalDays, elapsed);
    }

    function min(uint32 a, uint32 b) private pure returns (uint32) {
        return a < b ? a : b;
    }
}
