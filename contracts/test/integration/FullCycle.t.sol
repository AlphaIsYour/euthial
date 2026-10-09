// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract FullCycleTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
    }

    function test_FullCycle_FundraisingPhase() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        assertEq(seniorVault.totalAssets(), SENIOR_PRINCIPAL);
        assertEq(juniorVault.totalAssets(), JUNIOR_PRINCIPAL);
        assertEq(agreement.bondBalance(), BOND_AMOUNT);
    }

    function test_FullCycle_BuildingPhase() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        assertEq(seniorVault.principalOutstanding(), SENIOR_PRINCIPAL);
        assertEq(juniorVault.principalOutstanding(), JUNIOR_PRINCIPAL);
        assertEq(token.balanceOf(contractor), SENIOR_PRINCIPAL + JUNIOR_PRINCIPAL);
    }

    function test_FullCycle_SettlementPhase() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 dailySettlement = 10_000_000e6;
        for (uint32 day = 1; day <= 20; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, dailySettlement);
            router.settle(s, sig);
        }
        
        assertGt(router.seniorPaid(), 0);
        assertEq(router.lastDayId(), 20);
    }

    function test_FullCycle_SeniorExhausted() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 dailySettlement = 10_000_000e6;
        uint256 numDays = (SENIOR_CLAIM / dailySettlement) + 5;
        
        for (uint32 day = 1; day <= numDays; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, dailySettlement);
            router.settle(s, sig);
        }
        
        assertEq(router.seniorPaid(), SENIOR_CLAIM);
        assertGt(router.juniorPaid(), 0);
    }

    function test_FullCycle_BothExhausted() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 dailySettlement = 15_000_000e6;
        uint256 numDays = (TOTAL_CLAIM / dailySettlement) + 5;
        
        for (uint32 day = 1; day <= numDays; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, dailySettlement);
            router.settle(s, sig);
        }
        
        assertEq(router.seniorPaid(), SENIOR_CLAIM);
        assertEq(router.juniorPaid(), JUNIOR_CLAIM);
    }

    function test_FullCycle_PhaseTransition() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        assertEq(uint256(router.currentPhase()), uint256(WaterfallRouter.Phase.PhaseA));
        
        uint256 dailySettlement = 20_000_000e6;
        uint256 numDays = (TOTAL_CLAIM / dailySettlement) + 5;
        
        for (uint32 day = 1; day <= numDays; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, dailySettlement);
            router.settle(s, sig);
        }
        
        assertEq(uint256(router.currentPhase()), uint256(WaterfallRouter.Phase.PhaseB));
    }

    function test_FullCycle_BondRefund() public {
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        
        uint256 dailySettlement = 20_000_000e6;
        uint256 numDays = (TOTAL_CLAIM / dailySettlement) + 5;
        
        for (uint32 day = 1; day <= numDays; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, dailySettlement);
            router.settle(s, sig);
        }
        
        uint256 tenantBalBefore = token.balanceOf(tenant);
        vm.prank(tenant);
        agreement.refundBond();
        uint256 tenantBalAfter = token.balanceOf(tenant);
        
        assertEq(tenantBalAfter - tenantBalBefore, BOND_AMOUNT);
    }
}
