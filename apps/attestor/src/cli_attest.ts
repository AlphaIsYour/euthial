import type { Hex, Address } from 'viem';
import {
  createEvidenceHash,
  signSettlement,
  verifySettlementSignature,
  type SettlementData,
  type SignerDomainConfig
} from './signer.js';
import { formatIDR, toTokens } from '../../../packages/sim/src/index.js';

const DEFAULT_ATTESTOR_KEY: Hex =
  (process.env.ATTESTOR_PRIVATE_KEY as Hex) ||
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const DEFAULT_ROUTER_ADDRESS: Address =
  (process.env.ROUTER_ADDRESS as Address) ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const CHAIN_ID = Number(process.env.CHAIN_ID || 31337);

function parseCliArgs(): { dayId: number; periodDays: number; amountIDR: number; txCount: number } {
  const args = process.argv.slice(2);
  let dayId = 30;
  let periodDays = 30;
  let amountIDR = 71111100;
  let txCount = 2140;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--day' && args[i + 1]) {
      dayId = parseInt(args[i + 1], 10);
      i++;
    } else if (arg.startsWith('--day=')) {
      dayId = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--period' && args[i + 1]) {
      periodDays = parseInt(args[i + 1], 10);
      i++;
    } else if (arg === '--amount' && args[i + 1]) {
      amountIDR = parseInt(args[i + 1], 10);
      i++;
    } else if (arg.startsWith('--amount=')) {
      amountIDR = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--txs' && args[i + 1]) {
      txCount = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { dayId, periodDays, amountIDR, txCount };
}

async function main() {
  const { dayId, periodDays, amountIDR, txCount } = parseCliArgs();
  const domainConfig: SignerDomainConfig = {
    chainId: CHAIN_ID,
    verifyingContract: DEFAULT_ROUTER_ADDRESS
  };

  console.log('\n======================================================');
  console.log('       EUTHIAL EIP-712 ATTESTATION GENERATOR          ');
  console.log('======================================================');
  console.log(`Day ID:           ${dayId} (Bulan ke-${Math.ceil(dayId / 30)})`);
  console.log(`Period:           ${periodDays} days`);
  console.log(`Gross Recorded:   ${formatIDR(amountIDR)} (${amountIDR.toLocaleString('id-ID')} IDR)`);
  console.log(`QRIS Tx Count:    ${txCount.toLocaleString()} transactions`);
  console.log(`Router Address:   ${domainConfig.verifyingContract}`);
  console.log(`Chain ID:         ${domainConfig.chainId}`);
  console.log('------------------------------------------------------');

  const grossTokens = toTokens(amountIDR);
  const evidenceReport = {
    source: 'Bank Mandiri QRIS Escrow API (SNAP BI)',
    terminalId: 'QRIS-JBR-001-KEDAI-MELATI',
    dayId,
    periodDays,
    grossIDR: amountIDR,
    txCount,
    timestamp: new Date().toISOString()
  };
  const evidenceHash = createEvidenceHash(evidenceReport);

  const settlement: SettlementData = {
    dayId,
    periodDays,
    grossRecorded: grossTokens,
    txCount,
    evidenceHash
  };

  console.log('\n[1/3] Generating EIP-712 Typed Signature...');
  const signed = await signSettlement(settlement, DEFAULT_ATTESTOR_KEY, domainConfig);

  console.log(`Signer Address:   ${signed.signerAddress}`);
  console.log(`Evidence Hash:    ${evidenceHash}`);
  console.log(`ECDSA Signature:  ${signed.signature}`);

  console.log('\n[2/3] Cryptographic Verification (ecrecover simulation)...');
  const isValid = await verifySettlementSignature(
    settlement,
    signed.signature,
    signed.signerAddress,
    domainConfig
  );

  if (isValid) {
    console.log('✅ STATUS: SIGNATURE VALID & RECOVERED SUCCESSFULLY!');
  } else {
    console.error('❌ STATUS: SIGNATURE VERIFICATION FAILED!');
    process.exit(1);
  }

  console.log('\n[3/3] Solidity Calldata Payload for WaterfallRouter.settle():');
  console.log(JSON.stringify({
    settlement: {
      dayId,
      periodDays,
      grossRecorded: grossTokens.toString(),
      txCount,
      evidenceHash
    },
    signature: signed.signature
  }, null, 2));
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
