import assert from "assert";
import {
  generateDailySnapQrisBatch,
  aggregateSnapBatch,
  signSettlement,
  verifySettlementSignature,
  signMultiOracleThreshold,
  AttestorService,
  DEFAULT_ORACLE_NODES,
} from "../src/index.js";

async function runTests() {
  console.log("======================================================");
  console.log("  RUNNING ATTESTOR SERVICE UNIT TESTS (#53)");
  console.log("======================================================");

  // Test 1: SNAP BI QRIS Generation & Aggregation
  console.log("▶ [Test 1] SNAP BI Transaction Generation & Aggregation...");
  const txBatch = generateDailySnapQrisBatch(1, 20_000_000, 20, 40);
  assert(txBatch.length >= 20 && txBatch.length <= 40, "Transaction count should be between 20 and 40");
  assert(txBatch[0].amount.currency === "IDR", "Currency must be IDR");
  assert(txBatch[0].merchantId.startsWith("ID"), "Merchant ID must follow SNAP format");

  const settlement = aggregateSnapBatch(txBatch, 1, 1);
  assert.strictEqual(settlement.dayId, 1);
  assert.strictEqual(settlement.periodDays, 1);
  assert.strictEqual(settlement.txCount, txBatch.length);
  assert(settlement.grossRecorded > 0n, "Gross amount must be > 0");
  assert(settlement.evidenceHash.startsWith("0x"), "Evidence hash must be valid hex");
  assert.strictEqual(settlement.evidenceHash.length, 66, "Evidence hash must be 32 bytes (66 chars)");
  console.log("  ✅ Test 1 Passed: SNAP batch correctly aggregated with cryptographic hash.");

  // Test 2: EIP-712 Signing and Verification
  console.log("\n▶ [Test 2] EIP-712 Typed Signing & Address Recovery...");
  const routerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const chainId = 11155111;
  const oracleNode = DEFAULT_ORACLE_NODES[0];

  const { signature, signerAddress } = await signSettlement(
    settlement,
    oracleNode.privateKey,
    routerAddress,
    chainId
  );

  assert.strictEqual(signerAddress.toLowerCase(), oracleNode.address.toLowerCase());
  assert(signature.startsWith("0x"), "Signature must be hex");
  assert.strictEqual(signature.length, 132, "Signature must be 65 bytes (130 hex chars + 0x)");

  const isValid = await verifySettlementSignature(
    settlement,
    signature,
    oracleNode.address,
    routerAddress,
    chainId
  );
  assert.strictEqual(isValid, true, "Signature verification must succeed for legitimate signer");

  // Verify rejection for wrong signer address
  const isWrongSigner = await verifySettlementSignature(
    settlement,
    signature,
    DEFAULT_ORACLE_NODES[1].address,
    routerAddress,
    chainId
  );
  assert.strictEqual(isWrongSigner, false, "Signature verification must reject wrong signer address");

  // Verify rejection for tampered settlement data
  const tamperedSettlement = { ...settlement, grossRecorded: settlement.grossRecorded + 1000n };
  const isTamperedValid = await verifySettlementSignature(
    tamperedSettlement,
    signature,
    oracleNode.address,
    routerAddress,
    chainId
  );
  assert.strictEqual(isTamperedValid, false, "Signature verification must reject tampered settlement data");
  console.log("  ✅ Test 2 Passed: EIP-712 signature recovered & tamper-evident.");

  // Test 3: 2-of-3 Oracle Threshold Consensus
  console.log("\n▶ [Test 3] 2-of-3 Oracle Threshold Consensus Validation...");
  const consensusResult = await signMultiOracleThreshold(
    settlement,
    DEFAULT_ORACLE_NODES,
    2,
    routerAddress,
    chainId
  );

  assert.strictEqual(consensusResult.consensusReached, true);
  assert.strictEqual(consensusResult.oracleSignatures.length, 3);
  assert(consensusResult.primarySignature.startsWith("0x"));

  // Test failing consensus when insufficient nodes
  const singleNodeResult = await signMultiOracleThreshold(
    settlement,
    [DEFAULT_ORACLE_NODES[0]],
    2, // required 2, but only 1 provided
    routerAddress,
    chainId
  );
  assert.strictEqual(singleNodeResult.consensusReached, false, "Consensus must fail when nodes < threshold");
  console.log("  ✅ Test 3 Passed: 2-of-3 threshold logic successfully enforced.");

  // Test 4: AttestorService End-to-End
  console.log("\n▶ [Test 4] AttestorService Full Pipeline Execution...");
  const service = new AttestorService({ routerAddress, chainId });
  const result = await service.attestDay(5, 30_000_000);

  assert.strictEqual(result.settlement.dayId, 5);
  assert.strictEqual(result.consensusReached, true);
  assert(result.settlement.txCount >= 30);
  console.log("  ✅ Test 4 Passed: Full attestDay service pipeline executed cleanly.");

  console.log("\n🎉 ALL ATTESTOR UNIT TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
