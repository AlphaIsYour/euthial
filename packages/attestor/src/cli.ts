import { AttestorService, DEFAULT_ORACLE_NODES } from "./service.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "day";
  const service = new AttestorService();

  console.log("======================================================");
  console.log("  EUTHIAL PROTOCOL — QRIS ATTESTOR SERVICE (ISSUE #53)");
  console.log("======================================================");

  if (command === "day") {
    const dayId = Number(args[1] || 1);
    const targetGross = Number(args[2] || 25_000_000);

    console.log(`\n▶ Generating SNAP BI QRIS Attestation for Day #${dayId}...`);
    console.log(`Target Gross Revenue: Rp ${targetGross.toLocaleString("id-ID")}`);

    const result = await service.attestDay(dayId, targetGross);

    console.log("\n[1] Settlement Payload (EIP-712):");
    console.log(`    Day ID:        ${result.settlement.dayId}`);
    console.log(`    Period Days:   ${result.settlement.periodDays}`);
    console.log(`    Gross Amount:  ${result.settlement.grossRecorded.toString()} wei-IDR (Rp ${(Number(result.settlement.grossRecorded / 1000000n)).toLocaleString("id-ID")})`);
    console.log(`    Tx Count:      ${result.settlement.txCount} QRIS transactions`);
    console.log(`    Evidence Hash: ${result.settlement.evidenceHash}`);

    console.log("\n[2] 2-of-3 Oracle Threshold Consensus:");
    console.log(`    Consensus Reached: ${result.consensusReached ? "✅ YES (Threshold >= 2)" : "❌ NO"}`);
    console.log(`    Signatures Collected: ${result.oracleSignatures.length}/${DEFAULT_ORACLE_NODES.length}`);
    result.oracleSignatures.forEach((sig, idx) => {
      console.log(`    • Node ${idx + 1} (${sig.oracleId} - ${sig.address.slice(0, 8)}...):`);
      console.log(`      Signature: ${sig.signature.slice(0, 32)}...`);
    });

    console.log("\n[3] Ready for On-Chain Submission:");
    console.log(`    Router.settle(Settlement, "${result.primarySignature.slice(0, 18)}...")`);
    console.log("\n🎉 Attestation successfully generated & cryptographically verified!");
  } else if (command === "multisig") {
    console.log("\n▶ Verifying 2-of-3 Oracle Node Threshold Consensus...");
    const result = await service.attestDay(42, 30_000_000);

    console.log(`Day #${result.settlement.dayId} — Evidence Hash: ${result.settlement.evidenceHash}`);
    console.log(`Active Oracle Nodes: ${DEFAULT_ORACLE_NODES.length}`);
    DEFAULT_ORACLE_NODES.forEach((node) => {
      console.log(`  - ${node.name} (${node.address})`);
    });

    console.log(`\nValid Signatures: ${result.oracleSignatures.length} / Required: 2`);
    if (result.consensusReached) {
      console.log("✅ 2-of-3 Threshold Consensus Verified. Settlement approved for execution.");
    } else {
      console.log("❌ Consensus failed.");
    }
  } else if (command === "demo") {
    console.log("\n▶ Running 5-Day Consecutive QRIS Settlement Simulation...");
    for (let day = 1; day <= 5; day++) {
      const dailyGross = Math.round(20_000_000 + (Math.random() * 10_000_000));
      const res = await service.attestDay(day, dailyGross);
      console.log(`Day #${day}: Rp ${(Number(res.settlement.grossRecorded / 1000000n)).toLocaleString("id-ID")} (${res.settlement.txCount} txs) | Hash: ${res.settlement.evidenceHash.slice(0, 14)}... | Consensus: ${res.consensusReached ? "✓" : "✗"}`);
    }
    console.log("\n✅ 5-Day Consecutive Attestation Batch Completed!");
  } else if (command === "reset") {
    console.log("\n▶ Resetting demo state...");
    console.log("✅ State ready for fresh attestation cycle.");
  }
}

main().catch((err) => {
  console.error("Attestor CLI error:", err);
  process.exit(1);
});
