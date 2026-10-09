export type PhysicalLockState = "OPERATING" | "LOCKED" | "OVERRIDDEN";

export interface SmartLockDevice {
  deviceId: string;
  propertyName: string;
  physicalAddress: string;
  provider: "TUYA" | "TTLOCK" | "MQTT_GENERIC" | "SIMULATED";
  state: PhysicalLockState;
  lastChanged: string;
  lastReason?: string;
  batteryLevelBps: number; // e.g. 9500 for 95%
  isOnline: boolean;
}

export interface LockAuditEvent {
  id: string;
  timestamp: string;
  deviceId: string;
  previousState: PhysicalLockState;
  newState: PhysicalLockState;
  triggeredBy: "CONTRACT_EVENT" | "MANUAL_OVERRIDE" | "ARBITER" | "API";
  reason: string;
  txHash?: string;
}
