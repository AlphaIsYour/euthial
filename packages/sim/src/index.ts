/**
 * Euthial Economic Simulator Engine
 *
 * Deterministic, pure TypeScript module replicating Solidity smart contract
 * waterfall distribution, ERC-4626 dual-tranche accounting, and payment floor
 * covenant mechanics with 100% parity.
 *
 * References:
 *   - docs/02_ECONOMIC_MODEL.md (Sections 3, 4, 11)
 *   - docs/05_SMART_CONTRACT_SPEC.md (Sections 5, 8)
 *   - docs/06_MVP_BUILD_PLAN.md (FR-S01..FR-S03, FR-06, FR-08)
 */

export interface AgreementParams {
  budget: bigint;                    // e.g. 150_000_000 * 10^6
  seniorPrincipalRatioBps: number;   // 8000 = 80% (120M)
  juniorPrincipalRatioBps: number;   // 2000 = 20% (30M)
  tenantBondRatioBps: number;        // 1000 = 10% (15M)
  seniorMultipleBps: number;         // 12500 = 1.25x (150M claim)
  juniorMultipleBps: number;         // 14000 = 1.40x (42M claim)
  landlordTakeBpsPhaseA: number;     // 500 = 5% turnover rent
  investorTakeBpsPhaseA: number;     // 1500 = 15% investor take-rate
  landlordTakeBpsPhaseB: number;     // 500 = 5% turnover rent
  royaltyBpsPhaseB: number;          // 200 = 2% junior residual royalty
  targetTenorDays: number;           // 540 days (~18 months)
  maxTenorDays: number;              // 720 days (~24 months)
  floorRatioBps: number;             // 6000 = 60% of total claim at Tt
  toleranceBps: number;              // 100 = 1% of total claim
  cureDays: number;                  // 7 logical days
  healthWindowDays: number;          // 14 logical days
  healthFloorDaily: bigint;          // e.g. 1_422_222 * 10^6
  maxExcusedDays: number;            // 30 days
  totalClaim: bigint;                // Calculated: seniorClaim + juniorClaim
  seniorPrincipal: bigint;
  juniorPrincipal: bigint;
  seniorClaim: bigint;
  juniorClaim: bigint;
  tenantBond: bigint;
  enableDynamicBond?: boolean;       // Issue #31: Dynamic Rolling Bond & Buffer Pool
  rollingBondRetentionBps?: number;  // 300 = 3% of tenant retainable cash
  rollingBondCeiling?: bigint;       // e.g. 35_000_000 * 10^6
  landlordReserveBps?: number;       // 4000 = 40% of landlord turnover rent
  landlordReserveCeiling?: bigint;   // e.g. 10_000_000 * 10^6
}

export type AgreementPhase =
  | 'DRAFT'
  | 'FUNDRAISING'
  | 'BUILDING'
  | 'OPERATING'
  | 'RESIDUAL'
  | 'STEP_IN'
  | 'LIQUIDATING'
  | 'CLOSED';

export type CovenantStatus =
  | 'HEALTHY'
  | 'WARNING'
  | 'CURE'
  | 'BREACHED'
  | 'STEP_IN';

export interface AgreementState {
  phase: AgreementPhase;
  covenantStatus: CovenantStatus;
  startDay: number;
  lastDayId: number;
  excusedDays: number;
  lastTestedMonth: number;
  seniorPaid: bigint;
  juniorPaid: bigint;
  seniorOutstandingClaim: bigint;
  juniorOutstandingClaim: bigint;
  claimPaidTotal: bigint;
  tenantBondBalance: bigint;
  bondDrawnTotal: bigint;
  rollingBondReserve: bigint;        // Issue #31: Accumulated rolling buffer from high-revenue days
  juniorReservePool: bigint;         // Issue #31: Secondary buffer from landlord turnover rent
  rollingBondDrawnTotal: bigint;     // Total drawn from rolling reserve
  juniorReserveDrawnTotal: bigint;   // Total drawn from junior reserve pool
  rollingBondRefunded: bigint;       // Refunded to tenant upon claim completion
  landlordPaidTotal: bigint;
  tenantRetainedTotal: bigint;
  grossRecordedTotal: bigint;
  breachCount: number;
  cureTarget: bigint;
  cureDeadlineDay: number;
  txCountTotal: number;
  recentSettlements: Array<{ gross: bigint; periodDays: number }>;
}

