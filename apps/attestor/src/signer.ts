import {
  type Address,
  type Hex,
  type TypedDataDomain,
  keccak256,
  stringToHex,
  verifyTypedData
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * EIP-712 Settlement Type Definition
 * Matching Solidity: struct Settlement in WaterfallRouter.sol
 *
 * References:
 *   - docs/05_SMART_CONTRACT_SPEC.md, Section 8.1
 */
export const SETTLEMENT_EIP712_TYPES = {
  Settlement: [
    { name: 'dayId', type: 'uint32' },
    { name: 'periodDays', type: 'uint8' },
    { name: 'grossRecorded', type: 'uint256' },
    { name: 'txCount', type: 'uint32' },
    { name: 'evidenceHash', type: 'bytes32' }
  ]
} as const;

export interface SettlementData {
  dayId: number;
  periodDays: number;
  grossRecorded: bigint;
  txCount: number;
  evidenceHash: `0x${string}`;
}

export interface SignerDomainConfig {
  chainId: number;
  verifyingContract: Address;
}

export interface SignSettlementResult {
  signature: Hex;
  settlement: SettlementData;
  domain: TypedDataDomain;
  signerAddress: Address;
}

/**
 * Builds the standard EIP-712 Typed Data Domain for WaterfallRouter.
 */
export function buildRouterDomain(config: SignerDomainConfig): TypedDataDomain {
  return {
    name: 'FitOutRouter',
    version: '1',
    chainId: BigInt(config.chainId),
    verifyingContract: config.verifyingContract
  };
}

/**
 * Helper to compute deterministic evidence hash from an arbitrary report object or string.
 */
export function createEvidenceHash(data: object | string): `0x${string}` {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return keccak256(stringToHex(serialized));
}

/**
 * Signs a Settlement struct using EIP-712 typed data signature.
 *
 * @param settlement The Settlement payload to be verified by WaterfallRouter
 * @param privateKey The private key of the authorized Attestor EOA
 * @param domainConfig Target chainId and WaterfallRouter address
 */
export async function signSettlement(
  settlement: SettlementData,
  privateKey: Hex,
  domainConfig: SignerDomainConfig
): Promise<SignSettlementResult> {
  const account = privateKeyToAccount(privateKey);
  const domain = buildRouterDomain(domainConfig);

  const signature = await account.signTypedData({
    domain,
    types: SETTLEMENT_EIP712_TYPES,
    primaryType: 'Settlement',
    message: settlement
  });

  return {
    signature,
    settlement,
    domain,
    signerAddress: account.address
  };
}

/**
 * Verifies that a given EIP-712 signature matches the expected Attestor address.
 */
export async function verifySettlementSignature(
  settlement: SettlementData,
  signature: Hex,
  expectedAddress: Address,
  domainConfig: SignerDomainConfig
): Promise<boolean> {
  const domain = buildRouterDomain(domainConfig);
  try {
    return await verifyTypedData({
      address: expectedAddress,
      domain,
      types: SETTLEMENT_EIP712_TYPES,
      primaryType: 'Settlement',
      message: settlement,
      signature
    });
  } catch {
    return false;
  }
}
