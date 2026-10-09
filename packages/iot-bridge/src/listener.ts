import { SmartLockController, defaultLockController } from "./lock-controller.js";

export interface ListenerOptions {
  agreementAddress?: string;
  rpcUrl?: string;
  controller?: SmartLockController;
}

/**
 * Event listener bridge linking on-chain StepInTriggered events to physical smart lock actions
 */
export class IoTStepInListener {
  private controller: SmartLockController;
  private isListening: boolean = false;

  constructor(options?: ListenerOptions) {
    this.controller = options?.controller || defaultLockController;
  }

  /**
   * Handle incoming on-chain StepInTriggered event payload
   */
  public handleStepInEvent(payload: {
    agreementAddress: string;
    reason?: string;
    shortfall?: bigint | number;
    txHash?: string;
  }) {
    const reasonText = payload.reason || "Covenant breached twice or bond reserve exhausted";
    console.log(`📡 [IOT BRIDGE] Received StepInTriggered event from agreement ${payload.agreementAddress}`);
    return this.controller.triggerStepInLock(reasonText, payload.txHash);
  }

  public startListening() {
    this.isListening = true;
    console.log("📡 [IOT BRIDGE] Step-In physical listener activated and polling for on-chain events.");
  }

  public stopListening() {
    this.isListening = false;
    console.log("⏹️ [IOT BRIDGE] Step-In physical listener stopped.");
  }

  public getStatus() {
    return {
      isListening: this.isListening,
      lock: this.controller.getStatus(),
    };
  }
}
