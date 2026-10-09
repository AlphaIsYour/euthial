import { keccak256, stringToHex, type Hex } from "viem";
import type { SnapQrisTransaction, Settlement } from "./types.js";

/**
 * Generates a realistic daily batch of SNAP BI QRIS transactions
 * for a commercial tenant (e.g. coffee shop, clinic, or boutique in ruko).
 */
export function generateDailySnapQrisBatch(
  dayId: number,
  targetDailyGrossIdr: number = 25_000_000,
  minTx: number = 30,
  maxTx: number = 80
): SnapQrisTransaction[] {
  const transactions: SnapQrisTransaction[] = [];
  const txCount = Math.floor(minTx + Math.random() * (maxTx - minTx + 1));

  let accumulated = 0;
  const merchantId = "ID2026EUTHIAL01";
  const terminalId = "TRM-RUKO-04B";
  const baseDate = new Date(Date.now() - (365 - dayId) * 86400 * 1000);

  for (let i = 0; i < txCount; i++) {
    const isLast = i === txCount - 1;
    let itemAmount: number;

    if (isLast) {
      itemAmount = Math.max(10_000, targetDailyGrossIdr - accumulated);
    } else {
      // Average transaction between Rp 25.000 and Rp 450.000
      const variance = (Math.random() - 0.5) * 0.4; // +/- 20%
      const avg = targetDailyGrossIdr / txCount;
      itemAmount = Math.round(avg * (1 + variance));
      accumulated += itemAmount;
    }

    const txTime = new Date(baseDate.getTime() + (i * (86400 / txCount) * 1000)).toISOString();

    transactions.push({
      partnerReferenceNo: `QRIS-${dayId}-${String(i + 1).padStart(4, "0")}`,
      merchantId,
      terminalId,
      transactionDateTime: txTime,
      amount: {
        value: itemAmount.toFixed(2),
        currency: "IDR",
      },
      additionalInfo: {
        deviceId: "POS-VERIFONE-X1",
        receiptId: `RCP-${dayId}-${i + 1}`,
        approvalCode: Math.floor(100000 + Math.random() * 900000).toString(),
      },
    });
  }

  return transactions;
}

/**
 * Aggregates a batch of SNAP QRIS transactions into an on-chain Settlement struct.
 * Converts IDR amount to 6 decimals (EuthialIDR token decimals standard).
 */
export function aggregateSnapBatch(
  transactions: SnapQrisTransaction[],
  dayId: number,
  periodDays: number = 1
): Settlement {
  let totalGrossIdr = 0;

  for (const tx of transactions) {
    totalGrossIdr += parseFloat(tx.amount.value);
  }

  // Convert to BigInt in 6 decimals (1 IDR = 1_000_000 wei-IDR)
  const grossRecorded = BigInt(Math.round(totalGrossIdr)) * 1_000_000n;

  // Cryptographic evidence hash: keccak256 hash of deterministic JSON serialization
  const serialized = JSON.stringify(transactions);
  const evidenceHash: Hex = keccak256(stringToHex(serialized));

  return {
    dayId,
    periodDays,
    grossRecorded,
    txCount: transactions.length,
    evidenceHash,
  };
}
