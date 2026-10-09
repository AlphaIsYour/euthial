import { SmartLockController } from "../src/lock-controller.js";
import { IoTStepInListener } from "../src/listener.js";

async function runTests() {
  console.log("======================================================");
  console.log("  RUNNING IOT SMART LOCK BRIDGE TESTS (#57)");
  console.log("======================================================");

  const controller = new SmartLockController({
    deviceId: "TEST-LOCK-001",
    state: "OPERATING",
  });
  const listener = new IoTStepInListener({ controller });

  // Test 1: Initial state
  console.log("▶ [Test 1] Verify initial operating state...");
  const initial = controller.getStatus();
  if (initial.state !== "OPERATING") {
    throw new Error(`Expected state OPERATING, got ${initial.state}`);
  }
  console.log("  ✅ Test 1 Passed: Initial state is OPERATING.");

  // Test 2: Trigger Step-In Lock
  console.log("▶ [Test 2] Trigger on-chain Step-In Lock...");
  listener.handleStepInEvent({
    agreementAddress: "0xMockAgreementAddress",
    reason: "Severe revenue shortfall breach",
    txHash: "0xabcdef123456",
  });
  const locked = controller.getStatus();
  if (locked.state !== "LOCKED") {
    throw new Error(`Expected state LOCKED, got ${locked.state}`);
  }
  console.log("  ✅ Test 2 Passed: Lock correctly transitioned to LOCKED.");

  // Test 3: Check audit logs
  console.log("▶ [Test 3] Verify audit log trail...");
  const logs = controller.getAuditLogs();
  if (logs.length === 0 || logs[logs.length - 1].newState !== "LOCKED") {
    throw new Error("Audit log entry missing or invalid");
  }
  console.log(`  ✅ Test 3 Passed: Audit trail recorded ${logs.length} events.`);

  // Test 4: Restore Operating state
  console.log("▶ [Test 4] Restore operating state via Arbiter...");
  controller.restoreOperating("Shortfall paid via legal guarantor");
  const restored = controller.getStatus();
  if (restored.state !== "OPERATING") {
    throw new Error(`Expected state OPERATING, got ${restored.state}`);
  }
  console.log("  ✅ Test 4 Passed: Lock successfully restored to OPERATING.");

  console.log("\n🎉 ALL IOT SMART LOCK TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
