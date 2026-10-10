/**
 * @euthial/indexer - Client Query Interface
 * Issue #63 [C-06]
 */

import { EuthialIndexerStore, defaultIndexerStore } from "./index";
import {
  IndexedDeal,
  IndexedSettlement,
  IndexedMilestone,
  IndexedCovenantEvent,
} from "../ponder.schema";

export class EuthialIndexerClient {
  private store: EuthialIndexerStore;

  constructor(store: EuthialIndexerStore = defaultIndexerStore) {
    this.store = store;
  }

  /**
   * Acceptance Criteria: Query settlements dalam 6 bulan terakhir
   * @param dealId Opsional filter per deal
   * @param referenceTimestamp Titik waktu acuan (default now)
   */
  public getSettlementsLast6Months(
    dealId?: number,
    referenceTimestamp: number = Math.floor(Date.now() / 1000)
  ): {
    settlements: IndexedSettlement[];
    totalGrossIdr: bigint;
    totalSeniorPaidIdr: bigint;
    totalJuniorPaidIdr: bigint;
    totalLandlordExcessIdr: bigint;
    count: number;
    timeRange: { start: number; end: number };
  } {
    const SIX_MONTHS_SECONDS = 180 * 24 * 60 * 60; // 180 days
    const startTime = referenceTimestamp - SIX_MONTHS_SECONDS;

    const matched: IndexedSettlement[] = [];
    let totalGross = 0n;
    let totalSenior = 0n;
    let totalJunior = 0n;
    let totalLandlord = 0n;

    for (const item of this.store.settlements.values()) {
      if (dealId !== undefined && item.dealId !== dealId) {
        continue;
      }
      if (item.timestamp >= startTime && item.timestamp <= referenceTimestamp) {
        matched.push(item);
        totalGross += item.grossRecorded;
        totalSenior += item.toSenior;
        totalJunior += item.toJunior;
        totalLandlord += item.landlordAmt;
      }
    }

    // Sort descending by timestamp
    matched.sort((a, b) => b.timestamp - a.timestamp);

    return {
      settlements: matched,
      totalGrossIdr: totalGross,
      totalSeniorPaidIdr: totalSenior,
      totalJuniorPaidIdr: totalJunior,
      totalLandlordExcessIdr: totalLandlord,
      count: matched.length,
      timeRange: { start: startTime, end: referenceTimestamp },
    };
  }

  /**
   * Get Deal telemetry and associated indexed artifacts
   */
  public getDealSummary(dealId: number): {
    deal?: IndexedDeal;
    settlementsCount: number;
    milestones: IndexedMilestone[];
    covenants: IndexedCovenantEvent[];
    lastSettlement?: IndexedSettlement;
  } {
    const deal = this.store.deals.get(String(dealId));
    const dealSettlements: IndexedSettlement[] = [];
    for (const s of this.store.settlements.values()) {
      if (s.dealId === dealId) dealSettlements.push(s);
    }
    dealSettlements.sort((a, b) => b.timestamp - a.timestamp);

    const dealMilestones: IndexedMilestone[] = [];
    for (const m of this.store.milestones.values()) {
      if (m.dealId === dealId) dealMilestones.push(m);
    }

    const dealCovenants: IndexedCovenantEvent[] = [];
    for (const c of this.store.covenantEvents.values()) {
      if (c.dealId === dealId) dealCovenants.push(c);
    }

    return {
      deal,
      settlementsCount: dealSettlements.length,
      milestones: dealMilestones,
      covenants: dealCovenants,
      lastSettlement: dealSettlements[0],
    };
  }

  /**
   * Check synchronization latency status (Acceptance Criteria: < 30 detik)
   */
  public getSyncStatus(): {
    lastSyncedBlock: number;
    lastSyncedAt: number;
    latencySeconds: number;
    isSyncHealthy: number; // true if latency < 30s
  } {
    const now = Math.floor(Date.now() / 1000);
    const latency = this.store.lastSyncedAt > 0 ? now - this.store.lastSyncedAt : 0;
    return {
      lastSyncedBlock: this.store.lastSyncedBlock,
      lastSyncedAt: this.store.lastSyncedAt,
      latencySeconds: latency,
      isSyncHealthy: latency <= 30 ? 1 : 0,
    };
  }
}
