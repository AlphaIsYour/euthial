import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Hex, Address } from 'viem';
import {
  createDefaultAgreementParams,
  formatIDR,
  fromTokens,
  initializeAgreement,
  runScenario,
  settlePeriod,
  toTokens,
  type ScenarioDefinition,
  type SettlementResult
} from '../../../packages/sim/src/index.js';
import {
  createEvidenceHash,
  signSettlement,
  verifySettlementSignature,
  type SettlementData,
  type SignerDomainConfig
} from './signer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard mock testnet accounts (Anvil Account #0 & #1)
const DEFAULT_ATTESTOR_KEY: Hex =
  (process.env.ATTESTOR_PRIVATE_KEY as Hex) ||
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const DEFAULT_ROUTER_ADDRESS: Address =
  (process.env.ROUTER_ADDRESS as Address) ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const CHAIN_ID = Number(process.env.CHAIN_ID || 31337);

function parseArgs(): { scenarioName: string; mode: 'sim' | 'chain' } {
  const args = process.argv.slice(2);
  let scenarioName = 'S1';
  let mode: 'sim' | 'chain' = 'sim';

  for (const arg of args) {
    if (arg.startsWith('--scenario=')) {
      scenarioName = arg.split('=')[1].trim();
    } else if (arg.startsWith('--mode=')) {
      mode = arg.split('=')[1].trim() as 'sim' | 'chain';
    }
  }

  return { scenarioName, mode };
}

function resolveScenarioFile(scenarioName: string): { filePath: string; scenario: ScenarioDefinition } {
  const rootDir = path.resolve(__dirname, '../../../');
  const scenariosDir = path.resolve(rootDir, 'scenarios');

  // Support inputs like "S1", "S1_normal", "S4", "S4_leakage30", "S6"
  const files = fs.readdirSync(scenariosDir);
  let targetFile = files.find(
    (f) => f.toLowerCase() === `${scenarioName.toLowerCase()}.json` ||
           f.toLowerCase().startsWith(`${scenarioName.toLowerCase()}_`)
  );

  if (!targetFile) {
    // Default fallback to first matching or S1
    targetFile = 'S1_normal.json';
  }

  const filePath = path.join(scenariosDir, targetFile);
  const raw = fs.readFileSync(filePath, 'utf8');
  const scenario = JSON.parse(raw) as ScenarioDefinition;

  return { filePath, scenario };
}

function printHeader(scenario: ScenarioDefinition, domainConfig: SignerDomainConfig) {
  console.log('\n========================================================================================');
  console.log('                          EUTHIAL SCENARIO RUNNER & ATTESTOR                            ');
  console.log('========================================================================================');
  console.log(`Scenario:       ${scenario.name} [${scenario.id}]`);
  console.log(`Description:    ${scenario.description}`);
  console.log(`Base Daily:     ${formatIDR(scenario.baseDailyGrossIDR)} / day (~${formatIDR(scenario.baseDailyGrossIDR * 30)} / month)`);
  console.log(`Period:         ${scenario.periodDays} days per settlement block`);
  console.log(`Tenor:          ${scenario.months} months (${scenario.months * 30} days)`);
  console.log(`Router Target:  ${domainConfig.verifyingContract} (ChainId: ${domainConfig.chainId})`);
  console.log('----------------------------------------------------------------------------------------\n');
}

function printProgressTable(settlements: SettlementResult[]) {
  console.log('┌──────┬───────┬────────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐');
  console.log('│ Mnth │ DayId │ Gross Revenue  │ Landlord 5%  │ Senior Paid  │ Junior Paid  │ Tenant Keep  │ Floor Target │ Shortfall    │ Covenant     │');
  console.log('├──────┼───────┼────────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤');

  for (const s of settlements) {
    const month = String(Math.ceil(s.dayId / 30)).padStart(4);
    const day = String(s.dayId).padStart(5);
    const gross = formatIDR(s.grossRecorded).padStart(14);
    const landlord = formatIDR(s.landlordAmt).padStart(12);
    const senior = formatIDR(s.toSenior).padStart(12);
    const junior = formatIDR(s.toJunior + s.royaltyAmt).padStart(12);
    const tenant = formatIDR(s.tenantRetain).padStart(12);
    const floor = formatIDR(s.floor).padStart(12);
    const shortfall = formatIDR(s.shortfall).padStart(12);
    const status = s.covenantStatus.padEnd(12);

    console.log(`│ ${month} │ ${day} │ ${gross} │ ${landlord} │ ${senior} │ ${junior} │ ${tenant} │ ${floor} │ ${shortfall} │ ${status} │`);

    if (s.bondDrawn > 0n) {
      console.log(`│ >>>>>│ BOND  │ DRAWN FROM BOND: ${formatIDR(s.bondDrawn).padEnd(20)}                                                       │`);
    }
    if (s.d21ResidualTriggered) {
      console.log(`│ >>>>>│ D-21  │ RULE D-21 ACTIVATED: FULL CLAIM PAID VIA BOND -> SWITCHED TO RESIDUAL!               │`);
    }
    if (s.stepInTriggered) {
      console.log(`│ !!!!!│ ALERT │ COVENANT BREACH ESCALATED TO STEP-IN! LIQUIDATION PROTOCOL TRIGGERED.                │`);
    }
  }

  console.log('└──────┴───────┴────────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘\n');
}

