import {
  ORACLE_CONSENSUS_NODES,
  generateThresholdMultiSigSettlement
} from './multi_attestor.js';
import { createEvidenceHash, type SettlementData } from './signer.js';

async function main() {
  console.log('\n======================================================');
  console.log('   EUTHIAL 2-OF-3 MULTISIG ORACLE & zkTLS ATTESTOR     ');
  console.log('======================================================');

  const dayId = 30;
  const periodDays = 30;
  const grossIDR = 71_111_100;
  const grossTokens = BigInt(grossIDR) * 1_000_000n;
  const txCount = 2140;

  const evidenceReport = {
    dayId,
    periodDays,
    grossIDR,
    bankStatement: 'PT Bank Mandiri (Persero) Tbk SNAP Escrow Statement #BNK-8812',
    merchantQRISId: 'ID10200392019 Kedai Kopi Melati UNEJ',
    timestamp: Date.now()
  };
  const evidenceHash = createEvidenceHash(evidenceReport);

  const settlement: SettlementData = {
    dayId,
    periodDays,
    grossRecorded: grossTokens,
    txCount,
    evidenceHash
  };

  const domainConfig = {
    chainId: 11155111,
    verifyingContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`
  };

  console.log(`Settlement Day:    ${dayId} (Bulan ke-1)`);
  console.log(`Gross Omzet QRIS:  Rp ${grossIDR.toLocaleString('id-ID')}`);
  console.log(`Evidence Hash:     ${evidenceHash}`);
  console.log('------------------------------------------------------');
  console.log('Signing via Consensus Nodes (Threshold: 2 of 3)...');

  const result = await generateThresholdMultiSigSettlement(settlement, domainConfig);

  result.signatures.forEach((sig, idx) => {
    console.log(`\n[Node ${idx + 1}/3] ${sig.nodeName}`);
    console.log(`Role:         ${sig.nodeRole}`);
    console.log(`Signer EOA:   ${sig.signerAddress}`);
    console.log(`ECDSA Sig:    ${sig.signature.slice(0, 22)}...${sig.signature.slice(-8)}`);
    console.log(`Verified:     ${sig.verified ? '✓ VALID' : '✗ INVALID'}`);
  });

  console.log('\n------------------------------------------------------');
  console.log(`Threshold Quorum:  ${result.signatures.length} / ${result.totalNodes} Nodes (Required: ${result.requiredThreshold})`);
  console.log(`Status:            ${result.isQuorumReached ? '✅ QUORUM REACHED (2-OF-3 CONSENSUS CONFIRMED)' : '❌ QUORUM FAILED'}`);
  console.log('------------------------------------------------------');
  console.log('[zkTLS Proof Commitment]');
  console.log(`Protocol:          ${result.zkTlsProof.protocol}`);
  console.log(`Institution:       ${result.zkTlsProof.bankInstitution}`);
  console.log(`TLS Session Hash:  ${result.zkTlsProof.tlsSessionId}`);
  console.log(`zk-SNARK Proof:    ${result.zkTlsProof.zkProofHash}`);
  console.log(`Credentials Leak:  ${result.zkTlsProof.verifiedWithoutCredentialsLeak ? '0% (Zero-Knowledge Verifiable)' : 'Exposed'}`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('[Multi-Attestor Error]:', err);
  process.exit(1);
});
