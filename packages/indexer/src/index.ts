/**
 * @euthial/indexer - Core Indexing Engine
 * Issue #63 [C-06]
 */

import {
  IndexedDeal,
  IndexedSettlement,
  IndexedMilestone,
  IndexedCovenantEvent,
} from "../ponder.schema";

export * from "../ponder.schema";

export class EuthialIndexerStore {
  public deals: Map<string, IndexedDeal> = new Map();
  public settlements: Map<string, IndexedSettlement> = new Map();
  public milestones: Map<string, IndexedMilestone> = new Map();
  public covenantEvents: Map<string, IndexedCovenantEvent> = new Map();
  public lastSyncedBlock: number = 0;
  public lastSyncedAt: number = 0;

  // --- 1. Deal Handlers ---
  public handleDealCreated(event: {
    dealId: number;
    agreementAddress: string;
    seniorVaultAddress: string;
    juniorVaultAddress: string;
    routerAddress: string;
    landlordAddress: string;
    tenantAddress: string;
    blockNumber: number;
    timestamp: number;
  }): IndexedDeal {
    const record: IndexedDeal = {
      id: String(event.dealId),
      dealId: event.dealId,
      agreementAddress: event.agreementAddress.toLowerCase(),
      seniorVaultAddress: event.seniorVaultAddress.toLowerCase(),
      juniorVaultAddress: event.juniorVaultAddress.toLowerCase(),
      routerAddress: event.routerAddress.toLowerCase(),
      landlordAddress: event.landlordAddress.toLowerCase(),
      tenantAddress: event.tenantAddress.toLowerCase(),
      createdAtBlock: event.blockNumber,
      createdAtTimestamp: event.timestamp,
    };
    this.deals.set(record.id, record);
    this.updateSyncState(event.blockNumber, event.timestamp);
    return record;
  }

  // --- 2. Settlement Handlers ---
  public handleSettlementRecorded(event: {
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
    blockNumber: number;
    timestamp: number;
    txHash: string;
  }): IndexedSettlement {
    const id = `${event.dealId}-${event.dayId}-${event.txHash.slice(0, 10)}`;
    const record: IndexedSettlement = {
      id,
      dealId: event.dealId,
      dayId: event.dayId,
      periodDays: event.periodDays,
      grossRecorded: event.grossRecorded,
      landlordAmt: event.landlordAmt,
      toSenior: event.toSenior,
      toJunior: event.toJunior,
      tenantRetain: event.tenantRetain,
      phase: event.phase,
      evidenceHash: event.evidenceHash,
      timestamp: event.timestamp,
      blockNumber: event.blockNumber,
      txHash: event.txHash,
    };
    this.settlements.set(record.id, record);
    this.updateSyncState(event.blockNumber, event.timestamp);
    return record;
  }

  // --- 3. Milestone Handlers ---
  public handleMilestoneApproved(event: {
    dealId: number;
    milestoneIndex: number;
    approver: string;
    blockNumber: number;
    timestamp: number;
    txHash: string;
  }): IndexedMilestone {
    const id = `${event.dealId}-${event.milestoneIndex}`;
    const existing = this.milestones.get(id) || {
      id,
      dealId: event.dealId,
      milestoneIndex: event.milestoneIndex,
      status: "PENDING",
      timestamp: event.timestamp,
      txHash: event.txHash,
    };
    existing.status = "APPROVED";
    existing.approver = event.approver.toLowerCase();
    existing.timestamp = event.timestamp;
    existing.txHash = event.txHash;
    this.milestones.set(id, existing);
    this.updateSyncState(event.blockNumber, event.timestamp);
    return existing;
  }

  public handleDocumentCommitted(event: {
    dealId: number;
    milestoneIndex: number;
    cid: string;
    timestamp: number;
    txHash: string;
  }): IndexedMilestone {
    const id = `${event.dealId}-${event.milestoneIndex}`;
    const existing = this.milestones.get(id) || {
      id,
      dealId: event.dealId,
      milestoneIndex: event.milestoneIndex,
      status: "PENDING",
      timestamp: event.timestamp,
      txHash: event.txHash,
    };
    existing.status = "SUBMITTED";
    existing.evidenceCid = event.cid;
    this.milestones.set(id, existing);
    return existing;
  }

  // --- 4. Covenant Handlers ---
  public handleCovenantEvaluated(event: {
    dealId: number;
    month: number;
    floorTarget: bigint;
    actualPaid: bigint;
    shortfall: bigint;
    eventType: "EVALUATED" | "WARNING" | "CURE_STARTED" | "BOND_DRAWN" | "STEP_IN";
    reason?: string;
    blockNumber: number;
    timestamp: number;
    txHash: string;
  }): IndexedCovenantEvent {
    const id = `${event.dealId}-${event.month}-${event.eventType}`;
    const record: IndexedCovenantEvent = {
      id,
      dealId: event.dealId,
      month: event.month,
      eventType: event.eventType,
      floorTarget: event.floorTarget,
      actualPaid: event.actualPaid,
      shortfall: event.shortfall,
      reason: event.reason,
      timestamp: event.timestamp,
      txHash: event.txHash,
    };
    this.covenantEvents.set(id, record);
    this.updateSyncState(event.blockNumber, event.timestamp);
    return record;
  }

  private updateSyncState(blockNumber: number, timestamp: number) {
    if (blockNumber > this.lastSyncedBlock) {
      this.lastSyncedBlock = blockNumber;
    }
    if (timestamp > this.lastSyncedAt) {
      this.lastSyncedAt = timestamp;
    }
  }

  // Clear or reset
  public reset() {
    this.deals.clear();
    this.settlements.clear();
    this.milestones.clear();
    this.covenantEvents.clear();
    this.lastSyncedBlock = 0;
    this.lastSyncedAt = 0;
  }
}

// Global singleton instance for in-app querying
export const defaultIndexerStore = new EuthialIndexerStore();
export * from "./client";