function printSummary(scenario: ScenarioDefinition, settlements: SettlementResult[], finalState: any) {
  const last = settlements[settlements.length - 1];
  console.log('========================================================================================');
  console.log('                                SIMULATION RUN SUMMARY                                  ');
  console.log('========================================================================================');
  console.log(`Final Phase:                ${finalState.phase}`);
  console.log(`Final Covenant Status:      ${finalState.covenantStatus}`);
  console.log(`Total Gross Recorded:       ${formatIDR(finalState.grossRecordedTotal)}`);
  console.log(`Total Paid to Senior:       ${formatIDR(finalState.seniorPaid)} / ${formatIDR(toTokens(150_000_000))} (Target 1.25x)`);
  console.log(`Total Paid to Junior:       ${formatIDR(finalState.juniorPaid)} / ${formatIDR(toTokens(42_000_000))} (Target 1.40x)`);
  console.log(`Total Landlord Revenue:     ${formatIDR(finalState.landlordPaidTotal)} (Turnover Rent 5%)`);
  console.log(`Total Tenant Retained:      ${formatIDR(finalState.tenantRetainedTotal)}`);
  console.log(`Tenant Bond Remaining:      ${formatIDR(finalState.tenantBondBalance)} / ${formatIDR(toTokens(15_000_000))}`);
  console.log(`Total Bond Drawn:           ${formatIDR(finalState.bondDrawnTotal)}`);
  console.log('----------------------------------------------------------------------------------------');

  // Verify against expected outcome if present
  if (scenario.expectedOutcome) {
    const exp = scenario.expectedOutcome;
    console.log('Validation vs Scenario Assertions:');
    if (exp.finalPhase) {
      const match = exp.finalPhase === finalState.phase;
      console.log(`  - Final Phase Match:      ${match ? '✓ PASS' : '✗ FAIL'} (Expected: ${exp.finalPhase}, Actual: ${finalState.phase})`);
    }
    if (exp.bondUsed !== undefined) {
      const actualBondIDR = fromTokens(finalState.bondDrawnTotal);
      console.log(`  - Bond Draw Match:        Actual: ${formatIDR(finalState.bondDrawnTotal)}`);
    }
    if (exp.stepInTriggered !== undefined) {
      const match = exp.stepInTriggered === (finalState.phase === 'STEP_IN');
      console.log(`  - Step-In Match:          ${match ? '✓ PASS' : '✗ FAIL'} (Expected: ${exp.stepInTriggered})`);
    }
  }
  console.log('========================================================================================\n');
}

export async function run() {
  const { scenarioName, mode } = parseArgs();
  const { filePath, scenario } = resolveScenarioFile(scenarioName);

  const domainConfig: SignerDomainConfig = {
    chainId: CHAIN_ID,
    verifyingContract: DEFAULT_ROUTER_ADDRESS
  };

  printHeader(scenario, domainConfig);

  const params = createDefaultAgreementParams();
  const state = initializeAgreement(params);

  const settlements: SettlementResult[] = [];
  const periodDays = scenario.periodDays || 30;
  const totalDays = scenario.months * 30;

  console.log(`[Attestor] Generating and cryptographically signing EIP-712 settlement attestations...`);

  for (let currentDay = periodDays; currentDay <= totalDays; currentDay += periodDays) {
    // 1. Calculate revenue factor
    let factor = 1.0;
    if (scenario.curve && scenario.curve.length > 0) {
      for (const pt of scenario.curve) {
        if (currentDay >= pt.fromDay) {
          factor = pt.factor;
        }
      }
    }
    const leakage = scenario.leakage ?? 0.0;
    const effectiveFactor = factor * (1.0 - leakage);
    const grossIDR = Math.floor(scenario.baseDailyGrossIDR * periodDays * effectiveFactor);
    const grossTokens = toTokens(grossIDR);

    // 2. Prepare EIP-712 Settlement Payload
    const evidenceReport = {
      scenarioId: scenario.id,
      dayId: currentDay,
      periodDays,
      grossIDR,
      timestamp: Date.now()
    };
    const evidenceHash = createEvidenceHash(evidenceReport);

    const settlementData: SettlementData = {
      dayId: currentDay,
      periodDays,
      grossRecorded: grossTokens,
      txCount: Math.floor(grossIDR / 30_000), // ~Rp30k avg basket
      evidenceHash
    };

    // 3. Cryptographically Sign using EIP-712
    const signResult = await signSettlement(settlementData, DEFAULT_ATTESTOR_KEY, domainConfig);

    // 4. Verify Signature Parity
    const isValid = await verifySettlementSignature(
      settlementData,
      signResult.signature,
      signResult.signerAddress,
      domainConfig
    );

    if (!isValid) {
      throw new Error(`[Attestor] EIP-712 signature verification failed at day ${currentDay}!`);
    }

    // 5. Execute Settlement via Deterministic Simulator
    const result = settlePeriod(state, settlementData, params);
    settlements.push(result);

    if (state.phase === 'STEP_IN' || state.phase === 'LIQUIDATING') {
      break;
    }
  }

  printProgressTable(settlements);
  printSummary(scenario, settlements, state);
}

// Execute when called directly
run().catch((err) => {
  console.error('\n[Error running scenario]:', err);
  process.exit(1);
});
