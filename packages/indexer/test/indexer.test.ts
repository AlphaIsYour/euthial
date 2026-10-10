/**
 * test/indexer.test.ts
 * Automated Verification Suite for Ponder Event Indexer (#63)
 */

import { EuthialIndexerStore } from "../src/index";
import { EuthialIndexerClient } from "../src/client";

async function runTests() {
  console.log("======================================================");
  console.log("  RUNNING PONDER EVENT INDEXER TESTS (#63)");
  console.log("======================================================");

  const store = new EuthialIndexerStore();
  const client = new EuthialIndexerClient(store);
  const now = Math.floor(Date.now() / 1000);

  // ----------------------------------------------------
  // Test 1: Index Deal Deployment Event
  // ----------------------------------------------------
  console.log("▶ [Test 1] Index DealCreated event...");
  const deal = store.handleDealCreated({
    dealId: 1,
    agreementAddress: "0x1111111111111111111111111111111111111111",
    seniorVaultAddress: "0x2222222222222222222222222222222222222222",
    juniorVaultAddress: "0x3333333333333333333333333333333333333333",
    routerAddress: "0x4444444444444444444444444444444444444444",
    landlordAddress: "0x5555555555555555555555555555555555555555",
    tenantAddress: "0x6666666666666666666666666666666666666666",
    blockNumber: 1000,
    timestamp: now - (90 * 86400), // 90 days ago
  });

  if (store.deals.size !== 1 || deal.id !== "1") {
    throw new Error(`Test 1 Failed: Deal not indexed correctly`);
  }
  console.log(`  ✅ Test 1 Passed: Deal #1 indexed with addresses.`);

  // ----------------------------------------------------
  // Test 2: Index Historical Settlements (inside & outside 6 months)
  // ----------------------------------------------------
  console.log("▶ [Test 2] Index multiple settlements (inside vs outside 6 months)...");
  
  // Settlement A: 30 days ago (in range)
  store.handleSettlementRecorded({
    dealId: 1,
    dayId: 60,
    periodDays: 30,
    grossRecorded: 30_000_000n,
    landlordAmt: 5_000_000n,
    toSenior: 18_000_000n,
    toJunior: 5_000_000n,
    tenantRetain: 2_000_000n,
    phase: "WATERFALL",
    evidenceHash: "0xaaaabbbbcccc111122223333444455556666777788889999aaaabbbbccccdddd",
    blockNumber: 1500,
    timestamp: now - (30 * 86400),
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  });

  // Settlement B: 90 days ago (in range)
  store.handleSettlementRecorded({
    dealId: 1,
    dayId: 30,
    periodDays: 30,
    grossRecorded: 25_000_000n,
    landlordAmt: 4_000_000n,
    toSenior: 15_000_000n,
    toJunior: 4_000_000n,
    tenantRetain: 2_000_000n,
    phase: "WATERFALL",
    evidenceHash: "0xbbbbccccdddd111122223333444455556666777788889999aaaabbbbccccdddd",
    blockNumber: 1200,
    timestamp: now - (90 * 86400),
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  });

  // Settlement C: 210 days ago (OUTSIDE 6 months / 180 days)
  store.handleSettlementRecorded({
    dealId: 1,
    dayId: 1,
    periodDays: 30,
    grossRecorded: 20_000_000n,
    landlordAmt: 3_000_000n,
    toSenior: 12_000_000n,
    toJunior: 3_000_000n,
    tenantRetain: 2_000_000n,
    phase: "WATERFALL",
    evidenceHash: "0xccccdddd111122223333444455556666777788889999aaaabbbbccccddddeeee",
    blockNumber: 900,
    timestamp: now - (210 * 86400),
    txHash: "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
  });

  const queryResult = client.getSettlementsLast6Months(1, now);
  console.log(`  Filtered Count: ${queryResult.count} / Total: ${store.settlements.size}`);
  console.log(`  Total Gross Last 6M: Rp ${queryResult.totalGrossIdr.toLocaleString("id-ID")}`);

  if (queryResult.count !== 2) {
    throw new Error(`Test 2 Failed: Expected 2 settlements in 6-month window, got ${queryResult.count}`);
  }
  if (queryResult.totalGrossIdr !== 55_000_000n) {
    throw new Error(`Test 2 Failed: Expected 55M IDR, got ${queryResult.totalGrossIdr}`);
  }
  console.log("  ✅ Test 2 Passed: 6-month historical settlement filter exact match.");

  // ----------------------------------------------------
  // Test 3: Milestones & Covenant Events Indexing
  // ----------------------------------------------------
  console.log("▶ [Test 3] Index Milestones and Covenant breach events...");
  store.handleDocumentCommitted({
    dealId: 1,
    milestoneIndex: 0,
    cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    timestamp: now - (100 * 86400),
    txHash: "0xdoc1",
  });
  store.handleMilestoneApproved({
    dealId: 1,
    milestoneIndex: 0,
    approver: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    blockNumber: 1050,
    timestamp: now - (98 * 86400),
    txHash: "0xdoc2",
  });

  store.handleCovenantEvaluated({
    dealId: 1,
    month: 3,
    floorTarget: 30_000_000n,
    actualPaid: 22_500_000n,
    shortfall: 7_500_000n,
    eventType: "WARNING",
    reason: "Revenue shortfall 25%",
    blockNumber: 1300,
    timestamp: now - (60 * 86400),
    txHash: "0xcovenant1",
  });

  const summary = client.getDealSummary(1);
  if (summary.milestones.length !== 1 || summary.milestones[0].status !== "APPROVED") {
    throw new Error(`Test 3 Failed: Milestone not indexed properly`);
  }
  if (summary.covenants.length !== 1 || summary.covenants[0].eventType !== "WARNING") {
    throw new Error(`Test 3 Failed: Covenant event not indexed properly`);
  }
  console.log("  ✅ Test 3 Passed: Milestone CID & Covenant breach events indexed.");

  // ----------------------------------------------------
  // Test 4: Check Sync Health Criteria (< 30 seconds)
  // ----------------------------------------------------
  console.log("▶ [Test 4] Verify sync latency status...");
  // Simulate sync event just now
  store.handleSettlementRecorded({
    dealId: 1,
    dayId: 90,
    periodDays: 30,
    grossRecorded: 35_000_000n,
    landlordAmt: 6_000_000n,
    toSenior: 20_000_000n,
    toJunior: 6_000_000n,
    tenantRetain: 3_000_000n,
    phase: "RESIDUAL",
    evidenceHash: "0xdddd",
    blockNumber: 2000,
    timestamp: now - 5, // 5 seconds ago
    txHash: "0xlatest",
  });

  const syncStatus = client.getSyncStatus();
  console.log(`  Sync Latency: ${syncStatus.latencySeconds}s (Healthy threshold: < 30s)`);
  if (syncStatus.latencySeconds > 30) {
    throw new Error(`Test 4 Failed: Sync latency too high (${syncStatus.latencySeconds}s)`);
  }
  console.log("  ✅ Test 4 Passed: Chain synchronization within healthy limit (<30s).");

  console.log("\n🎉 ALL PONDER INDEXER TESTS PASSED SUCCESSFULLY!\n");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