export interface SettlementInput {
  dayId: number;
  periodDays: number;
  grossRecorded: bigint;
  txCount?: number;
  cureTopUp?: bigint;
  isExcused?: boolean;
}

export interface SettlementResult {
  dayId: number;
  periodDays: number;
  effectiveDay: number;
  grossRecorded: bigint;
  phaseBefore: AgreementPhase;
  phaseAfter: AgreementPhase;
  covenantStatus: CovenantStatus;
  landlordAmt: bigint;
  investorAmt: bigint;
  toSenior: bigint;
  toJunior: bigint;
  royaltyAmt: bigint;
  tenantRetain: bigint;
  pullAmount: bigint;
  floor: bigint;
  shortfall: bigint;
  cureTriggered: boolean;
  bondDrawn: bigint;
  rollingBondAdded: bigint;          // Issue #31
  juniorReserveAdded: bigint;        // Issue #31
  rollingBondDrawn: bigint;          // Issue #31
  juniorReserveDrawn: bigint;        // Issue #31
  rollingBondRefunded: bigint;       // Issue #31
  stepInTriggered: boolean;
  d21ResidualTriggered: boolean;
  stateSnapshot: AgreementState;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  baseDailyGrossIDR: number;
  periodDays: number;
  months: number;
  curve?: Array<{ fromDay: number; factor: number }>;
  leakage?: number;
  events?: Array<{ day: number; type: string; description: string; amount?: number }>;
  expectedOutcome?: {
    seniorRepaidByMonth?: number | null;
    juniorRepaidByMonth?: number | null;
    finalPhase?: string;
    bondUsed?: number;
    stepInTriggered?: boolean;
  };
}

export interface SimulationRunResult {
  scenarioId: string;
  scenarioName: string;
  settlements: SettlementResult[];
  finalState: AgreementState;
  summary: {
    totalGrossRecorded: bigint;
    totalToSenior: bigint;
    totalToJunior: bigint;
    totalToLandlord: bigint;
    totalTenantRetained: bigint;
    totalBondDrawn: bigint;
    seniorRepaidDay: number | null;
    juniorRepaidDay: number | null;
    seniorRepaidMonth: number | null;
    juniorRepaidMonth: number | null;
    finalPhase: AgreementPhase;
    covenantBreaches: number;
    stepInTriggered: boolean;
  };
}

const TOKEN_SCALE = 1_000_000n; // 6 decimals (MockIDR)

export function toTokens(idr: number | bigint): bigint {
  return BigInt(idr) * TOKEN_SCALE;
}

export function fromTokens(tokens: bigint): number {
  return Number(tokens / TOKEN_SCALE);
}

