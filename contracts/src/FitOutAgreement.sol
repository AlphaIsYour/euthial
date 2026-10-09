// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract FitOutAgreement is ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Math for uint256;

    enum State { DRAFT, FUNDRAISING, BUILDING, OPERATING, RESIDUAL, CLOSED, STEP_IN, LIQUIDATING, FAILED_REFUND, ABORTED_REFUND }
    enum CovenantStatus { HEALTHY, CURE, BREACHED, STEP_IN }
    enum MilestoneStatus { PENDING, APPROVED, RELEASED }

    struct Milestone { uint16 bps; MilestoneStatus status; bool landlordApproved; bool tenantApproved; bool inspectorApproved; uint8 approvalCount; }

    IERC20 public immutable asset; address public router; address public immutable seniorVault; address public immutable juniorVault;
    address public immutable landlord; address public immutable tenant; address public immutable contractor; address public immutable inspector; address public immutable arbiter;
    address public immutable factory;
    uint256 public immutable budget; uint256 public immutable seniorPrincipal; uint256 public immutable juniorPrincipal;
    uint16 public immutable seniorMultipleBps; uint16 public immutable juniorMultipleBps;
    uint256 public immutable seniorClaim; uint256 public immutable juniorClaim; uint256 public immutable totalClaim; uint256 public immutable bondAmount;
    uint32 public immutable targetTenorDays; uint32 public immutable maxTenorDays; uint16 public immutable floorRatioBps;
    uint16 public immutable toleranceBps; uint16 public immutable cureDays; uint16 public immutable maxExcusedDays;
    uint64 public immutable fundraiseDeadline; uint64 public immutable buildDeadline; uint32 public immutable leaseEndDay;

    State public state; CovenantStatus public covenantStatus; uint32 public startDay; uint32 public lastDayId; uint32 public lastTestedMonth;
    uint32 public excusedDays; uint32 public cureDeadlineDay; uint256 public cureTarget; uint32 public breachCount; bool public oracleStale; uint32 public staleStartDay;
    uint256 public bondDeposited; uint256 public bondBalance; uint256 public bondDrawn; uint256 public bondRefunded;
    Milestone[3] public milestones; uint8 public nextMilestone;
    mapping(uint8 => string[]) private _milestoneCIDs;

    event StateTransitioned(State indexed previousState, State indexed newState, uint256 timestamp);
    event BondDeposited(address indexed from, uint256 amount); event BondDrawn(uint256 amount, uint256 newBalance); event BondRefunded(address indexed to, uint256 amount);
    event MilestoneApproved(uint8 indexed milestoneIndex, address indexed approver); event MilestoneReleased(uint8 indexed milestoneIndex, uint256 seniorAmount, uint256 juniorAmount);
    event CovenantEvaluated(uint32 indexed month, uint256 floor, uint256 claimPaid, uint256 shortfall); event CovenantStatusChanged(CovenantStatus indexed previousStatus, CovenantStatus indexed newStatus);
    event CureStarted(uint32 indexed month, uint256 target, uint32 deadline); event CureResolved(uint256 claimPaid);
    event StepInTriggered(string reason, uint256 remainingShortfall); event ResidualReached(uint32 dayId, uint256 claimPaidTotal);
    event ExcusedDaysMarked(uint32 startDay, uint32 endDay, uint32 count, bytes32 evidenceHash); event OracleStale(uint32 lastDayId, uint32 currentDayId); event OracleRecovered(uint32 newDayId);
    event DocumentCommitted(uint8 indexed milestoneIndex, address indexed submitter, string cid, uint256 timestamp);

    error InvalidState(); error Unauthorized(); error InvalidAddress(); error InvalidBudget(); error BondAlreadyDeposited(); error BondNotDeposited();
    error MilestoneAlreadyReleased(); error InsufficientApprovals(); error MilestoneOutOfOrder(); error ExcusedDaysExceeded();
    error InvalidExcusedRange(); error DeadlinePassed(); error DeadlineNotPassed(); error MilestonesIncomplete(); error RouterAlreadySet();
    error EmptyCID();

    constructor(
        address asset_, address router_, address seniorVault_, address juniorVault_, address landlord_, address tenant_,
        address contractor_, address inspector_, address arbiter_, uint256 budget_, uint256 seniorPrincipal_, uint256 juniorPrincipal_,
        uint16 seniorMultipleBps_, uint16 juniorMultipleBps_, uint32 targetTenorDays_, uint32 maxTenorDays_, uint16 floorRatioBps_,
        uint16 toleranceBps_, uint16 cureDays_, uint16 maxExcusedDays_, uint64 fundraiseDeadline_, uint64 buildDeadline_, uint32 leaseEndDay_
    ) {
        if (asset_ == address(0) || seniorVault_ == address(0) || juniorVault_ == address(0) ||
            landlord_ == address(0) || tenant_ == address(0) || contractor_ == address(0) || inspector_ == address(0) || arbiter_ == address(0)) revert InvalidAddress();
        if (budget_ == 0 || seniorPrincipal_ == 0 || juniorPrincipal_ == 0 || seniorPrincipal_ + juniorPrincipal_ != budget_) revert InvalidBudget();
        if (seniorMultipleBps_ < 10000 || juniorMultipleBps_ < seniorMultipleBps_ || targetTenorDays_ == 0 || maxTenorDays_ < targetTenorDays_ || floorRatioBps_ > 10000 || cureDays_ == 0) revert InvalidBudget();
        asset = IERC20(asset_); router = router_; seniorVault = seniorVault_; juniorVault = juniorVault_; landlord = landlord_; tenant = tenant_;
        contractor = contractor_; inspector = inspector_; arbiter = arbiter_; factory = msg.sender; budget = budget_; seniorPrincipal = seniorPrincipal_; juniorPrincipal = juniorPrincipal_;
        seniorMultipleBps = seniorMultipleBps_; juniorMultipleBps = juniorMultipleBps_;
        seniorClaim = (seniorPrincipal_ * seniorMultipleBps_) / 10000; juniorClaim = (juniorPrincipal_ * juniorMultipleBps_) / 10000;
        totalClaim = seniorClaim + juniorClaim; bondAmount = (budget_ * 10) / 100;
        targetTenorDays = targetTenorDays_; maxTenorDays = maxTenorDays_; floorRatioBps = floorRatioBps_; toleranceBps = toleranceBps_;
        cureDays = cureDays_; maxExcusedDays = maxExcusedDays_; fundraiseDeadline = fundraiseDeadline_; buildDeadline = buildDeadline_; leaseEndDay = leaseEndDay_;
        milestones[0] = Milestone(3000, MilestoneStatus.PENDING, false, false, false, 0);
        milestones[1] = Milestone(4000, MilestoneStatus.PENDING, false, false, false, 0);
        milestones[2] = Milestone(3000, MilestoneStatus.PENDING, false, false, false, 0);
        state = State.DRAFT; covenantStatus = CovenantStatus.HEALTHY;
    }

    function startFundraising() external { if (msg.sender != landlord && msg.sender != tenant) revert Unauthorized(); _transitionState(State.FUNDRAISING); }
    function depositBond() external nonReentrant { _depositBond(bondAmount); }
    function depositBond(uint256 amount) external nonReentrant { _depositBond(amount); }
    function _depositBond(uint256 amount) internal {
        if (msg.sender != tenant) revert Unauthorized();
        if (state != State.FUNDRAISING) revert InvalidState();
        if (bondDeposited > 0) revert BondAlreadyDeposited();
        bondDeposited = amount;
        bondBalance = amount;
        asset.safeTransferFrom(msg.sender, address(this), amount);
        emit BondDeposited(msg.sender, amount);
    }
    function startBuild() external nonReentrant { if (msg.sender != landlord && msg.sender != tenant && msg.sender != arbiter) revert Unauthorized();
        if (state != State.FUNDRAISING) revert InvalidState(); if (block.timestamp > fundraiseDeadline) revert DeadlinePassed();
        if (bondDeposited == 0) revert BondNotDeposited(); _transitionState(State.BUILDING); }
    function failFundraising() external { if (msg.sender != landlord && msg.sender != tenant && msg.sender != arbiter) revert Unauthorized();
        if (state != State.FUNDRAISING) revert InvalidState(); if (block.timestamp <= fundraiseDeadline) revert DeadlineNotPassed(); _transitionState(State.FAILED_REFUND); }
    function abortBuild() external { if (msg.sender != landlord && msg.sender != arbiter) revert Unauthorized();
        if (state != State.BUILDING) revert InvalidState(); if (block.timestamp <= buildDeadline) revert DeadlineNotPassed();
        if (nextMilestone >= 3) revert InvalidState(); _transitionState(State.ABORTED_REFUND); }
    function startOperating() external { if (msg.sender != landlord && msg.sender != tenant && msg.sender != arbiter) revert Unauthorized();
        if (state != State.BUILDING) revert InvalidState(); if (nextMilestone < 3) revert MilestonesIncomplete(); _transitionState(State.OPERATING); }
    function close() external { if (msg.sender != landlord && msg.sender != arbiter) revert Unauthorized(); if (state != State.RESIDUAL) revert InvalidState(); _transitionState(State.CLOSED); }
    function startLiquidation() external { if (msg.sender != arbiter) revert Unauthorized(); if (state != State.STEP_IN) revert InvalidState(); _transitionState(State.LIQUIDATING); }
    function finalizeLiquidation() external nonReentrant { if (msg.sender != arbiter) revert Unauthorized(); if (state != State.LIQUIDATING) revert InvalidState();
        ITrancheVault(juniorVault).writeOffRemaining(); ITrancheVault(seniorVault).writeOffRemaining(); _transitionState(State.CLOSED); }

    function _transitionState(State newState) internal {
        State previousState = state;
        if (previousState == State.DRAFT && newState != State.FUNDRAISING) revert InvalidState();
        if (previousState == State.FUNDRAISING && newState != State.BUILDING && newState != State.FAILED_REFUND) revert InvalidState();
        if (previousState == State.BUILDING && newState != State.OPERATING && newState != State.ABORTED_REFUND) revert InvalidState();
        if (previousState == State.OPERATING && newState != State.RESIDUAL && newState != State.STEP_IN) revert InvalidState();
        if (previousState == State.RESIDUAL && newState != State.CLOSED) revert InvalidState();
        if (previousState == State.STEP_IN && newState != State.LIQUIDATING) revert InvalidState();
        if (previousState == State.LIQUIDATING && newState != State.CLOSED) revert InvalidState();
        if (previousState == State.FAILED_REFUND || previousState == State.ABORTED_REFUND || previousState == State.CLOSED) revert InvalidState();
        state = newState; emit StateTransitioned(previousState, newState, block.timestamp);
    }

    function approveMilestone(uint8 milestoneIndex) external { if (state != State.BUILDING) revert InvalidState();
        if (milestoneIndex >= 3 || milestoneIndex != nextMilestone) revert MilestoneOutOfOrder();
        Milestone storage m = milestones[milestoneIndex]; if (m.status != MilestoneStatus.PENDING) revert MilestoneAlreadyReleased();
        bool approved = false;
        if (msg.sender == landlord && !m.landlordApproved) { m.landlordApproved = true; approved = true; }
        else if (msg.sender == tenant && !m.tenantApproved) { m.tenantApproved = true; approved = true; }
        else if (msg.sender == inspector && !m.inspectorApproved) { m.inspectorApproved = true; approved = true; }
        else revert Unauthorized();
        if (approved) { m.approvalCount++; emit MilestoneApproved(milestoneIndex, msg.sender); if (m.approvalCount >= 2) _releaseMilestone(milestoneIndex); }
    }

    function _releaseMilestone(uint8 milestoneIndex) internal nonReentrant {
        Milestone storage m = milestones[milestoneIndex]; if (m.status != MilestoneStatus.PENDING) revert MilestoneAlreadyReleased();
        if (m.approvalCount < 2) revert InsufficientApprovals(); m.status = MilestoneStatus.RELEASED; nextMilestone++;
        uint256 seniorPortion = (seniorPrincipal * m.bps) / 10000; uint256 juniorPortion = (juniorPrincipal * m.bps) / 10000;
        ITrancheVault(seniorVault).deploy(seniorPortion, contractor); ITrancheVault(juniorVault).deploy(juniorPortion, contractor);
        emit MilestoneReleased(milestoneIndex, seniorPortion, juniorPortion);
    }

    function onSettlement(uint32 dayId, uint256 cumulativeInvestorPaid) external nonReentrant {
        if (msg.sender != router) revert Unauthorized(); if (state != State.OPERATING && state != State.RESIDUAL) return;
        if (lastDayId > 0 && dayId > lastDayId + 3 && !oracleStale) { oracleStale = true; staleStartDay = lastDayId; emit OracleStale(lastDayId, dayId); }
        if (oracleStale) { oracleStale = false; emit OracleRecovered(dayId); }
        if (startDay == 0 && state == State.OPERATING) startDay = dayId; lastDayId = dayId;
        if (state == State.OPERATING && !oracleStale) _evaluateCovenant(cumulativeInvestorPaid);
    }

    function _evaluateCovenant(uint256 cumulativeInvestorPaid) internal {
        if (startDay == 0) return; uint256 d = _calculateLogicalDays(); uint32 monthIndex = uint32(d / 30);
        if (covenantStatus == CovenantStatus.CURE && lastDayId >= cureDeadlineDay) { _processCureExpiry(cumulativeInvestorPaid, d); return; }
        if (monthIndex > lastTestedMonth && monthIndex > 0) {
            lastTestedMonth = monthIndex; uint256 evaluatedFloor = floor(d);
            uint256 shortfall = evaluatedFloor > cumulativeInvestorPaid ? evaluatedFloor - cumulativeInvestorPaid : 0;
            uint256 tolerance = (totalClaim * toleranceBps) / 10000; emit CovenantEvaluated(monthIndex, evaluatedFloor, cumulativeInvestorPaid, shortfall);
            if (shortfall > tolerance) { CovenantStatus prevStatus = covenantStatus; covenantStatus = CovenantStatus.CURE;
                cureTarget = evaluatedFloor; cureDeadlineDay = lastDayId + cureDays; emit CovenantStatusChanged(prevStatus, covenantStatus); emit CureStarted(monthIndex, cureTarget, cureDeadlineDay); }
            else if (covenantStatus != CovenantStatus.CURE && covenantStatus == CovenantStatus.HEALTHY) breachCount = 0;
        }
    }

    function _processCureExpiry(uint256 cumulativeInvestorPaid, uint256 d) internal {
        uint256 tolerance = (totalClaim * toleranceBps) / 10000; uint256 shortfall = cureTarget > cumulativeInvestorPaid ? cureTarget - cumulativeInvestorPaid : 0;
        if (shortfall <= tolerance) { CovenantStatus prevStatus = covenantStatus; covenantStatus = CovenantStatus.HEALTHY;
            emit CovenantStatusChanged(prevStatus, covenantStatus); emit CureResolved(cumulativeInvestorPaid); return; }
        uint256 draw = Math.min(shortfall, bondBalance);
        if (draw > 0) { bondBalance -= draw; bondDrawn += draw; emit BondDrawn(draw, bondBalance); asset.forceApprove(router, draw); }
        breachCount++; CovenantStatus oldStatus = covenantStatus; covenantStatus = CovenantStatus.BREACHED; emit CovenantStatusChanged(oldStatus, covenantStatus);
        uint256 claimPaid = IWaterfallRouter(router).claimPaidTotal();
        if (claimPaid >= totalClaim) { _transitionState(State.RESIDUAL); covenantStatus = CovenantStatus.HEALTHY; emit ResidualReached(lastDayId, claimPaid); return; }
        uint256 remainingShortfall = cureTarget > claimPaid ? cureTarget - claimPaid : 0;
        if (remainingShortfall > tolerance || breachCount >= 2) {
            _transitionState(State.STEP_IN);
            emit StepInTriggered("Bond insufficient or consecutive breaches", remainingShortfall);
            return;
        } else {
            covenantStatus = CovenantStatus.HEALTHY;
            breachCount = 0;
        }
    }

    function _calculateLogicalDays() internal view returns (uint256) { if (lastDayId < startDay) return 0;
        uint256 elapsed = lastDayId - startDay + 1; if (elapsed <= excusedDays) return 0; return elapsed - excusedDays; }

    function floor(uint256 d) public view returns (uint256) { if (d == 0) return 0;
        if (d <= targetTenorDays) return (totalClaim * floorRatioBps * d) / (targetTenorDays * 10000);
        else if (d <= maxTenorDays) { uint256 floorAtTarget = (totalClaim * floorRatioBps) / 10000; uint256 remaining = totalClaim - floorAtTarget;
            return floorAtTarget + (remaining * (d - targetTenorDays)) / (maxTenorDays - targetTenorDays); }
        else return totalClaim; }

    function markExcused(uint32 startDay_, uint32 endDay_, bytes32 evidenceHash) external {
        if (msg.sender != arbiter) revert Unauthorized(); if (state != State.OPERATING) revert InvalidState();
        if (endDay_ < startDay_ || endDay_ > lastDayId + 7) revert InvalidExcusedRange();
        uint32 rangeLength = endDay_ - startDay_ + 1; if (excusedDays + rangeLength > maxExcusedDays) revert ExcusedDaysExceeded();
        excusedDays += rangeLength; emit ExcusedDaysMarked(startDay_, endDay_, rangeLength, evidenceHash); }

    function refundBond() external nonReentrant { if (msg.sender != tenant) revert Unauthorized();
        if (state != State.FAILED_REFUND && state != State.ABORTED_REFUND && state != State.CLOSED) revert InvalidState();
        uint256 refund = bondBalance; if (refund == 0) return; bondBalance = 0; bondRefunded += refund;
        asset.safeTransfer(tenant, refund); emit BondRefunded(tenant, refund); }

    function setRouter(address router_) external {
        if (msg.sender != arbiter && msg.sender != landlord && msg.sender != factory) revert Unauthorized();
        if (router != address(0)) revert RouterAlreadySet();
        if (router_ == address(0)) revert InvalidAddress();
        router = router_;
    }

    function commitCID(uint8 milestoneIndex, string calldata cid) external {
        if (msg.sender != inspector && msg.sender != landlord) revert Unauthorized();
        if (milestoneIndex >= 3) revert InvalidState();
        if (bytes(cid).length == 0) revert EmptyCID();
        _milestoneCIDs[milestoneIndex].push(cid);
        emit DocumentCommitted(milestoneIndex, msg.sender, cid, block.timestamp);
    }

    function getMilestoneCIDs(uint8 milestoneIndex) external view returns (string[] memory) {
        if (milestoneIndex >= 3) revert InvalidState();
        return _milestoneCIDs[milestoneIndex];
    }

    function bondConservation() external view returns (bool) { return bondBalance + bondDrawn + bondRefunded == bondDeposited; }
    function logicalDays() external view returns (uint256) { return _calculateLogicalDays(); }
    function currentFloor() external view returns (uint256) { return floor(_calculateLogicalDays()); }
    function getMilestone(uint8 index) external view returns (uint16 bps, MilestoneStatus status, bool landlordApproved, bool tenantApproved, bool inspectorApproved, uint8 approvalCount) {
        Milestone memory m = milestones[index]; return (m.bps, m.status, m.landlordApproved, m.tenantApproved, m.inspectorApproved, m.approvalCount); }
}

interface IWaterfallRouter { function claimPaidTotal() external view returns (uint256); }
interface ITrancheVault { function deploy(uint256 amount, address to) external; function writeOffRemaining() external; }
