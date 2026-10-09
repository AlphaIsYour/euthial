import { SmartLockDevice, PhysicalLockState, LockAuditEvent } from "./types.js";

export class SmartLockController {
  private device: SmartLockDevice;
  private auditLog: LockAuditEvent[] = [];

  constructor(initialDevice?: Partial<SmartLockDevice>) {
    this.device = {
      deviceId: initialDevice?.deviceId || "LOCK-RUKO-001",
      propertyName: initialDevice?.propertyName || "Ruko Kemang Grand Square No. 12",
      physicalAddress: initialDevice?.physicalAddress || "Jl. Kemang Raya No. 12, Jakarta Selatan",
      provider: initialDevice?.provider || "SIMULATED",
      state: initialDevice?.state || "OPERATING",
      lastChanged: new Date().toISOString(),
      batteryLevelBps: 9400,
      isOnline: true,
      lastReason: "Initial operating state",
    };
  }

  public getStatus(): SmartLockDevice {
    return { ...this.device };
  }

  public getAuditLogs(): LockAuditEvent[] {
    return [...this.auditLog];
  }

  /**
   * Enforce physical Step-In Lock on ruko asset
   */
  public triggerStepInLock(reason: string, txHash?: string): LockAuditEvent {
    const previousState = this.device.state;
    this.device.state = "LOCKED";
    this.device.lastChanged = new Date().toISOString();
    this.device.lastReason = reason;

    const auditEntry: LockAuditEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      deviceId: this.device.deviceId,
      previousState,
      newState: "LOCKED",
      triggeredBy: "CONTRACT_EVENT",
      reason,
      txHash,
    };

    this.auditLog.push(auditEntry);
    console.log(
      `🔒 [SMART LOCK ENFORCED] Device ${this.device.deviceId} is now LOCKED. Reason: ${reason}`
    );
    return auditEntry;
  }

  /**
   * Unlock or restore operating status (e.g. after shortfall cure or arbiter resolution)
   */
  public restoreOperating(reason: string, triggeredBy: "ARBITER" | "MANUAL_OVERRIDE" = "ARBITER"): LockAuditEvent {
    const previousState = this.device.state;
    this.device.state = "OPERATING";
    this.device.lastChanged = new Date().toISOString();
    this.device.lastReason = reason;

    const auditEntry: LockAuditEvent = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      deviceId: this.device.deviceId,
      previousState,
      newState: "OPERATING",
      triggeredBy,
      reason,
    };

    this.auditLog.push(auditEntry);
    console.log(
      `🔓 [SMART LOCK RESTORED] Device ${this.device.deviceId} is now OPERATING. Reason: ${reason}`
    );
    return auditEntry;
  }
}

// Global shared singleton for the application
export const defaultLockController = new SmartLockController();
