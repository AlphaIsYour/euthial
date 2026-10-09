// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {WaterfallRouter} from "../../src/WaterfallRouter.sol";
import {Fixtures} from "../utils/Fixtures.sol";
import {TestHelpers} from "../utils/TestHelpers.sol";

contract FuzzSettlementTest is Fixtures, TestHelpers {
    function setUp() public {
        deployContracts();
        mintTokens();
        setupAllowlists();
        approveRouter();
        completeFundraising(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
        deployCapital(SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL);
    }

    function fuzz_Settlement_INV01_Preserved(uint256 G) public {
        G = bound(G, 0, 1_000_000_000e6);
        WaterfallRouter.SplitResult memory split = router.previewSplit(G);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        assertLe(totalPull, G, "INV-01 violated");
    }

    function fuzz_Settlement_INV02_RouterBalance(uint256 G) public {
        G = bound(G, 1, 100_000_000e6);
        uint256 balBefore = token.balanceOf(address(router));
        
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, G);
        router.settle(s, sig);
        
        uint256 balAfter = token.balanceOf(address(router));
        assertEq(balAfter, balBefore, "INV-02 violated");
    }

    function fuzz_Settlement_INV03_SeniorFirst(uint32 numSettlements) public {
        numSettlements = uint32(bound(numSettlements, 1, 30));
        
        for (uint32 day = 1; day <= numSettlements; day++) {
            (WaterfallRouter.Settlement memory s, bytes memory sig) = 
                createSignedSettlement(day, 1, 10_000_000e6);
            router.settle(s, sig);
            
            if (router.juniorPaid() > 0) {
                assertEq(router.seniorPaid(), SENIOR_CLAIM, "INV-03: junior before senior full");
            }
        }
    }

    function fuzz_Settlement_ZeroAmount() public {
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, 0);
        router.settle(s, sig);
        assertEq(router.seniorPaid(), 0);
        assertEq(router.juniorPaid(), 0);
    }

    function fuzz_Settlement_Boundaries(uint256 G) public {
        G = bound(G, 1, 300_000_000e6);
        
        (WaterfallRouter.Settlement memory s, bytes memory sig) = 
            createSignedSettlement(1, 1, G);
        
        WaterfallRouter.SplitResult memory split = router.previewSplit(G);
        
        uint256 landlord = (G * 500) / 10000;
        uint256 investorPool = (G * 1500) / 10000;
        
        assertEq(split.landlordAmt, landlord);
        uint256 seniorRemaining = SENIOR_CLAIM;
        uint256 expectedSenior = seniorRemaining < investorPool ? seniorRemaining : investorPool;
        assertEq(split.toSenior, expectedSenior);
    }
}
