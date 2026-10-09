// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract StepInTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
    }

    function test_StepIn_EarlyDefault_LowSettlement() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 lowSettlement = 1_000_000e6;
        for (uint32 day = 1; day <= 100; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, lowSettlement);
            router.settle(s, sig);
        }
        
        uint256 claimPaid = router.claimPaidTotal();
        assertLt(claimPaid, TOTAL_CLAIM, "Should not reach full payment");
    }

    function test_StepIn_HighSettlement_RapidRecovery() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 highSettlement = 30_000_000e6;
        for (uint32 day = 1; day <= 10; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, highSettlement);
            router.settle(s, sig);
        }
        
        assertEq(router.seniorPaid(), SENIOR_CLAIM);
        assertEq(router.juniorPaid(), JUNIOR_CLAIM);
    }

    function test_StepIn_VariableSettlement() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256[] memory settlements = new uint256[](5);
        settlements[0] = 10_000_000e6;
        settlements[1] = 5_000_000e6;
        settlements[2] = 15_000_000e6;
        settlements[3] = 8_000_000e6;
        settlements[4] = 12_000_000e6;
        
        for (uint32 day = 1; day <= 5; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, settlements[day - 1]);
            router.settle(s, sig);
        }
        
        uint256 totalPaid = router.seniorPaid() + router.juniorPaid();
        assertGt(totalPaid, 0);
    }

    function test_StepIn_BondConservation() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 initialBond = agreement.bondDeposited();
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        assertTrue(agreement.bondConservation());
        assertEq(agreement.bondDeposited(), initialBond);
    }

    function test_StepIn_MultipleSettlements_Accounting() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 settlement1 = 10_000_000e6;
        uint256 settlement2 = 15_000_000e6;
        uint256 settlement3 = 8_000_000e6;
        
        (WaterfallRouter.Settlement memory s1, bytes memory sig1) = 
            createSignedSettlement(1, 1, settlement1);
        router.settle(s1, sig1);
        
        uint256 paidAfter1 = router.claimPaidTotal();
        
        (WaterfallRouter.Settlement memory s2, bytes memory sig2) = 
            createSignedSettlement(2, 1, settlement2);
        router.settle(s2, sig2);
        
        uint256 paidAfter2 = router.claimPaidTotal();
        assertGt(paidAfter2, paidAfter1);
        
        (WaterfallRouter.Settlement memory s3, bytes memory sig3) = 
            createSignedSettlement(3, 1, settlement3);
        router.settle(s3, sig3);
        
        uint256 paidAfter3 = router.claimPaidTotal();
        assertGt(paidAfter3, paidAfter2);
    }

    function test_StepIn_PhaseADistribution() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        
        WaterfallRouter.SplitResult memory split = router.previewSplit(10_000_000e6);
        
        uint256 landlordTake = (10_000_000e6 * 500) / 10000;
        assertEq(split.landlordAmt, landlordTake);
        
        router.settle(s, sig);
        assertGt(router.seniorPaid(), 0);
    }
}
