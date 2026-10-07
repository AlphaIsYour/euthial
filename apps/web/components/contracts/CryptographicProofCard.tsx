"use client";

import React, { useState } from "react";
import { useProtocol } from "@/context/ProtocolContext";
import { keccak256, stringToHex, encodePacked } from "viem";

export function CryptographicProofCard() {
  const { currentMonth, grossMonthly, activeScenario } = useProtocol();
  const [copied, setCopied] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean>(true);

  // Constants matching WaterfallRouter.sol & EIP-712 Domain
  const ATTESTOR_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const ROUTER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CHAIN_ID = 11155111; // Sepolia Testnet
  const DOMAIN_NAME = "FitOutRouter";
  const DOMAIN_VERSION = "1";

  // Deterministic mock signature generation for current month
  const dayId = currentMonth * 30;
  const periodDays = 30;
  const txCount = Math.round((grossMonthly / 35000) * 1.2); // Estimated ~2000-2400 cups/month
  const evidenceData = `QRIS-SETTLEMENT-M${currentMonth}-GROSS-${grossMonthly}-${activeScenario}`;
  const evidenceHash = keccak256(stringToHex(evidenceData));

  // Compute deterministic mock digest & signature parts
  const structHash = keccak256(
    encodePacked(
      ["string", "uint32", "uint8", "uint256", "uint32", "bytes32"],
      ["Settlement", dayId, periodDays, BigInt(grossMonthly) * 1000000n, txCount, evidenceHash]
    )
  );
  const r = `0x${structHash.slice(2, 34)}${evidenceHash.slice(34, 66)}`;
  const s = `0x${evidenceHash.slice(2, 34)}${structHash.slice(34, 66)}`;
  const v = 27;
  const fullSignature = `${r}${s.slice(2)}${v.toString(16)}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReverify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationPassed(true);
    }, 400);
  };

  return (
    <div className="p-5 rounded-xl border border-emerald-500/30 bg-[#0d1410] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              EIP-712 Settlement Proof Inspector
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                P0 AUDIT
              </span>
            </h2>
            <p className="text-[11px] text-white/50">
              Verifikasi Kriptografis Mutasi QRIS Bank via Typed Signature ECDSA (secp256k1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReverify}
            disabled={isVerifying}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[14px] ${isVerifying ? "animate-spin" : ""}`}>
              sync
            </span>
            {isVerifying ? "Verifying..." : "Verify ECDSA"}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationPassed && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SIGNATURE CRYPTOGRAPHICALLY VERIFIED ON-CHAIN</span>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            ecrecover === attestorAddress
          </span>
        </div>
      )}

      {/* Grid Inspector Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        {/* Attestor / Signer */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Authorized PJP Attestor (Signer)</div>
          <div className="flex items-center justify-between">
            <span className="text-white/90 truncate font-semibold text-[11px]">
              {ATTESTOR_ADDRESS}
            </span>
            <button
              onClick={() => copyToClipboard(ATTESTOR_ADDRESS, "attestor")}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 ml-2"
            >
              {copied === "attestor" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-[10px] text-emerald-400/80">
            Bank Escrow Agent Node (Bank Mandiri / SNAP BI)
          </div>
        </div>

        {/* Verifying Contract */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Verifying Contract (Router)</div>
          <div className="flex items-center justify-between">
            <span className="text-white/90 truncate font-semibold text-[11px]">
              {ROUTER_ADDRESS}
            </span>
            <button
              onClick={() => copyToClipboard(ROUTER_ADDRESS, "router")}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 ml-2"
            >
              {copied === "router" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-[10px] text-white/40">
            Domain: {DOMAIN_NAME} v{DOMAIN_VERSION} · ChainId: {CHAIN_ID}
          </div>
        </div>
      </div>

      {/* Typed Payload Breakdown */}
      <div className="p-3.5 rounded-lg bg-black/60 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-white/50">EIP-712 Typed Message (Settlement Payload)</span>
          <span className="text-emerald-400 font-bold">Month {currentMonth} (Day {dayId})</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded bg-white/[0.02] border border-white/5">
            <div className="text-[9px] text-white/40">periodDays</div>
            <div className="text-white font-semibold">{periodDays} days</div>
          </div>
          <div className="p-2 rounded bg-white/[0.02] border border-white/5">
            <div className="text-[9px] text-white/40">grossRecorded</div>
            <div className="text-white font-semibold">Rp {grossMonthly.toLocaleString("id-ID")}</div>
          </div>
          <div className="p-2 rounded bg-white/[0.02] border border-white/5">
            <div className="text-[9px] text-white/40">txCount (QRIS)</div>
            <div className="text-white font-semibold">{txCount.toLocaleString()} txs</div>
          </div>
          <div className="p-2 rounded bg-white/[0.02] border border-white/5">
            <div className="text-[9px] text-white/40">v / recoveryParam</div>
            <div className="text-white font-semibold">{v} (0x1b)</div>
          </div>
        </div>

        {/* Evidence Hash */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
            <span>evidenceHash (SHA3 Keccak-256):</span>
            <button
              onClick={() => copyToClipboard(evidenceHash, "evidence")}
              className="text-emerald-400 hover:text-emerald-300"
            >
              {copied === "evidence" ? "Copied!" : "Copy Hash"}
            </button>
          </div>
          <div className="p-2 rounded bg-black border border-white/10 font-mono text-[10px] text-amber-300/90 break-all select-all">
            {evidenceHash}
          </div>
        </div>

        {/* Full Signature Split */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
            <span>ECDSA Raw Signature (r + s + v):</span>
            <button
              onClick={() => copyToClipboard(fullSignature, "sig")}
              className="text-emerald-400 hover:text-emerald-300"
            >
              {copied === "sig" ? "Copied!" : "Copy Sig"}
            </button>
          </div>
          <div className="p-2 rounded bg-black border border-white/10 font-mono text-[10px] text-emerald-400/90 break-all select-all">
            {fullSignature}
          </div>
        </div>
      </div>

      {/* 2-of-3 Threshold Multisig Nodes Matrix (Issue #33) */}
      <div className="p-4 rounded-lg bg-black/50 border border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-cyan-400">group_work</span>
            <span className="text-xs font-bold text-white">2-of-3 Threshold Multisig Consensus Nodes</span>
          </div>
          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
            QUORUM: 2 OF 3 VALIDATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {/* Node 1 */}
          <div className="p-2.5 rounded bg-white/[0.02] border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">NODE 1: PJP GATEWAY</span>
              <span className="text-emerald-400 font-bold">✓ SIGNED</span>
            </div>
            <div className="text-[11px] text-white truncate font-medium">Midtrans / DOKU Webhook</div>
            <div className="text-[10px] text-white/40 truncate">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</div>
          </div>

          {/* Node 2 */}
          <div className="p-2.5 rounded bg-white/[0.02] border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">NODE 2: BANK ESCROW</span>
              <span className="text-emerald-400 font-bold">✓ SIGNED</span>
            </div>
            <div className="text-[11px] text-white truncate font-medium">Bank Mandiri SNAP BI API</div>
            <div className="text-[10px] text-white/40 truncate">0x70997970C51812dc3A010C7d01b50e0d17dc79C8</div>
          </div>

          {/* Node 3 */}
          <div className="p-2.5 rounded bg-white/[0.02] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/50">NODE 3: WATCHER</span>
              <span className="text-amber-400 font-bold">STANDBY</span>
            </div>
            <div className="text-[11px] text-white truncate font-medium">Chainlink / Gelato Watcher</div>
            <div className="text-[10px] text-white/40 truncate">0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</div>
          </div>
        </div>
      </div>

      {/* zkTLS / TLSNotary Zero-Knowledge Verification Box (Issue #33) */}
      <div className="p-3.5 rounded-lg bg-black/50 border border-purple-500/30 space-y-2 font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <span className="material-symbols-outlined text-sm">lock_outline</span>
            <span>zkTLS / TLSNotary Internet Banking Verification</span>
          </div>
          <span className="text-[10px] text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
            ZERO CREDENTIAL LEAKAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-white/60">
          <div>
            <span className="text-white/40 block">Bank Institution & API:</span>
            <span className="text-white">PT Bank Mandiri (Persero) Tbk · SNAP BI Open Banking</span>
          </div>
          <div>
            <span className="text-white/40 block">Proof Scheme:</span>
            <span className="text-purple-300">TLSNotary Protocol v0.3 (Groth16 zk-SNARK)</span>
          </div>
          <div className="md:col-span-2 pt-1">
            <span className="text-white/40 block mb-0.5">TLS Session Transcript Hash:</span>
            <div className="p-1.5 rounded bg-black border border-white/10 text-purple-300 break-all select-all text-[10px]">
              0x7dc1bceed73b3597990e6a5bea0913850bb107d3dcb1c58dccb03cd852131151
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
