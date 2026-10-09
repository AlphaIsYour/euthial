import type { Address, Hex } from "viem";
import { generateDailySnapQrisBatch, aggregateSnapBatch } from "./snap-parser.js";
import { signMultiOracleThreshold, signSettlement } from "./signer.js";
import type { OracleNode, AttestationResult, Settlement } from "./types.js";

/**
 * Default PoC Oracle Nodes for 2-of-3 consensus validation
 */
export const DEFAULT_ORACLE_NODES: OracleNode[] = [
  {
    id: "oracle-jkt-01",
    name: "Jakarta SNAP Relay Node",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  },
  {
    id: "oracle-sby-02",
    name: "Surabaya Clearing Node",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  },
  {
    id: "oracle-bdg-03",
    name: "Bandung Independent Attestor",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  },
];

export interface AttestorServiceOptions {
  routerAddress?: Address;
  chainId?: number;
  oracleNodes?: OracleNode[];
}

export class AttestorService {
  private routerAddress: Address;
  private chainId: number;
  private oracleNodes: OracleNode[];

  constructor(options: AttestorServiceOptions = {}) {
    this.routerAddress = options.routerAddress || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    this.chainId = options.chainId || 11155111;
    this.oracleNodes = options.oracleNodes || DEFAULT_ORACLE_NODES;
  }

  /**
   * Generates and signs daily QRIS settlement with 2-of-3 oracle consensus
   */
  async attestDay(
    dayId: number,
    targetDailyGrossIdr: number = 25_000_000,
    periodDays: number = 1
  ): Promise<AttestationResult> {
    // 1. Generate realistic batch of SNAP QRIS transactions
    const rawTransactions = generateDailySnapQrisBatch(dayId, targetDailyGrossIdr);

    // 2. Aggregate into Settlement struct
    const settlement: Settlement = aggregateSnapBatch(rawTransactions, dayId, periodDays);

    // 3. Multi-oracle signing & 2-of-3 threshold verification
    const result = await signMultiOracleThreshold(
      settlement,
      this.oracleNodes,
      2,
      this.routerAddress,
      this.chainId
    );

    return result;
  }
}
