import type { Address, Hash, Hex } from "viem";

/**
 * Standard National Open API Payment (SNAP BI) QRIS Transaction
 * Conforms to Bank Indonesia SNAP Specification v1.1
 */
export interface SnapQrisTransaction {
  partnerReferenceNo: string;
  merchantId: string;
  terminalId: string;
  transactionDateTime: string;
  amount: {
    value: string; // e.g. "125000.00"
    currency: "IDR";
  };
  additionalInfo: {
    deviceId: string;
    receiptId: string;
    approvalCode: string;
  };
}

/**
 * On-chain EIP-712 Settlement struct matching WaterfallRouter.sol
 */
export interface Settlement {
  dayId: number;
  periodDays: number;
  grossRecorded: bigint;
  txCount: number;
  evidenceHash: Hex;
}

/**
 * Independent Oracle Node representation for 2-of-3 threshold multisig
 */
export interface OracleNode {
  id: string;
  name: string;
  address: Address;
  privateKey: Hex;
}

/**
 * Attestation Result with proof and multisig consensus
 */
export interface AttestationResult {
  settlement: Settlement;
  primarySignature: Hex;
  oracleSignatures: {
    oracleId: string;
    address: Address;
    signature: Hex;
  }[];
  consensusReached: boolean;
  timestamp: string;
}
