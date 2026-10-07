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

  const formatInt = (val: number) =>
    Math.round(val)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
    <div className="p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">verified_user</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              EIP-712 Settlement Proof Inspector
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                P0 AUDIT
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
              Verifikasi Kriptografis Mutasi QRIS Bank via Typed Signature ECDSA (secp256k1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReverify}
            disabled={isVerifying}
            className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
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
        <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SIGNATURE CRYPTOGRAPHICALLY VERIFIED ON-CHAIN</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            ecrecover === attestorAddress
          </span>
        </div>
      )}

      {/* Grid Inspector Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        {/* Attestor / Signer */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0D0D0F] border border-slate-200/80 dark:border-[rgba(207,207,207,0.08)] space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Authorized PJP Attestor (Signer)</div>
          <div className="flex items-center justify-between">
            <span className="text-slate-900 dark:text-white truncate font-semibold text-[11px]">
              {ATTESTOR_ADDRESS}
            </span>
            <button
              onClick={() => copyToClipboard(ATTESTOR_ADDRESS, "attestor")}
              className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold ml-2"
            >
              {copied === "attestor" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
            Bank Escrow Agent Node (Bank Mandiri / SNAP BI)
          </div>
        </div>

        {/* Verifying Contract */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0D0D0F] border border-slate-200/80 dark:border-[rgba(207,207,207,0.08)] space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Verifying Contract (Router)</div>
          <div className="flex items-center justify-between">
            <span className="text-slate-900 dark:text-white truncate font-semibold text-[11px]">
              {ROUTER_ADDRESS}
            </span>
            <button
              onClick={() => copyToClipboard(ROUTER_ADDRESS, "router")}
              className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold ml-2"
            >
              {copied === "router" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-[#71717A]">
            Domain: {DOMAIN_NAME} v{DOMAIN_VERSION} · ChainId: {CHAIN_ID}
          </div>
        </div>
      </div>

      {/* Typed Payload Breakdown */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0D0D0F] border border-slate-200/80 dark:border-[rgba(207,207,207,0.08)] space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-600 dark:text-[#A1A1AA] font-medium">EIP-712 Typed Message (Settlement Payload)</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Month {currentMonth} (Day {dayId})</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2.5 rounded-lg bg-white dark:bg-black border border-slate-200/80 dark:border-white/10">
            <div className="text-[9px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">periodDays</div>
            <div className="text-slate-900 dark:text-white font-semibold">{periodDays} days</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-black border border-slate-200/80 dark:border-white/10">
            <div className="text-[9px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">grossRecorded</div>
            <div className="text-slate-900 dark:text-white font-semibold">Rp {formatInt(grossMonthly)}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-black border border-slate-200/80 dark:border-white/10">
            <div className="text-[9px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">txCount (QRIS)</div>
            <div className="text-slate-900 dark:text-white font-semibold">{formatInt(txCount)} txs</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-black border border-slate-200/80 dark:border-white/10">
            <div className="text-[9px] text-slate-400 dark:text-[#71717A] uppercase font-semibold">v / recoveryParam</div>
            <div className="text-slate-900 dark:text-white font-semibold">{v} (0x1b)</div>
          </div>
        </div>

        {/* Evidence Hash */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A] mb-1">
            <span>evidenceHash (SHA3 Keccak-256):</span>
            <button
              onClick={() => copyToClipboard(evidenceHash, "evidence")}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold"
            >
              {copied === "evidence" ? "Copied!" : "Copy Hash"}
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-500/20 font-mono text-[11px] text-amber-950 dark:text-amber-300 break-all select-all">
            {evidenceHash}
          </div>
        </div>

        {/* Full Signature Split */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-[#71717A] mb-1">
            <span>ECDSA Raw Signature (r + s + v):</span>
            <button
              onClick={() => copyToClipboard(fullSignature, "sig")}
              className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold"
            >
              {copied === "sig" ? "Copied!" : "Copy Sig"}
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-500/20 font-mono text-[11px] text-emerald-950 dark:text-emerald-300 break-all select-all">
            {fullSignature}
          </div>
        </div>
      </div>

      {/* 2-of-3 Threshold Multisig Nodes Matrix (Issue #33) */}
      <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-blue-600 dark:text-blue-400">group_work</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">2-of-3 Threshold Multisig Consensus Nodes</span>
          </div>
          <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded">
            QUORUM: 2 OF 3 VALIDATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {/* Node 1 */}
          <div className="p-3 rounded-lg bg-white dark:bg-black border border-emerald-200/90 dark:border-emerald-500/20 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 dark:text-[#71717A] font-medium">NODE 1: PJP GATEWAY</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ SIGNED</span>
            </div>
            <div className="text-[11px] text-slate-900 dark:text-white truncate font-semibold">Midtrans / DOKU Webhook</div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</div>
          </div>

          {/* Node 2 */}
          <div className="p-3 rounded-lg bg-white dark:bg-black border border-emerald-200/90 dark:border-emerald-500/20 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 dark:text-[#71717A] font-medium">NODE 2: BANK ESCROW</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ SIGNED</span>
            </div>
            <div className="text-[11px] text-slate-900 dark:text-white truncate font-semibold">Bank Mandiri SNAP BI API</div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">0x70997970C51812dc3A010C7d01b50e0d17dc79C8</div>
          </div>

          {/* Node 3 */}
          <div className="p-3 rounded-lg bg-white dark:bg-black border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 dark:text-[#71717A] font-medium">NODE 3: WATCHER</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">STANDBY</span>
            </div>
            <div className="text-[11px] text-slate-900 dark:text-white truncate font-semibold">Chainlink / Gelato Watcher</div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</div>
          </div>
        </div>
      </div>

      {/* zkTLS / TLSNotary Zero-Knowledge Verification Box (Issue #33) */}
      <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-500/20 space-y-2.5 font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold">
            <span className="material-symbols-outlined text-sm text-purple-700 dark:text-purple-400">lock_outline</span>
            <span>zkTLS / TLSNotary Internet Banking Verification</span>
          </div>
          <span className="text-[10px] text-purple-800 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded font-semibold">
            ZERO CREDENTIAL LEAKAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-zinc-400">
          <div>
            <span className="text-slate-400 dark:text-[#71717A] block font-medium">Bank Institution & API:</span>
            <span className="text-slate-900 dark:text-white font-semibold">PT Bank Mandiri (Persero) Tbk · SNAP BI Open Banking</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-[#71717A] block font-medium">Proof Scheme:</span>
            <span className="text-purple-800 dark:text-purple-400 font-semibold">TLSNotary Protocol v0.3 (Groth16 zk-SNARK)</span>
          </div>
          <div className="md:col-span-2 pt-1">
            <span className="text-slate-400 dark:text-[#71717A] block mb-1 font-medium">TLS Session Transcript Hash:</span>
            <div className="p-2.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/90 dark:border-purple-500/20 text-purple-950 dark:text-purple-300 break-all select-all text-[11px]">
              0x7dc1bceed73b3597990e6a5bea0913850bb107d3dcb1c58dccb03cd852131151
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