export function formatIDR(amount: bigint | number): string {
  const num = typeof amount === 'bigint' ? fromTokens(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

/**
 * Creates default parameters matching the Euthial Jember pilot specifications.
 * Budget: Rp150,000,000.
 */
export function createDefaultAgreementParams(budgetIDR: number = 150_000_000): AgreementParams {
  const budget = toTokens(budgetIDR);
  const seniorPrincipal = (budget * 8000n) / 10000n; // 120M
  const juniorPrincipal = (budget * 2000n) / 10000n; // 30M
  const tenantBond = (budget * 1000n) / 10000n;      // 15M

  const seniorClaim = (seniorPrincipal * 12500n) / 10000n; // 150M (1.25x)
  const juniorClaim = (juniorPrincipal * 14000n) / 10000n; // 42M (1.40x)
  const totalClaim = seniorClaim + juniorClaim;           // 192M

  return {
    budget,
    seniorPrincipalRatioBps: 8000,
    juniorPrincipalRatioBps: 2000,
    tenantBondRatioBps: 1000,
    seniorMultipleBps: 12500,
    juniorMultipleBps: 14000,
    landlordTakeBpsPhaseA: 500,
    investorTakeBpsPhaseA: 1500,
    landlordTakeBpsPhaseB: 500,
    royaltyBpsPhaseB: 200,
    targetTenorDays: 540,
    maxTenorDays: 720,
    floorRatioBps: 6000,
    toleranceBps: 100,
    cureDays: 7,
    healthWindowDays: 14,
    healthFloorDaily: toTokens(1_422_222),
    maxExcusedDays: 30,
    seniorPrincipal,
    juniorPrincipal,
    seniorClaim,
    juniorClaim,
    totalClaim,
    tenantBond,
    enableDynamicBond: true,
    rollingBondRetentionBps: 300,
    rollingBondCeiling: toTokens(35_000_000),
    landlordReserveBps: 4000,
    landlordReserveCeiling: toTokens(10_000_000)
  };
}

/**
 * Initializes a new agreement state at OPERATING phase (ready for settlement).
 */
export function initializeAgreement(params: AgreementParams, startDay: number = 1): AgreementState {
  return {
    phase: 'OPERATING',
    covenantStatus: 'HEALTHY',
    startDay,
    lastDayId: startDay - 1,
    excusedDays: 0,
    lastTestedMonth: 0,
    seniorPaid: 0n,
    juniorPaid: 0n,
    seniorOutstandingClaim: params.seniorClaim,
    juniorOutstandingClaim: params.juniorClaim,
    claimPaidTotal: 0n,
    tenantBondBalance: params.tenantBond,
    bondDrawnTotal: 0n,
    rollingBondReserve: 0n,
    juniorReservePool: 0n,
    rollingBondDrawnTotal: 0n,
    juniorReserveDrawnTotal: 0n,
    rollingBondRefunded: 0n,
    landlordPaidTotal: 0n,
    tenantRetainedTotal: 0n,
    grossRecordedTotal: 0n,
    breachCount: 0,
    cureTarget: 0n,
    cureDeadlineDay: 0,
    txCountTotal: 0,
    recentSettlements: []
  };
}

/**
 * Floor calculation matching Section 5.4 of 05_SMART_CONTRACT_SPEC.md.
 * Piecewise linear curve:
 *   - d <= Tt: Floor = C * f * d / (Tt * 10000)
 *   - d <= Tm: Floor = C*f/10000 + (C - C*f/10000) * (d - Tt) / (Tm - Tt)
 *   - d > Tm:  Floor = C
 */
export function calculateFloor(effectiveDay: number, params: AgreementParams): bigint {
  const d = BigInt(Math.max(0, effectiveDay));
  const Tt = BigInt(params.targetTenorDays);
  const Tm = BigInt(params.maxTenorDays);
  const C = params.totalClaim;
  const f = BigInt(params.floorRatioBps);

  if (d <= Tt) {
    return (C * f * d) / (Tt * 10000n);
  } else if (d <= Tm) {
    const base = (C * f) / 10000n;
    const remaining = C - base;
    return base + (remaining * (d - Tt)) / (Tm - Tt);
  } else {
    return C;
  }
}

/**
 * Previews the waterfall split for a given gross revenue G.
 */
export function previewSplit(
  grossRecorded: bigint,
  phase: AgreementPhase,
  params: AgreementParams,
  seniorPaid: bigint,
  juniorPaid: bigint
): {
  landlordAmt: bigint;
  investorAmt: bigint;
  toSenior: bigint;
  toJunior: bigint;
  royaltyAmt: bigint;
  tenantRetain: bigint;
  pullAmount: bigint;
} {
  const G = grossRecorded;
  if (phase === 'RESIDUAL') {
    const landlordAmt = (G * BigInt(params.landlordTakeBpsPhaseB)) / 10000n;
    const royaltyAmt = (G * BigInt(params.royaltyBpsPhaseB)) / 10000n;
    const pullAmount = landlordAmt + royaltyAmt;
    const tenantRetain = G - pullAmount;
    return {
      landlordAmt,
      investorAmt: 0n,
      toSenior: 0n,
      toJunior: royaltyAmt,
      royaltyAmt,
      tenantRetain,
      pullAmount
    };
  }

  // Phase A: Amortization
  const landlordAmt = (G * BigInt(params.landlordTakeBpsPhaseA)) / 10000n;
  const investorAmt = (G * BigInt(params.investorTakeBpsPhaseA)) / 10000n;

  const seniorOutstanding = params.seniorClaim > seniorPaid ? params.seniorClaim - seniorPaid : 0n;
  const juniorOutstanding = params.juniorClaim > juniorPaid ? params.juniorClaim - juniorPaid : 0n;
  const needed = seniorOutstanding + juniorOutstanding;

  const payInvestors = investorAmt < needed ? investorAmt : needed;
  const toSenior = payInvestors < seniorOutstanding ? payInvestors : seniorOutstanding;
  const toJunior = payInvestors - toSenior;

  const pullAmount = landlordAmt + payInvestors;
  const tenantRetain = G - pullAmount;

  return {
    landlordAmt,
    investorAmt: payInvestors,
    toSenior,
    toJunior,
    royaltyAmt: 0n,
    tenantRetain,
    pullAmount
  };
}

/**
 * Executes a settlement period against the agreement state.
 * Implements 100% Solidity smart contract logic including:
 *   - Sequential tranche priority (Senior 100% first, then Junior)
 *   - Cumulative Payment Floor tests every 30 logical days
 *   - Escalation ladder (CURE for 7 days -> Bond draw -> STEP_IN)
 *   - Decision D-21: Transition directly to RESIDUAL if bond draw completes claim
 */
export function settlePeriod(
  state: AgreementState,
  input: SettlementInput,
  params: AgreementParams
): SettlementResult {
  const phaseBefore = state.phase;
  const G = input.grossRecorded;

  if (input.isExcused) {
    state.excusedDays += input.periodDays;
  }

  state.lastDayId = input.dayId;
  state.grossRecordedTotal += G;
  state.txCountTotal += input.txCount ?? 0;

  // Handle optional cure top-up from tenant
  if (input.cureTopUp && input.cureTopUp > 0n && state.covenantStatus === 'CURE') {
    const topUp = input.cureTopUp;
    const seniorRemaining = params.seniorClaim > state.seniorPaid ? params.seniorClaim - state.seniorPaid : 0n;
    const seniorTopUp = topUp < seniorRemaining ? topUp : seniorRemaining;
    const juniorTopUp = topUp - seniorTopUp;
    state.seniorPaid += seniorTopUp;
    state.juniorPaid += juniorTopUp;
  }

  // Compute waterfall split
  const split = previewSplit(G, state.phase, params, state.seniorPaid, state.juniorPaid);

  state.seniorPaid += split.toSenior;
  state.juniorPaid += split.toJunior;
  state.landlordPaidTotal += split.landlordAmt;
  state.tenantRetainedTotal += split.tenantRetain;

  state.seniorOutstandingClaim = params.seniorClaim > state.seniorPaid ? params.seniorClaim - state.seniorPaid : 0n;
  state.juniorOutstandingClaim = params.juniorClaim > state.juniorPaid ? params.juniorClaim - state.juniorPaid : 0n;
  state.claimPaidTotal = state.seniorPaid + state.juniorPaid;

  // Update ring buffer for health monitoring
  state.recentSettlements.push({ gross: G, periodDays: input.periodDays });
  if (state.recentSettlements.length > 32) {
    state.recentSettlements.shift();
  }

  // Effective logical days elapsed
  const effectiveDay = Math.max(0, state.lastDayId - state.startDay + 1 - state.excusedDays);
  const floor = calculateFloor(effectiveDay, params);
  const tolerance = (params.totalClaim * BigInt(params.toleranceBps)) / 10000n;

  let cureTriggered = false;
  let bondDrawn = 0n;
  let rollingBondAdded = 0n;
  let juniorReserveAdded = 0n;
  let rollingBondDrawn = 0n;
  let juniorReserveDrawn = 0n;
  let rollingBondRefunded = 0n;
  let stepInTriggered = false;
  let d21ResidualTriggered = false;

  // Issue #31: Dynamic Rolling Bond & Landlord Buffer Pool Accumulation
  if (params.enableDynamicBond && state.phase === 'OPERATING') {
    const periodDaysBig = BigInt(input.periodDays);
    const dailyRate = periodDaysBig > 0n ? G / periodDaysBig : 0n;
    const targetDaily = params.budget / BigInt(params.targetTenorDays);
    const thresholdDaily = (targetDaily * 115n) / 100n; // >115% daily target

    // High revenue day: Retain 3% to Rolling Bond Reserve (Ceiling Rp 35M)
    const rollingCeiling = params.rollingBondCeiling ?? toTokens(35_000_000);
    if (dailyRate >= thresholdDaily && state.rollingBondReserve < rollingCeiling) {
      const room = rollingCeiling - state.rollingBondReserve;
      const tentative = (split.tenantRetain * BigInt(params.rollingBondRetentionBps ?? 300)) / 10000n;
      rollingBondAdded = tentative < room ? tentative : room;
      state.rollingBondReserve += rollingBondAdded;
    }

    // Landlord 40% secondary buffer pool (Ceiling Rp 10M)
    const landlordCeiling = params.landlordReserveCeiling ?? toTokens(10_000_000);
    if (state.juniorReservePool < landlordCeiling) {
      const lRoom = landlordCeiling - state.juniorReservePool;
      const lTentative = (split.landlordAmt * BigInt(params.landlordReserveBps ?? 4000)) / 10000n;
      juniorReserveAdded = lTentative < lRoom ? lTentative : lRoom;
      state.juniorReservePool += juniorReserveAdded;
    }
  }

  // Check if total claim is already satisfied by normal payments
  if (state.phase === 'OPERATING' && state.claimPaidTotal >= params.totalClaim) {
    state.phase = 'RESIDUAL';
    state.covenantStatus = 'HEALTHY';
    rollingBondRefunded = state.rollingBondReserve + state.tenantBondBalance;
    state.rollingBondRefunded = rollingBondRefunded;
  }

  // Monthly Covenant Evaluation (every 30 logical days)
  const monthIndex = Math.floor(effectiveDay / 30);
  const shortfall = floor > state.claimPaidTotal ? floor - state.claimPaidTotal : 0n;

  if (monthIndex > state.lastTestedMonth && state.phase === 'OPERATING') {
    state.lastTestedMonth = monthIndex;
    if (shortfall > tolerance && state.covenantStatus !== 'CURE') {
      state.covenantStatus = 'CURE';
      state.cureTarget = floor;
      state.cureDeadlineDay = state.lastDayId + params.cureDays;
      cureTriggered = true;
    } else if (state.covenantStatus !== 'CURE') {
      state.breachCount = 0;
      state.covenantStatus = 'HEALTHY';
    }
  }

  // Cure Evaluation & Multi-Tier Bond Draw
  if (state.covenantStatus === 'CURE' && state.lastDayId >= state.cureDeadlineDay && state.phase === 'OPERATING') {
    const cureShortfall = state.cureTarget > state.claimPaidTotal ? state.cureTarget - state.claimPaidTotal : 0n;
    if (cureShortfall <= tolerance) {
      // Tenant met target through revenue or top-up
      state.covenantStatus = 'HEALTHY';
      state.breachCount = 0;
    } else {
      // Tier 1: Draw from base tenant bond
      const needed = cureShortfall;
      bondDrawn = needed < state.tenantBondBalance ? needed : state.tenantBondBalance;
      state.tenantBondBalance -= bondDrawn;
      state.bondDrawnTotal += bondDrawn;

      let remainingShortfall = needed - bondDrawn;

      // Tier 2: Draw from dynamic rolling bond reserve (Issue #31)
      if (params.enableDynamicBond && remainingShortfall > 0n && state.rollingBondReserve > 0n) {
        rollingBondDrawn = remainingShortfall < state.rollingBondReserve ? remainingShortfall : state.rollingBondReserve;
        state.rollingBondReserve -= rollingBondDrawn;
        state.rollingBondDrawnTotal += rollingBondDrawn;
        remainingShortfall -= rollingBondDrawn;
      }

      // Tier 3: Draw from landlord secondary buffer pool (Issue #31)
      if (params.enableDynamicBond && remainingShortfall > 0n && state.juniorReservePool > 0n) {
        juniorReserveDrawn = remainingShortfall < state.juniorReservePool ? remainingShortfall : state.juniorReservePool;
        state.juniorReservePool -= juniorReserveDrawn;
        state.juniorReserveDrawnTotal += juniorReserveDrawn;
        remainingShortfall -= juniorReserveDrawn;
      }

      const totalCoverage = bondDrawn + rollingBondDrawn + juniorReserveDrawn;

      // Inject coverage sequentially: Senior first, then Junior
      const seniorRemaining = params.seniorClaim > state.seniorPaid ? params.seniorClaim - state.seniorPaid : 0n;
      const bondToSenior = totalCoverage < seniorRemaining ? totalCoverage : seniorRemaining;
      const bondToJunior = totalCoverage - bondToSenior;

      state.seniorPaid += bondToSenior;
      state.juniorPaid += bondToJunior;
      state.claimPaidTotal = state.seniorPaid + state.juniorPaid;
      state.seniorOutstandingClaim = params.seniorClaim > state.seniorPaid ? params.seniorClaim - state.seniorPaid : 0n;
      state.juniorOutstandingClaim = params.juniorClaim > state.juniorPaid ? params.juniorClaim - state.juniorPaid : 0n;

      state.breachCount += 1;

      // Decision D-21: If bond draw satisfied the total claim in full, immediately transition to RESIDUAL
      if (state.claimPaidTotal >= params.totalClaim) {
        state.phase = 'RESIDUAL';
        state.covenantStatus = 'HEALTHY';
        state.breachCount = 0;
        rollingBondRefunded = state.rollingBondReserve + state.tenantBondBalance;
        state.rollingBondRefunded = rollingBondRefunded;
        d21ResidualTriggered = true;
      } else {
        const remainingDeficit = state.cureTarget > state.claimPaidTotal ? state.cureTarget - state.claimPaidTotal : 0n;
        if (remainingDeficit > tolerance || state.breachCount >= 2) {
          state.phase = 'STEP_IN';
          state.covenantStatus = 'STEP_IN';
          stepInTriggered = true;
        } else {
          state.covenantStatus = 'HEALTHY';
        }
      }
    }
  }

  return {
    dayId: input.dayId,
    periodDays: input.periodDays,
    effectiveDay,
    grossRecorded: G,
    phaseBefore,
    phaseAfter: state.phase,
    covenantStatus: state.covenantStatus,
    landlordAmt: split.landlordAmt,
    investorAmt: split.investorAmt,
    toSenior: split.toSenior,
    toJunior: split.toJunior,
    royaltyAmt: split.royaltyAmt,
    tenantRetain: split.tenantRetain,
    pullAmount: split.pullAmount,
    floor,
    shortfall,
    cureTriggered,
    bondDrawn,
    rollingBondAdded,
    juniorReserveAdded,
    rollingBondDrawn,
    juniorReserveDrawn,
    rollingBondRefunded,
    stepInTriggered,
    d21ResidualTriggered,
    stateSnapshot: { ...state }
  };
}

/**
 * Runs a complete scenario simulation from JSON definition.
 */
export function runScenario(scenario: ScenarioDefinition, customParams?: AgreementParams): SimulationRunResult {
  const params = customParams ?? createDefaultAgreementParams();
  const state = initializeAgreement(params);

  const settlements: SettlementResult[] = [];
  const periodDays = scenario.periodDays || 30;
  const totalDays = scenario.months * 30;

  let seniorRepaidDay: number | null = null;
  let juniorRepaidDay: number | null = null;

  for (let currentDay = periodDays; currentDay <= totalDays; currentDay += periodDays) {
    // Determine revenue factor from curve
    let factor = 1.0;
    if (scenario.curve && scenario.curve.length > 0) {
      for (const pt of scenario.curve) {
        if (currentDay >= pt.fromDay) {
          factor = pt.factor;
        }
      }
    }

    // Apply cash leakage if specified
    const leakage = scenario.leakage ?? 0.0;
    const effectiveFactor = factor * (1.0 - leakage);

    // Calculate gross revenue for this period
    const grossIDR = Math.floor(scenario.baseDailyGrossIDR * periodDays * effectiveFactor);
    const grossTokens = toTokens(grossIDR);

    // Settle period
    const res = settlePeriod(
      state,
      {
        dayId: currentDay,
        periodDays,
        grossRecorded: grossTokens
      },
      params
    );

    if (seniorRepaidDay === null && state.seniorPaid >= params.seniorClaim) {
      seniorRepaidDay = currentDay;
    }
    if (juniorRepaidDay === null && state.juniorPaid >= params.juniorClaim) {
      juniorRepaidDay = currentDay;
    }

    settlements.push(res);

    if (state.phase === 'STEP_IN' || state.phase === 'LIQUIDATING') {
      // Protocol halts in step in / liquidation
      break;
    }
  }

  const seniorRepaidMonth = seniorRepaidDay ? Math.ceil(seniorRepaidDay / 30) : null;
  const juniorRepaidMonth = juniorRepaidDay ? Math.ceil(juniorRepaidDay / 30) : null;

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    settlements,
    finalState: { ...state },
    summary: {
      totalGrossRecorded: state.grossRecordedTotal,
      totalToSenior: state.seniorPaid,
      totalToJunior: state.juniorPaid,
      totalToLandlord: state.landlordPaidTotal,
      totalTenantRetained: state.tenantRetainedTotal,
      totalBondDrawn: state.bondDrawnTotal,
      seniorRepaidDay,
      juniorRepaidDay,
      seniorRepaidMonth,
      juniorRepaidMonth,
      finalPhase: state.phase,
      covenantBreaches: state.breachCount,
      stepInTriggered: state.phase === 'STEP_IN'
    }
  };
}
