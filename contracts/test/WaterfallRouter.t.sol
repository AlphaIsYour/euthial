// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WaterfallRouterTest is Test {
    MockIDR public token;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    WaterfallRouter public router;

    address public admin = address(this);
    address public agreement = makeAddr("agreement");
    address public landlord = makeAddr("landlord");
    address public attestor = makeAddr("attestor");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint256 constant SENIOR_MULTIPLE_BPS = 12500;
    uint256 constant JUNIOR_MULTIPLE_BPS = 14000;
    
    uint256 public immutable SENIOR_CLAIM = (SENIOR_PRINCIPAL * SENIOR_MULTIPLE_BPS) / 10000;
    uint256 public immutable JUNIOR_CLAIM = (JUNIOR_PRINCIPAL * JUNIOR_MULTIPLE_BPS) / 10000;
    
    uint256 constant INITIAL_MINT = 1_000_000_000e6;
    uint256 attestorPrivateKey = 0xA11CE;

    function setUp() public {
        token = new MockIDR();
        seniorVault = new TrancheVault(IERC20(address(token)), "Senior Tranche Vault", "sTRV", admin);
        juniorVault = new TrancheVault(IERC20(address(token)), "Junior Tranche Vault", "jTRV", admin);
        
        seniorVault.setAgreement(agreement);
        juniorVault.setAgreement(agreement);
        
        attestor = vm.addr(attestorPrivateKey);
        
        router = new WaterfallRouter(
            agreement, address(seniorVault), address(juniorVault),
            landlord, attestor, address(token),
            SENIOR_CLAIM, JUNIOR_CLAIM
        );
        
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));
        
        token.mint(alice, INITIAL_MINT);
        token.mint(bob, INITIAL_MINT);
        token.mint(attestor, INITIAL_MINT);
        token.mint(landlord, INITIAL_MINT);
        
        seniorVault.setAllowlist(alice, true);
        juniorVault.setAllowlist(bob, true);
        juniorVault.setAllowlist(landlord, true);
        
        vm.startPrank(alice);
        token.approve(address(seniorVault), SENIOR_PRINCIPAL);
        seniorVault.deposit(SENIOR_PRINCIPAL, alice);
        vm.stopPrank();
        
        vm.startPrank(bob);
        token.approve(address(juniorVault), JUNIOR_PRINCIPAL);
        juniorVault.deposit(JUNIOR_PRINCIPAL, bob);
        vm.stopPrank();
        
        vm.startPrank(agreement);
        seniorVault.deploy(SENIOR_PRINCIPAL, address(0xdead));
        juniorVault.deploy(JUNIOR_PRINCIPAL, address(0xdead));
        vm.stopPrank();
        
        vm.prank(attestor);
        token.approve(address(router), type(uint256).max);
    }

    function signSettlement(WaterfallRouter.Settlement memory s) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        return abi.encodePacked(r, s_, v);
    }

    function createSettlement(uint32 dayId, uint8 periodDays, uint256 grossRecorded) internal pure returns (WaterfallRouter.Settlement memory) {
        return WaterfallRouter.Settlement({dayId: dayId, periodDays: periodDays, grossRecorded: grossRecorded, txCount: 100, evidenceHash: keccak256(abi.encodePacked(dayId))});
    }

    function test_T06_PhaseA_NormalSettlement() public {
        uint256 G = 10_000_000e6;
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, G);
        bytes memory sig = signSettlement(s);
        uint256 landlordBalBefore = token.balanceOf(landlord);
        router.settle(s, sig);
        uint256 expectedLandlord = (G * 500) / 10000;
        assertEq(token.balanceOf(landlord) - landlordBalBefore, expectedLandlord, "Landlord amount");
    }

    function test_T07_SequentialDistribution() public {
        for (uint32 day = 1; day <= 100; day++) {
            WaterfallRouter.Settlement memory s = createSettlement(day, 1, 10_000_000e6);
            router.settle(s, signSettlement(s));
        }
        assertEq(router.seniorPaid(), SENIOR_CLAIM, "Senior fully paid");
    }

    function test_T08_PhaseTransition() public {
        for (uint32 day = 1; day <= 128; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
        }
        assertTrue(router.currentPhase() == WaterfallRouter.Phase.PhaseB, "Transitioned to Phase B");
    }

    function test_T09_InvalidSignature() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        uint256 wrongKey = 0xBAD;
        bytes32 structHash = keccak256(abi.encode(router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(wrongKey, digest);
        bytes memory badSig = abi.encodePacked(r, s_, v);
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, badSig);
    }

    function test_T09_ReplayAttack() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        router.settle(s, sig);
        vm.expectRevert(WaterfallRouter.SettlementAlreadyRecorded.selector);
        router.settle(s, sig);
    }

    function test_INV01_PhaseA() public {
        uint256 G = 10_000_000e6;
        WaterfallRouter.SplitResult memory split = router.previewSplit(G);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        assertLe(totalPull, G, "INV-01: pull <= G in Phase A");
    }

    function test_INV02_RouterBalanceUnchanged() public {
        uint256 routerBalBefore = token.balanceOf(address(router));
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        router.settle(s, signSettlement(s));
        assertEq(token.balanceOf(address(router)), routerBalBefore, "INV-02: Router balance unchanged");
    }

    function test_INV03_JuniorImpliesSeniorFull() public {
        for (uint32 day = 1; day <= 150; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
            if (router.juniorPaid() > 0) {
                assertEq(router.seniorPaid(), SENIOR_CLAIM, "INV-03: Junior payment requires senior fully paid");
            }
        }
    }

    // ========================================
    // Edge Case Tests - Period Validation
    // ========================================

    function test_EdgeCase_PeriodDaysZero() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 0, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        vm.expectRevert(WaterfallRouter.InvalidPeriodDays.selector);
        router.settle(s, sig);
    }

    function test_EdgeCase_PeriodDays32() public {
        WaterfallRouter.Settlement memory s = createSettlement(32, 32, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        vm.expectRevert(WaterfallRouter.InvalidPeriodDays.selector);
        router.settle(s, sig);
    }

    function test_EdgeCase_PeriodDays31_Valid() public {
        WaterfallRouter.Settlement memory s = createSettlement(31, 31, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        router.settle(s, sig);
        assertEq(router.lastDayId(), 31, "Settlement with periodDays=31 should succeed");
    }

    function test_EdgeCase_MaxGap60_Valid() public {
        WaterfallRouter.Settlement memory s1 = createSettlement(1, 1, 10_000_000e6);
        router.settle(s1, signSettlement(s1));
        
        WaterfallRouter.Settlement memory s2 = createSettlement(61, 1, 10_000_000e6);
        router.settle(s2, signSettlement(s2));
        assertEq(router.lastDayId(), 61, "Gap of 60 should be valid");
    }

    function test_EdgeCase_MaxGap61_Invalid() public {
        WaterfallRouter.Settlement memory s1 = createSettlement(1, 1, 10_000_000e6);
        router.settle(s1, signSettlement(s1));
        
        WaterfallRouter.Settlement memory s2 = createSettlement(62, 1, 10_000_000e6);
        vm.expectRevert(WaterfallRouter.GapTooLarge.selector);
        router.settle(s2, signSettlement(s2));
    }

    function test_EdgeCase_GrossRecordedZero() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 0);
        bytes memory sig = signSettlement(s);
        
        uint256 landlordBalBefore = token.balanceOf(landlord);
        uint256 seniorPaidBefore = router.seniorPaid();
        uint256 juniorPaidBefore = router.juniorPaid();
        
        router.settle(s, sig);
        
        assertEq(token.balanceOf(landlord), landlordBalBefore, "No landlord payment when G=0");
        assertEq(router.seniorPaid(), seniorPaidBefore, "No senior payment when G=0");
        assertEq(router.juniorPaid(), juniorPaidBefore, "No junior payment when G=0");
        assertEq(router.lastDayId(), 1, "dayId should still update when G=0");
        assertTrue(router.settlementOf(1), "Settlement should be recorded even when G=0");
    }

    function test_EdgeCase_MultiDayPeriod7() public {
        WaterfallRouter.Settlement memory s = createSettlement(7, 7, 70_000_000e6);
        bytes memory sig = signSettlement(s);
        router.settle(s, sig);
        assertEq(router.lastDayId(), 7, "Multi-day period settlement");
        assertEq(router.startDay(), 1, "startDay should be day 1 (7 - 7 + 1)");
    }

    function test_EdgeCase_MultiDayPeriod30() public {
        WaterfallRouter.Settlement memory s = createSettlement(30, 30, 300_000_000e6);
        bytes memory sig = signSettlement(s);
        router.settle(s, sig);
        assertEq(router.lastDayId(), 30, "30-day period settlement");
        assertEq(router.startDay(), 1, "startDay should be day 1");
    }

    function test_EdgeCase_OverlappingPeriod() public {
        WaterfallRouter.Settlement memory s1 = createSettlement(5, 5, 10_000_000e6);
        router.settle(s1, signSettlement(s1));
        
        WaterfallRouter.Settlement memory s2 = createSettlement(10, 5, 10_000_000e6);
        vm.expectRevert(WaterfallRouter.DayIdNotMonotonic.selector);
        router.settle(s2, signSettlement(s2));
    }

    function test_EdgeCase_StartDayFirstSettlement() public {
        assertEq(router.startDay(), 0, "startDay should be 0 before first settlement");
        
        WaterfallRouter.Settlement memory s = createSettlement(10, 5, 10_000_000e6);
        router.settle(s, signSettlement(s));
        
        assertEq(router.startDay(), 6, "startDay should be set to period start (10 - 5 + 1)");
    }

    // ========================================
    // Phase Transition Boundary Tests
    // ========================================

    function test_PhaseTransition_SeniorIncomplete() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 1_000_000e6);
        router.settle(s, signSettlement(s));
        
        assertTrue(router.currentPhase() == WaterfallRouter.Phase.PhaseA, "Should be Phase A");
        assertLt(router.seniorPaid(), SENIOR_CLAIM, "Senior not complete");
    }

    function test_PhaseTransition_SeniorComplete_JuniorIncomplete() public {
        uint256 dailyGross = 10_000_000e6;
        uint256 investorDaily = (dailyGross * 1500) / 10000;
        uint256 daysToPaySenior = (SENIOR_CLAIM + investorDaily - 1) / investorDaily;
        
        for (uint32 day = 1; day <= uint32(daysToPaySenior); day++) {
            router.settle(createSettlement(day, 1, dailyGross), signSettlement(createSettlement(day, 1, dailyGross)));
        }
        
        assertTrue(router.currentPhase() == WaterfallRouter.Phase.PhaseA, "Should still be Phase A");
        assertEq(router.seniorPaid(), SENIOR_CLAIM, "Senior should be complete");
        assertLt(router.juniorPaid(), JUNIOR_CLAIM, "Junior should be incomplete");
    }

    function test_PhaseTransition_BothComplete() public {
        for (uint32 day = 1; day <= 128; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
        }
        
        assertTrue(router.currentPhase() == WaterfallRouter.Phase.PhaseB, "Should be Phase B");
        assertEq(router.seniorPaid(), SENIOR_CLAIM, "Senior should be complete");
        assertEq(router.juniorPaid(), JUNIOR_CLAIM, "Junior should be complete");
    }

    function test_PhaseB_FirstSettlement() public {
        for (uint32 day = 1; day <= 128; day++) {
            router.settle(createSettlement(day, 1, 10_000_000e6), signSettlement(createSettlement(day, 1, 10_000_000e6)));
        }
        
        uint256 seniorPaidBefore = router.seniorPaid();
        uint256 juniorPaidBefore = router.juniorPaid();
        uint256 juniorBalBefore = token.balanceOf(address(juniorVault));
        uint256 G = 10_000_000e6;
        
        WaterfallRouter.Settlement memory s = createSettlement(129, 1, G);
        router.settle(s, signSettlement(s));
        
        uint256 expectedRoyalty = (G * 200) / 10000;
        
        assertEq(router.seniorPaid(), seniorPaidBefore, "Senior should not receive more in Phase B");
        assertGt(router.juniorPaid(), juniorPaidBefore, "Junior should receive royalty in Phase B");
        assertEq(token.balanceOf(address(juniorVault)) - juniorBalBefore, expectedRoyalty, "Junior should receive 2% royalty");
    }

    // ========================================
    // Signature Tampering Tests
    // ========================================

    function test_Signature_ModifiedGross() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        
        s.grossRecorded = 20_000_000e6;
        
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, sig);
    }

    function test_Signature_ModifiedDayId() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        
        s.dayId = 2;
        
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, sig);
    }

    function test_Signature_ModifiedEvidenceHash() public {
        WaterfallRouter.Settlement memory s = createSettlement(1, 1, 10_000_000e6);
        bytes memory sig = signSettlement(s);
        
        s.evidenceHash = keccak256(abi.encodePacked("tampered"));
        
        vm.expectRevert(WaterfallRouter.InvalidSignature.selector);
        router.settle(s, sig);
    }

    // ========================================
    // Fuzz Tests
    // ========================================

    function testFuzz_INV01_AlwaysHolds(uint256 G) public view {
        vm.assume(G <= 1_000_000_000e6);
        
        WaterfallRouter.SplitResult memory split = router.previewSplit(G);
        uint256 totalPull = split.landlordAmt + split.toSenior + split.toJunior;
        
        assertLe(totalPull, G, "INV-01 must always hold");
    }

    function testFuzz_SequentialDistribution(uint32 numDays, uint256 G) public {
        vm.assume(G > 1_000_000e6 && G <= 50_000_000e6);
        vm.assume(numDays > 0 && numDays < 30);
        
        for (uint32 i = 0; i < numDays; i++) {
            uint32 dayId = uint32(router.lastDayId() + 1);
            WaterfallRouter.Settlement memory s = createSettlement(dayId, 1, G);
            router.settle(s, signSettlement(s));
            
            if (router.juniorPaid() > 0) {
                assertEq(router.seniorPaid(), SENIOR_CLAIM, "INV-03: Senior complete if junior paid");
            }
        }
    }
}
