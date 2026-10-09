import {
  type Address,
  type Hex,
  recoverTypedDataAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { Settlement, OracleNode, AttestationResult } from "./types.js";

/**
 * Standard EIP-712 Domain and Type Definitions matching WaterfallRouter.sol
 */
export function getEip712Config(routerAddress: Address, chainId: number = 11155111) {
  const domain = {
    name: "FitOutRouter",
    version: "1",
    chainId,
    verifyingContract: routerAddress,
  } as const;

  const types = {
    Settlement: [
      { name: "dayId", type: "uint32" },
      { name: "periodDays", type: "uint8" },
      { name: "grossRecorded", type: "uint256" },
      { name: "txCount", type: "uint32" },
      { name: "evidenceHash", type: "bytes32" },
    ],
  } as const;

  return { domain, types };
}

/**
 * Signs a Settlement struct with EIP-712 typed data
 */
export async function signSettlement(
  settlement: Settlement,
  privateKey: Hex,
  routerAddress: Address,
  chainId: number = 11155111
): Promise<{ signature: Hex; signerAddress: Address }> {
  const account = privateKeyToAccount(privateKey);
  const { domain, types } = getEip712Config(routerAddress, chainId);

  const signature = await account.signTypedData({
    domain,
    types,
    primaryType: "Settlement",
    message: {
      dayId: settlement.dayId,
      periodDays: settlement.periodDays,
      grossRecorded: settlement.grossRecorded,
      txCount: settlement.txCount,
      evidenceHash: settlement.evidenceHash,
    },
  });

  return {
    signature,
    signerAddress: account.address,
  };
}

/**
 * Verifies that a signature was signed by the expected address for the given settlement
 */
export async function verifySettlementSignature(
  settlement: Settlement,
  signature: Hex,
  expectedSigner: Address,
  routerAddress: Address,
  chainId: number = 11155111
): Promise<boolean> {
  const { domain, types } = getEip712Config(routerAddress, chainId);

  const recovered = await recoverTypedDataAddress({
    domain,
    types,
    primaryType: "Settlement",
    message: {
      dayId: settlement.dayId,
      periodDays: settlement.periodDays,
      grossRecorded: settlement.grossRecorded,
      txCount: settlement.txCount,
      evidenceHash: settlement.evidenceHash,
    },
    signature,
  });

  return recovered.toLowerCase() === expectedSigner.toLowerCase();
}

/**
 * 2-of-3 Multisig Threshold Oracle Consensus Signer
 */
export async function signMultiOracleThreshold(
  settlement: Settlement,
  oracleNodes: OracleNode[],
  threshold: number = 2,
  routerAddress: Address,
  chainId: number = 11155111
): Promise<AttestationResult> {
  const oracleSignatures: { oracleId: string; address: Address; signature: Hex }[] = [];

  for (const node of oracleNodes) {
    const { signature } = await signSettlement(settlement, node.privateKey, routerAddress, chainId);
    const isValid = await verifySettlementSignature(settlement, signature, node.address, routerAddress, chainId);

    if (isValid) {
      oracleSignatures.push({
        oracleId: node.id,
        address: node.address,
        signature,
      });
    }
  }

  const consensusReached = oracleSignatures.length >= threshold;
  const primarySignature = oracleSignatures[0]?.signature || "0x";

  return {
    settlement,
    primarySignature,
    oracleSignatures,
    consensusReached,
    timestamp: new Date().toISOString(),
  };
}
