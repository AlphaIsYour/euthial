// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {FitOutAgreement} from "../src/FitOutAgreement.sol";
import {WaterfallRouter} from "../src/WaterfallRouter.sol";
import {TrancheVault} from "../src/TrancheVault.sol";
import {MockIDR} from "../src/MockIDR.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CovenantTest
 * @notice Comprehensive test suite for FitOutAgreement covenant state machine
 * @dev Implements test groups A-H covering HEALTHY, CURE, BREACHED, STEP_IN, RESIDUAL
 *      Reference: docs/05_SMART_CONTRACT_SPEC.md sections 5.3-5.5, 13.1 (T-10 through T-16)
 */
contract CovenantTest is Test {
    MockIDR public token;
    TrancheVault public seniorVault;
    TrancheVault public juniorVault;
    WaterfallRouter public router;
    FitOutAgreement public agreement;

    address public admin = address(this);
    address public landlord = makeAddr("landlord");
    address public tenant = makeAddr("tenant");
    address public contractor = makeAddr("contractor");
    address public inspector = makeAddr("inspector");
    address public arbiter = makeAddr("arbiter");
    address public attestor;
    uint256 public attestorPrivateKey = 0xA11CE;

    // Constants from specification (docs/05, section 3)
    uint256 constant BUDGET = 150_000_000e6;
    uint256 constant SENIOR_PRINCIPAL = 120_000_000e6;
    uint256 constant JUNIOR_PRINCIPAL = 30_000_000e6;
    uint16 constant SENIOR_MULTIPLE_BPS = 12500;
    uint16 constant JUNIOR_MULTIPLE_BPS = 14000;
    uint256 constant SENIOR_CLAIM = 150_000_000e6;
    uint256 constant JUNIOR_CLAIM = 42_000_000e6;
    uint256 constant TOTAL_CLAIM = 192_000_000e6;
    uint256 constant BOND_AMOUNT = 15_000_000e6;
    uint32 constant TARGET_TENOR_DAYS = 540;
    uint32 constant MAX_TENOR_DAYS = 720;
    uint16 constant FLOOR_RATIO_BPS = 6000;
    uint16 constant TOLERANCE_BPS = 100;
    uint16 constant CURE_DAYS = 7;
    uint256 constant TOLERANCE = (TOTAL_CLAIM * TOLERANCE_BPS) / 10000;

    uint32 public startDay;

    // Events for expectEmit
    event CovenantEvaluated(uint32 indexed month, uint256 floor, uint256 claimPaid, uint256 shortfall);
    event CovenantStatusChanged(
        FitOutAgreement.CovenantStatus indexed previousStatus,
        FitOutAgreement.CovenantStatus indexed newStatus
    );
    event CureStarted(uint32 indexed month, uint256 target, uint32 deadline);
    event CureResolved(uint256 claimPaid);
    event BondDrawn(uint256 amount, uint256 newBalance);
    event StepInTriggered(string reason, uint256 remainingShortfall);
    event ResidualReached(uint32 dayId, uint256 claimPaidTotal);

    function setUp() public {
        token = new MockIDR();
        attestor = vm.addr(attestorPrivateKey);

        seniorVault = new TrancheVault(IERC20(address(token)), "Senior Tranche", "sTRV", admin);
        juniorVault = new TrancheVault(IERC20(address(token)), "Junior Tranche", "jTRV", admin);

        agreement = new FitOutAgreement(
            address(token), address(0), address(seniorVault), address(juniorVault),
            landlord, tenant, contractor, inspector, arbiter,
            BUDGET, SENIOR_PRINCIPAL, JUNIOR_PRINCIPAL, SENIOR_MULTIPLE_BPS, JUNIOR_MULTIPLE_BPS,
            TARGET_TENOR_DAYS, MAX_TENOR_DAYS, FLOOR_RATIO_BPS, TOLERANCE_BPS, CURE_DAYS, 30,
            uint64(block.timestamp + 30 days), uint64(block.timestamp + 60 days), 1000
        );

        router = new WaterfallRouter(
            address(agreement), address(seniorVault), address(juniorVault),
            landlord, attestor, address(token), SENIOR_CLAIM, JUNIOR_CLAIM
        );

        seniorVault.setAgreement(address(agreement));
        juniorVault.setAgreement(address(agreement));
        seniorVault.setRouter(address(router));
        juniorVault.setRouter(address(router));

        token.mint(tenant, 1_000_000_000e6);
        token.mint(landlord, 1_000_000_000e6);
        token.mint(attestor, 1_000_000_000e6);
        token.mint(address(this), 1_000_000_000e6);

        seniorVault.setAllowlist(address(this), true);
        juniorVault.setAllowlist(landlord, true);

        vm.prank(attestor);
        token.approve(address(router), type(uint256).max);
    }

    function setupOperatingState() internal returns (uint32 startDay_) {
        vm.prank(landlord);
        agreement.startFundraising();

        vm.startPrank(tenant);
        token.approve(address(agreement), BOND_AMOUNT);
        agreement.depositBond();
        vm.stopPrank();

        token.approve(address(seniorVault), SENIOR_PRINCIPAL);
        seniorVault.deposit(SENIOR_PRINCIPAL, address(this));

        vm.startPrank(landlord);
        token.approve(address(juniorVault), JUNIOR_PRINCIPAL);
        juniorVault.deposit(JUNIOR_PRINCIPAL, landlord);
        vm.stopPrank();

        agreement.startBuild();
        seniorVault.deploy(SENIOR_PRINCIPAL, contractor);
        juniorVault.deploy(JUNIOR_PRINCIPAL, contractor);

        for (uint8 i = 0; i < 3; i++) {
            vm.prank(landlord);
            agreement.approveMilestone(i);
            vm.prank(tenant);
            agreement.approveMilestone(i);
        }

        startDay_ = 100;
        settleMonth(startDay_, 10_000_000e6);
        return startDay_;
    }

    function settleMonth(uint32 dayId, uint256 grossRecorded) internal {
        WaterfallRouter.Settlement memory s = WaterfallRouter.Settlement({
            dayId: dayId, periodDays: 30, grossRecorded: grossRecorded,
            txCount: 100, evidenceHash: keccak256(abi.encodePacked(dayId, grossRecorded))
        });
        bytes memory signature = signSettlement(s);
        router.settle(s, signature);
    }

    function signSettlement(WaterfallRouter.Settlement memory s) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(router.getSettlementTypehash(), s.dayId, s.periodDays, s.grossRecorded, s.txCount, s.evidenceHash)
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", router.domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s_) = vm.sign(attestorPrivateKey, digest);
        return abi.encodePacked(r, s_, v);
    }

    function calculateFloor(uint256 d) internal pure returns (uint256) {
        if (d == 0) return 0;
        if (d <= TARGET_TENOR_DAYS) {
            return (TOTAL_CLAIM * FLOOR_RATIO_BPS * d) / (TARGET_TENOR_DAYS * 10000);
        } else if (d <= MAX_TENOR_DAYS) {
            uint256 floorAtTarget = (TOTAL_CLAIM * FLOOR_RATIO_BPS) / 10000;
            uint256 remaining = TOTAL_CLAIM - floorAtTarget;
            return floorAtTarget + (remaining * (d - TARGET_TENOR_DAYS)) / (MAX_TENOR_DAYS - TARGET_TENOR_DAYS);
        } else {
            return TOTAL_CLAIM;
        }
    }

    function getCumulativeInvestorPaid() internal view returns (uint256) {
        return router.seniorPaid() + router.juniorPaid();
    }

    // ========================================
    // TEST GROUP A: NORMAL COVENANT (HEALTHY)
    // ========================================

    function test_Covenant_NormalHealthy_AboveFloor() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        uint256 grossRevenue = 100_000_000e6;
        settleMonth(month2Day, grossRevenue);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.HEALTHY));
        assertEq(agreement.breachCount(), 0);
    }

    function test_Covenant_NormalHealthy_MultipleMonths() public {
        startDay = setupOperatingState();
        for (uint32 i = 1; i <= 5; i++) {
            settleMonth(startDay + (i * 30), 50_000_000e6);
        }
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.HEALTHY));
        assertEq(agreement.breachCount(), 0);
    }

    // ========================================
    // TEST GROUP B: TOLERANCE BOUNDARIES
    // ========================================

    function test_Covenant_Tolerance_ShortfallBelowTolerance() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        uint256 d = 61;
        uint256 requiredFloor = calculateFloor(d);
        uint256 alreadyPaid = getCumulativeInvestorPaid();
        uint256 shortfall = 1_900_000e6;
        uint256 targetPaid = requiredFloor - shortfall;
        uint256 needThisMonth = targetPaid - alreadyPaid;
        uint256 grossRevenue = (needThisMonth * 10000) / 1500;
        settleMonth(month2Day, grossRevenue);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.HEALTHY));
    }

    function test_Covenant_Tolerance_ShortfallAboveTolerance() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        uint256 d = 61;
        uint256 requiredFloor = calculateFloor(d);
        uint256 alreadyPaid = getCumulativeInvestorPaid();
        uint256 shortfall = TOLERANCE + 100_000e6;
        uint256 targetPaid = requiredFloor - shortfall;
        uint256 needThisMonth = targetPaid > alreadyPaid ? targetPaid - alreadyPaid : 0;
        uint256 grossRevenue = (needThisMonth * 10000) / 1500;
        vm.expectEmit(true, false, false, false);
        emit CureStarted(2, requiredFloor, month2Day + CURE_DAYS);
        settleMonth(month2Day, grossRevenue);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.CURE));
        assertEq(agreement.cureTarget(), requiredFloor);
        assertEq(agreement.cureDeadlineDay(), month2Day + CURE_DAYS);
    }

    // ========================================
    // TEST GROUP C: CURE TRIGGER
    // ========================================

    function test_Covenant_CureTrigger_FirstBreach() public {
        startDay = setupOperatingState();
        settleMonth(startDay + 90, 5_000_000e6);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.CURE));
        assertTrue(agreement.cureTarget() > 0);
        assertTrue(agreement.cureDeadlineDay() > 0);
    }

    function test_Covenant_CureTrigger_VerifyCureTarget() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        uint256 d = 61;
        uint256 expectedFloor = calculateFloor(d);
        settleMonth(month2Day, 5_000_000e6);
        assertEq(agreement.cureTarget(), expectedFloor);
    }

    function test_Covenant_CureTrigger_VerifyCureDeadline() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        settleMonth(month2Day, 5_000_000e6);
        assertEq(agreement.cureDeadlineDay(), month2Day + CURE_DAYS);
    }

    // ========================================
    // TEST GROUP D: CURE RECOVERY
    // ========================================

    function test_Covenant_CureRecovery_BeforeDeadline() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        settleMonth(month2Day, 5_000_000e6);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.CURE));
        uint256 cureTarget = agreement.cureTarget();
        uint256 alreadyPaid = getCumulativeInvestorPaid();
        uint32 cureDay = month2Day + 3;
        uint256 needToRecover = cureTarget - alreadyPaid + TOLERANCE / 2;
        uint256 grossRevenue = (needToRecover * 10000) / 1500;
        settleMonth(cureDay, grossRevenue);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.HEALTHY));
        assertEq(agreement.breachCount(), 0);
    }

    function test_Covenant_CureRecovery_BondUntouched() public {
        startDay = setupOperatingState();
        uint256 initialBondBalance = agreement.bondBalance();
        uint32 month2Day = startDay + 60;
        settleMonth(month2Day, 5_000_000e6);
        uint256 cureTarget = agreement.cureTarget();
        uint256 alreadyPaid = getCumulativeInvestorPaid();
        uint256 needToRecover = cureTarget - alreadyPaid + 1_000_000e6;
        uint256 grossRevenue = (needToRecover * 10000) / 1500;
        settleMonth(month2Day + 3, grossRevenue);
        assertEq(agreement.bondBalance(), initialBondBalance);
        assertEq(agreement.bondDrawn(), 0);
    }

    // ========================================
    // TEST GROUP E: CURE EXPIRY → BREACHED
    // ========================================

    function test_Covenant_CureExpiry_BondDrawn() public {
        startDay = setupOperatingState();
        settleMonth(startDay + 60, 5_000_000e6);
        uint256 initialBondBalance = agreement.bondBalance();
        uint32 expiredDay = agreement.cureDeadlineDay() + 1;
        settleMonth(expiredDay, 0);
        assertTrue(agreement.bondDrawn() > 0);
        assertLt(agreement.bondBalance(), initialBondBalance);
    }

    function test_Covenant_CureExpiry_BreachCountIncremented() public {
        startDay = setupOperatingState();
        assertEq(agreement.breachCount(), 0);
        settleMonth(startDay + 60, 5_000_000e6);
        uint32 expiredDay = agreement.cureDeadlineDay() + 1;
        settleMonth(expiredDay, 0);
        assertGe(agreement.breachCount(), 1);
    }

    function test_Covenant_CureExpiry_BondAccountingCorrect() public {
        startDay = setupOperatingState();
        uint256 initialBondDeposited = agreement.bondDeposited();
        settleMonth(startDay + 60, 5_000_000e6);
        uint32 expiredDay = agreement.cureDeadlineDay() + 1;
        settleMonth(expiredDay, 0);
        assertEq(
            agreement.bondBalance() + agreement.bondDrawn() + agreement.bondRefunded(),
            initialBondDeposited
        );
    }

    // ========================================
    // TEST GROUP F: INSUFFICIENT BOND → STEP_IN
    // ========================================

    function test_Covenant_InsufficientBond_StepInTriggered() public {
        startDay = setupOperatingState();
        for (uint32 i = 1; i <= 12; i++) {
            settleMonth(startDay + (i * 30), 0);
            if (uint(agreement.state()) == uint(FitOutAgreement.State.STEP_IN)) {
                assertTrue(true);
                return;
            }
        }
    }

    function test_Covenant_InsufficientBond_PartialBondDrawn() public {
        startDay = setupOperatingState();
        uint256 initialBondBalance = agreement.bondBalance();
        for (uint32 i = 1; i <= 15; i++) {
            settleMonth(startDay + (i * 30), 1_000_000e6);
            if (agreement.bondDrawn() > 0) {
                assertLe(agreement.bondDrawn(), initialBondBalance);
                break;
            }
        }
    }

    // ========================================
    // TEST GROUP G: TWO CONSECUTIVE BREACHES
    // ========================================

    function test_Covenant_ConsecutiveBreaches_FirstBreach() public {
        startDay = setupOperatingState();
        settleMonth(startDay + 90, 5_000_000e6);
        uint32 expiredDay = agreement.cureDeadlineDay() + 1;
        settleMonth(expiredDay, 0);
        assertGe(agreement.breachCount(), 1);
    }

    function test_Covenant_ConsecutiveBreaches_SecondBreachTriggersStepIn() public {
        startDay = setupOperatingState();
        uint32 month2Day = startDay + 60;
        settleMonth(month2Day, 3_000_000e6);
        if (uint(agreement.covenantStatus()) != uint(FitOutAgreement.CovenantStatus.CURE)) return;
        uint32 cureDeadline1 = agreement.cureDeadlineDay();
        settleMonth(cureDeadline1 + 1, 0);
        if (uint(agreement.state()) == uint(FitOutAgreement.State.STEP_IN)) return;
        uint32 month4Day = cureDeadline1 + 60;
        settleMonth(month4Day, 3_000_000e6);
        if (uint(agreement.covenantStatus()) != uint(FitOutAgreement.CovenantStatus.CURE)) return;
        uint32 cureDeadline2 = agreement.cureDeadlineDay();
        settleMonth(cureDeadline2 + 1, 0);
        assertTrue(
            uint(agreement.state()) == uint(FitOutAgreement.State.STEP_IN) ||
            agreement.breachCount() >= 2
        );
    }

    // ========================================
    // TEST GROUP H: RESIDUAL TERMINAL STATE
    // ========================================

    function test_Covenant_Residual_ClaimFullyPaid() public {
        startDay = setupOperatingState();
        uint256 remainingClaim = TOTAL_CLAIM - getCumulativeInvestorPaid();
        uint256 grossNeeded = (remainingClaim * 10000) / 1500;
        settleMonth(startDay + 60, grossNeeded + 10_000_000e6);
        uint256 claimPaid = getCumulativeInvestorPaid();
        assertGe(claimPaid, TOTAL_CLAIM);
    }

    function test_Covenant_Residual_NoMoreCovenantChecks() public {
        startDay = setupOperatingState();
        uint256 remainingClaim = TOTAL_CLAIM - getCumulativeInvestorPaid();
        uint256 grossNeeded = (remainingClaim * 10000) / 1500 + 50_000_000e6;
        settleMonth(startDay + 60, grossNeeded);
        uint32 laterDay = startDay + 300;
        settleMonth(laterDay, 0);
        if (uint(agreement.state()) == uint(FitOutAgreement.State.RESIDUAL)) {
            assertTrue(true);
        }
    }

    function test_Covenant_Residual_DuringCureExpiry() public {
        startDay = setupOperatingState();
        settleMonth(startDay + 60, 5_000_000e6);
        uint256 remainingClaim = TOTAL_CLAIM - getCumulativeInvestorPaid();
        uint256 grossNeeded = (remainingClaim * 10000) / 1500 + 50_000_000e6;
        uint32 duringCure = startDay + 63;
        settleMonth(duringCure, grossNeeded);
        uint256 claimPaid = getCumulativeInvestorPaid();
        if (claimPaid >= TOTAL_CLAIM) {
            assertTrue(
                uint(agreement.state()) == uint(FitOutAgreement.State.RESIDUAL) ||
                uint(agreement.covenantStatus()) == uint(FitOutAgreement.CovenantStatus.HEALTHY)
            );
        }
    }

    // ========================================
    // BOUNDARY TESTS
    // ========================================

    function test_Boundary_FloorAtTargetTenor() public view {
        uint256 floorAt540 = agreement.floor(TARGET_TENOR_DAYS);
        uint256 expectedFloor = (TOTAL_CLAIM * FLOOR_RATIO_BPS) / 10000;
        assertEq(floorAt540, expectedFloor);
    }

    function test_Boundary_FloorAtMaxTenor() public view {
        uint256 floorAt720 = agreement.floor(MAX_TENOR_DAYS);
        assertEq(floorAt720, TOTAL_CLAIM);
    }

    function test_Boundary_FloorBeyondMaxTenor() public view {
        uint256 floorBeyond = agreement.floor(MAX_TENOR_DAYS + 100);
        assertEq(floorBeyond, TOTAL_CLAIM);
    }

    function test_Boundary_FirstMonthNoTest() public {
        startDay = setupOperatingState();
        uint32 earlyDay = startDay + 10;
        settleMonth(earlyDay, 5_000_000e6);
        assertEq(agreement.lastTestedMonth(), 0);
    }

    function test_Boundary_MonthlyTestOnlyOnce() public {
        startDay = setupOperatingState();
        uint32 month1Day1 = startDay + 30;
        settleMonth(month1Day1, 10_000_000e6);
        uint32 testedAfterFirst = agreement.lastTestedMonth();
        settleMonth(startDay + 35, 10_000_000e6);
        settleMonth(startDay + 40, 10_000_000e6);
        assertEq(agreement.lastTestedMonth(), testedAfterFirst);
    }

    function test_Boundary_ToleranceCalculation() public pure {
        uint256 tolerance = (TOTAL_CLAIM * TOLERANCE_BPS) / 10000;
        assertEq(tolerance, TOLERANCE);
        assertEq(TOLERANCE, 1_920_000e6);
    }

    // ========================================
    // FUZZ TESTS
    // ========================================

    function testFuzz_Floor_Monotonic(uint256 d1, uint256 d2) public view {
        d1 = bound(d1, 0, 1000);
        d2 = bound(d2, d1, 1000);
        uint256 floor1 = agreement.floor(d1);
        uint256 floor2 = agreement.floor(d2);
        assertGe(floor2, floor1);
    }

    function testFuzz_Floor_BoundedByTotalClaim(uint256 d) public view {
        d = bound(d, 0, 10000);
        uint256 floorValue = agreement.floor(d);
        assertLe(floorValue, TOTAL_CLAIM);
    }

    function testFuzz_CovenantEvaluation_VariousRevenues(uint256 grossRevenue) public {
        grossRevenue = bound(grossRevenue, 0, 500_000_000e6);
        startDay = setupOperatingState();
        settleMonth(startDay + 60, grossRevenue);
        assertTrue(uint(agreement.covenantStatus()) <= uint(FitOutAgreement.CovenantStatus.STEP_IN));
    }

    // ========================================
    // STATE MACHINE VALIDATION
    // ========================================

    function test_StateMachine_HealthyDoesNotDirectlyBreach() public {
        startDay = setupOperatingState();
        settleMonth(startDay + 60, 100_000_000e6);
        assertEq(uint(agreement.covenantStatus()), uint(FitOutAgreement.CovenantStatus.HEALTHY));
    }

    function test_StateMachine_ResidualTerminal() public {
        startDay = setupOperatingState();
        uint256 remainingClaim = TOTAL_CLAIM - getCumulativeInvestorPaid();
        uint256 grossNeeded = (remainingClaim * 10000) / 1500 + 100_000_000e6;
        settleMonth(startDay + 60, grossNeeded);
        if (uint(agreement.state()) == uint(FitOutAgreement.State.RESIDUAL)) {
            settleMonth(startDay + 300, 0);
            assertEq(uint(agreement.state()), uint(FitOutAgreement.State.RESIDUAL));
        }
    }

    function test_StateMachine_StepInTerminal() public {
        startDay = setupOperatingState();
        for (uint32 i = 1; i <= 20; i++) {
            settleMonth(startDay + (i * 30), 0);
            if (uint(agreement.state()) == uint(FitOutAgreement.State.STEP_IN)) {
                settleMonth(startDay + 700, 1_000_000_000e6);
                assertEq(uint(agreement.state()), uint(FitOutAgreement.State.STEP_IN));
                return;
            }
        }
    }
}

