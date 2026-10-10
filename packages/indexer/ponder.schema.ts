/**
 * ponder.schema.ts
 * Ponder Event Indexer Schema for Euthial Protocol
 * Issue #63 [C-06]
 */

export interface IndexedDeal {
  id: string; // dealId as string
  dealId: number;
  agreementAddress: string;
  seniorVaultAddress: string;
  juniorVaultAddress: string;
  routerAddress: string;
  landlordAddress: string;
  tenantAddress: string;
  createdAtBlock: number;
  createdAtTimestamp: number;
}

export interface IndexedSettlement {
  id: string; // `${dealId}-${dayId}-${txHash}`
  dealId: number;
  dayId: number;
  periodDays: number;
  grossRecorded: bigint;
  landlordAmt: bigint;
  toSenior: bigint;
  toJunior: bigint;
  tenantRetain: bigint;
  phase: "WATERFALL" | "RESIDUAL" | "STEP_IN";
  evidenceHash: string;
  timestamp: number;
  blockNumber: number;
  txHash: string;
}

export interface IndexedMilestone {
  id: string; // `${dealId}-${milestoneIndex}`
  dealId: number;
  milestoneIndex: number;
  status: "PENDING" | "SUBMITTED" | "APPROVED" | "RELEASED";
  evidenceCid?: string;
  approver?: string;
  seniorReleased?: bigint;
  juniorReleased?: bigint;
  timestamp: number;
  txHash: string;
}

export interface IndexedCovenantEvent {
  id: string; // `${dealId}-${month}-${eventType}`
  dealId: number;
  month: number;
  eventType: "EVALUATED" | "WARNING" | "CURE_STARTED" | "BOND_DRAWN" | "STEP_IN";
  floorTarget: bigint;
  actualPaid: bigint;
  shortfall: bigint;
  reason?: string;
  timestamp: number;
  txHash: string;
}
