import { defaultLockController } from "./lock-controller.js";
import { IoTStepInListener } from "./listener.js";

async function main() {
  const command = process.argv[2] || "status";
  const listener = new IoTStepInListener({ controller: defaultLockController });

  console.log("======================================================");
  console.log("  EUTHIAL IOT SMART LOCK PHYSICAL STEP-IN BRIDGE (#57)");
  console.log("======================================================");

  switch (command) {
    case "status": {
      const status = defaultLockController.getStatus();
      console.log(`Device ID:      ${status.deviceId}`);
      console.log(`Property:       ${status.propertyName}`);
      console.log(`Physical State: ${status.state === "LOCKED" ? "🔒 LOCKED" : "🔓 OPERATING"}`);
      console.log(`Battery Level:  ${(status.batteryLevelBps / 100).toFixed(1)}%`);
      console.log(`Last Reason:    ${status.lastReason}`);
      break;
    }

    case "lock": {
      console.log("Simulating on-chain Step-In triggered event...");
      listener.handleStepInEvent({
        agreementAddress: "0x89D2E1643c59a35e00fB10283b7E42588147E840",
        reason: "Covenant breach 2x consecutive shortfalls - physical lockout enforced",
        txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      });
      console.log("✅ Smart lock transitioned to LOCKED.");
      break;
    }

    case "unlock": {
      console.log("Simulating arbiter / landlord access restore...");
      defaultLockController.restoreOperating("Arbiter resolved dispute and approved physical access");
      console.log("✅ Smart lock transitioned to OPERATING.");
      break;
    }

    case "listen": {
      listener.startListening();
      console.log("Press Ctrl+C to exit.");
      break;
    }

    default: {
      console.log(`Unknown command: ${command}. Valid commands: status, lock, unlock, listen`);
    }
  }
}

main().catch(console.error);
