// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {Fixtures} from "../utils/Fixtures.sol";

contract WaterfallRouterTest is Fixtures {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
    }

    function test_Settlement_ValidSignature() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s, sig);
        assertEq(router.lastDayId(), 1);
    }

    function test_Settlement_InvalidSignature_Reverts() public {
        (WaterfallRouter.Settlement memory s,) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        bytes memory badSig = abi.encodePacked(bytes32(0), bytes32(0), uint8(27));
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, badSig);
    }

    function test_Settlement_ReplayAttack_Reverts() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s, sig);
        vm.expectRevert(WaterfallRouter.SettlementAlreadyRecorded.selector);
        router.settle(s, sig);
    }

    function test_Settlement_BackwardDayId_Reverts() public {
        (WaterfallRouter.Settlement memory s1, bytes memory sig1) = 
            createSignedSettlement(10, 1, 10_000_000e6);
        router.settle(s1, sig1);
        (WaterfallRouter.Settlement memory s2, bytes memory sig2) = 
            createSignedSettlement(5, 1, 10_000_000e6);
        vm.expectRevert(WaterfallRouter.DayIdNotMonotonic.selector);
        router.settle(s2, sig2);
    }

    function test_Settlement_GapTooLarge_Reverts() public {
        (WaterfallRouter.Settlement memory s1, bytes memory sig1) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s1, sig1);
        (WaterfallRouter.Settlement memory s2, bytes memory sig2) = 
            createSignedSettlement(62, 1, 10_000_000e6);
        vm.expectRevert(WaterfallRouter.GapTooLarge.selector);
        router.settle(s2, sig2);
    }

    function test_Settlement_MaxGap60_Valid() public {
        (WaterfallRouter.Settlement memory s1, bytes memory sig1) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s1, sig1);
        (WaterfallRouter.Settlement memory s2, bytes memory sig2) = 
            createSignedSettlement(61, 1, 10_000_000e6);
        router.settle(s2, sig2);
        assertEq(router.lastDayId(), 61);
    }

    function test_Settlement_PeriodDaysInvalid_Reverts() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 0, 10_000_000e6);
        vm.expectRevert(WaterfallRouter.InvalidPeriodDays.selector);
        router.settle(s, sig);
    }

    function test_PhaseA_SeniorPriority() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s, sig);
        assertLe(router.seniorPaid(), SENIOR_CLAIM);
        assertEq(router.juniorPaid(), 0);
    }

    function test_INV01_PullLessThanG() public view {
        WaterfallRouter.SplitResult memory split = router.previewSplit(10_000_000e6);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        assertLe(totalPull, 10_000_000e6);
    }

    function test_INV02_RouterBalanceZero() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s, sig);
        assertEq(token.balanceOf(address(router)), 0);
    }

    function test_INV03_JuniorAfterSenior() public {
        for (uint32 day = 1; day <= 20; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, 10_000_000e6);
            router.settle(s, sig);
            if (router.juniorPaid() > 0) {
                assertEq(router.seniorPaid(), SENIOR_CLAIM);
            }
        }
    }

    function test_CurrentPhase() public view {
        assertEq(uint256(router.currentPhase()), uint256(WaterfallRouter.Phase.PhaseA));
    }

    function test_ClaimPaidTotal() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 10_000_000e6);
        router.settle(s, sig);
        assertEq(router.claimPaidTotal(), 
            router.seniorPaid() + router.juniorPaid());
    }
}
