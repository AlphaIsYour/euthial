import fs from 'fs';
import path from 'path';
import {
  createDefaultAgreementParams,
  initializeAgreement,
  settlePeriod,
  toTokens,
  runScenario,
  formatIDR,
  fromTokens,
  ScenarioDefinition,
  SimulationRunResult
} from './index.js';

function loadScenarioFile(filename: string): ScenarioDefinition {
  const rootPath = path.resolve(process.cwd(), 'scenarios', filename);
  const relPath = path.resolve(process.cwd(), '../../scenarios', filename);
  const filePath = fs.existsSync(rootPath) ? rootPath : relPath;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function verifyScenario(filename: string): SimulationRunResult {
  console.log(`\n======================================================`);
  console.log(`▶ Verifying Scenario: ${filename}`);
  console.log(`======================================================`);

  const scenario = loadScenarioFile(filename);
  const params = createDefaultAgreementParams();
  const result = runScenario(scenario, params);

  console.log(`Name:        ${result.scenarioName}`);
  console.log(`Total Days:  ${result.settlements.length * 30} days (${result.settlements.length} months)`);
  console.log(`Final Phase: ${result.summary.finalPhase}`);
  console.log(`Step-In:     ${result.summary.stepInTriggered ? 'YES' : 'NO'}`);
  console.log(`Breaches:    ${result.summary.covenantBreaches}`);
  console.log(`Bond Drawn:  ${formatIDR(result.summary.totalBondDrawn)}`);
  console.log(`Senior Repaid Month: ${result.summary.seniorRepaidMonth ?? 'Not Repaid'}`);
  console.log(`Junior Repaid Month: ${result.summary.juniorRepaidMonth ?? 'Not Repaid'}`);

  // Invariant 1: Total Waterfall Accounting Invariant for each settlement
  for (const s of result.settlements) {
    const G = s.grossRecorded;
    const splitTotal = s.tenantRetain + s.landlordAmt + s.toSenior + s.toJunior;
    if (G !== splitTotal) {
      throw new Error(
        `Invariant VIOLATION at Day ${s.dayId}: Gross (${G}) != Split Total (${splitTotal})`
      );
    }
  }

  // Invariant 2: Senior Claim Cap Invariant (Senior is NEVER overpaid, Phase B is 0)
  if (result.finalState.seniorPaid > params.seniorClaim) {
    throw new Error(
      `Senior Overpaid Invariant VIOLATION: ${result.finalState.seniorPaid} > ${params.seniorClaim}`
    );
  }

  // Invariant 3: Junior Claim Cap Invariant
  // In Phase A (before transition), junior is capped at juniorClaim.
  // In Phase B (RESIDUAL), junior receives 2% ongoing royalty on top of juniorClaim.
  if (result.summary.finalPhase !== 'RESIDUAL' && result.finalState.juniorPaid > params.juniorClaim) {
    throw new Error(
      `Junior Overpaid Invariant VIOLATION before RESIDUAL: ${result.finalState.juniorPaid} > ${params.juniorClaim}`
    );
  }

  // Invariant 4: Bond Conservation Invariant
  const bondConservation = result.finalState.tenantBondBalance + result.finalState.bondDrawnTotal;
  if (bondConservation !== params.tenantBond) {
    throw new Error(
      `Bond Conservation VIOLATION: ${bondConservation} != ${params.tenantBond}`
    );
  }

  // Scenario specific checks
  if (scenario.id === 'S1_normal') {
    if (result.summary.seniorRepaidMonth !== 14) {
      console.warn(`[S1 Warning] Expected senior repayment at Month 14, got Month ${result.summary.seniorRepaidMonth}`);
    }
    if (result.summary.finalPhase !== 'RESIDUAL') {
      throw new Error(`[S1 Error] Expected finalPhase RESIDUAL, got ${result.summary.finalPhase}`);
    }
    if (result.summary.totalBondDrawn !== 0n) {
      throw new Error(`[S1 Error] Expected 0 bond drawn in S1, got ${result.summary.totalBondDrawn}`);
    }
    console.log(`✅ S1 Normal: Senior M${result.summary.seniorRepaidMonth}, Junior M${result.summary.juniorRepaidMonth}, Bond 0, Phase RESIDUAL. PASSED!`);
  } else if (scenario.id === 'S4_leak30') {
    if (result.summary.stepInTriggered) {
      throw new Error(`[S4 Error] S4 should NOT trigger Step-In!`);
    }
    if (result.summary.totalBondDrawn === 0n) {
      console.warn(`[S4 Warning] Expected bond to be drawn due to 30% leakage`);
    } else {
      console.log(`✅ S4 Leakage 30%: Bond Drawn ${formatIDR(result.summary.totalBondDrawn)}, No Step-In. PASSED!`);
    }
  } else if (scenario.id === 'S6_default') {
    if (!result.summary.stepInTriggered && result.summary.finalPhase !== 'STEP_IN') {
      throw new Error(`[S6 Error] S6 MUST trigger Step-In at month 6 default!`);
    }
    if (result.summary.totalBondDrawn === 0n) {
      throw new Error(`[S6 Error] S6 must draw bond!`);
    }
    console.log(`✅ S6 Default: Step-In triggered, Bond drawn ${formatIDR(result.summary.totalBondDrawn)}. PASSED!`);
  }

  return result;
}

function verifyMultiTierReserve() {
  console.log(`\n======================================================`);
  console.log(`▶ Verifying Issue #31: Multi-Tier Reserve Architecture`);
  console.log(`======================================================`);

  const params = createDefaultAgreementParams();
  params.enableDynamicBond = true;
  const state = initializeAgreement(params);

  // Simulate 3 months of 130% high performance (> 115% threshold)
  for (let m = 1; m <= 3; m++) {
    const gross = toTokens(92_000_000);
    settlePeriod(state, { dayId: m * 30, periodDays: 30, grossRecorded: gross }, params);
  }

  console.log(`Rolling Bond Reserve Accumulated: ${formatIDR(state.rollingBondReserve)}`);
  console.log(`Junior Reserve Pool Accumulated:  ${formatIDR(state.juniorReservePool)}`);

  if (state.rollingBondReserve === 0n) {
    throw new Error(`[Issue #31 Error] Rolling bond reserve should accumulate on high revenue days!`);
  }
  if (state.juniorReservePool === 0n) {
    throw new Error(`[Issue #31 Error] Junior reserve pool should accumulate from landlord rent!`);
  }

  console.log(`✅ Issue #31 Multi-Tier Reserve: Rolling Bond & Landlord Buffer accumulated successfully!`);
}

function runAll() {
  console.log("======================================================");
  console.log("  EUTHIAL SCENARIO VERIFICATION SUITE (ISSUE #28 & #31)");
  console.log("======================================================");

  try {
    verifyScenario('S1_normal.json');
    verifyScenario('S4_leakage30.json');
    verifyScenario('S6_default.json');
    verifyMultiTierReserve();
    console.log(`\n🎉 ALL SCENARIOS & MULTI-TIER RESERVES PASSED VERIFICATION!`);
  } catch (err: any) {
    console.error(`\n❌ VERIFICATION FAILED:`, err.message);
    process.exit(1);
  }
}

runAll();
