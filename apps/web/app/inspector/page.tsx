"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProtocol } from "@/context/ProtocolContext";
import { useWeb3 } from "@/context/Web3Context";

export default function InspectorPortalPage() {
  const {
    currentMonth,
    milestones,
    signInspectorMilestone,
    auditLogs,
  } = useProtocol();

  const web3 = useWeb3();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number>(3);
  const [evidenceHashInput, setEvidenceHashInput] = useState<string>("0xa21df7e59bc438901b44");
  const [signStatusMsg, setSignStatusMsg] = useState<string | null>(null);

  // Formatters
  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const totalCapex = milestones.reduce((acc, m) => acc, 150_000_000);
  const releasedCapex = milestones
    .filter((m) => m.status === "RELEASED")
    .reduce((acc, m) => acc + m.amount, 0);
  const progressPct = Math.round((releasedCapex / totalCapex) * 100);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = evidenceHashInput.trim() || "0x" + Math.random().toString(16).substring(2, 10);
    await web3.approveMilestone(selectedMilestoneId);
    signInspectorMilestone(selectedMilestoneId, hash);
    setSignStatusMsg(
      `Berhasil menandatangani Termin #${selectedMilestoneId} dengan bukti hash ${hash.slice(0, 10)}...!`
    );
    setTimeout(() => setSignStatusMsg(null), 4500);
  };

  const inspectorLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("milestone") ||
        log.eventName.toLowerCase().includes("inspektur") ||
        log.eventName.toLowerCase().includes("escrow") ||
        log.eventName.toLowerCase().includes("renovasi")
    )
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white transition flex items-center gap-1 font-mono"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Portal Hub
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <span className="text-xs font-mono text-purple-400 font-medium">Inspektur & Kontraktor</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Portal Inspektur Fisik & Verifikasi Capex
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 font-normal">
              2-of-3 Multisig Escrow
            </span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Verifikasi fisik renovasi ruko, pencatatan bukti on-chain (SHA-256), dan otorisasi pencairan dana escrow termin kontraktor.
          </p>
        </div>

        {/* Status Pill Header */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono">Bulan:</span>
            <span className="text-xs font-mono font-bold text-white">M{currentMonth}/24</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-mono text-purple-300 font-semibold">
              KONSENSUS MULTISIG
            </span>
          </div>
        </div>
      </div>

      {/* Alert banner if sign milestone success */}
      {signStatusMsg && (
        <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-200 text-xs flex items-center justify-between animate-fadeIn font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-purple-400">check_circle</span>
            <span>{signStatusMsg}</span>
          </div>
          <span className="text-[10px] text-white/40">
            {web3.lastTxHash ? `TX HASH: ${web3.lastTxHash.slice(0, 10)}...` : "ESCROW UNLOCKED (2/3 SIGNATURES)"}
          </span>
        </div>
      )}

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Escrow Capex */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Total Escrow Capex
            </span>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
              3 Termin
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{formatIDR(totalCapex)}</div>
          <div className="text-[11px] text-white/40">Terkunci di Smart Contract Escrow</div>
        </div>

        {/* Card 2: Dana Cair */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Dana Telah Dicairkan
            </span>
            <span className="text-[11px] font-mono text-emerald-400">{progressPct}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatIDR(releasedCapex)}
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Dana Tertahan di Escrow */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Escrow Tertahan
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              {totalCapex - releasedCapex === 0 ? "SELESAI" : "LOCKED"}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {formatIDR(totalCapex - releasedCapex)}
          </div>
          <div className="text-[11px] text-white/40">
            Hanya rilis jika bukti fisik diverifikasi
          </div>
        </div>

        {/* Card 4: Syarat Konsensus */}
        <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
              Aturan Otorisasi
            </span>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
              2 of 3
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-purple-200">
            2 dari 3 Tanda Tangan
          </div>
          <div className="text-[11px] text-white/50">
            Inspektur + (Landlord atau Tenant) wajib setuju
          </div>
        </div>
      </div>

      {/* Row 2: 3 Physical Capex Milestones & Signing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed 3 Capex Milestones List */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/10 bg-[#121212] space-y-5">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-lg">fact_check</span>
              Status Verifikasi 3 Termin Renovasi Fisik
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Rincian pekerjaan sipil, alokasi anggaran, dan status tanda tangan masing-masing pihak.
            </p>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => {
              const isReleased = m.status === "RELEASED";
              const isSelected = selectedMilestoneId === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => !isReleased && setSelectedMilestoneId(m.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/30"
                      : isReleased
                      ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-80"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-purple-400">
                          Termin #{m.id}
                        </span>
                        <span className="text-sm font-medium text-white">{m.title}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isReleased
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/40">
                        <span>Alokasi: <strong className="text-white/80">{formatIDR(m.amount)}</strong></span>
                        <span>Evidence Hash: <code className="text-purple-300">{m.evidenceHash}</code></span>
                      </div>
                    </div>

                    {/* Multisig Signatures status */}
                    <div className="flex items-center gap-2 text-[11px] font-mono bg-white/5 p-2 rounded-lg border border-white/5">
                      <div className="flex flex-col items-center px-2 border-r border-white/5">
                        <span className="text-white/40 text-[9px]">INSPEKTUR</span>
                        <span className={m.approvals.inspector ? "text-emerald-400 font-bold" : "text-white/30"}>
                          {m.approvals.inspector ? "✓ SIGN" : "PENDING"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center px-2 border-r border-white/5">
                        <span className="text-white/40 text-[9px]">LANDLORD</span>
                        <span className={m.approvals.landlord ? "text-emerald-400 font-bold" : "text-white/30"}>
                          {m.approvals.landlord ? "✓ SIGN" : "PENDING"}
                        </span>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <span className="text-white/40 text-[9px]">TENANT</span>
                        <span className={m.approvals.tenant ? "text-emerald-400 font-bold" : "text-white/30"}>
                          {m.approvals.tenant ? "✓ SIGN" : "PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection Form & Cryptographic Evidence Submission */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400 text-lg">drive_file_rename_outline</span>
            Otorisasi Rilis Termin
          </h2>

          <form onSubmit={handleSign} className="space-y-3.5">
            <div>
              <label className="text-xs font-mono text-white/60 block mb-1">
                Pilih Termin yang Diverifikasi:
              </label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(Number(e.target.value))}
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                {milestones.map((m) => (
                  <option key={m.id} value={m.id} disabled={m.status === "RELEASED"}>
                    Termin #{m.id} - {m.title.slice(0, 30)}... ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-white/60 block mb-1">
                Hash SHA-256 Bukti Foto Lapangan:
              </label>
              <input
                type="text"
                value={evidenceHashInput}
                onChange={(e) => setEvidenceHashInput(e.target.value)}
                placeholder="0x..."
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-white/40 mt-1 block">
                Hash dihitung dari foto progres fisik yang diunggah ke IPFS / storage terdesentralisasi.
              </span>
            </div>

            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs font-mono space-y-1 text-white/60">
              <div className="flex justify-between">
                <span>Identitas Verifikator:</span>
                <span className="text-white">Inspektur PT Euthial</span>
              </div>
              <div className="flex justify-between">
                <span>Public Key:</span>
                <span className="text-purple-300">
                  {web3.address
                    ? `${web3.address.slice(0, 6)}...${web3.address.slice(-4)}`
                    : "0x742d...44e1"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold shadow-lg shadow-purple-600/20 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">draw</span>
              Tanda Tangani & Rilis Termin #{selectedMilestoneId}
            </button>
          </form>
        </div>
      </div>

      {/* Row 3: Audit Event Logs for Inspector */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-base">history_edu</span>
            Riwayat Verifikasi Lapangan & Tanda Tangan Escrow
          </h2>
          <span className="text-[11px] font-mono text-white/30">Terverifikasi On-Chain</span>
        </div>

        {inspectorLogs.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 text-center text-xs text-white/40 font-mono">
            Belum ada catatan verifikasi inspeksi untuk bulan ini.
          </div>
        ) : (
          <div className="space-y-2">
            {inspectorLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.type === "success"
                        ? "bg-purple-400"
                        : log.type === "warning"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div>
                    <div className="font-mono text-white/90 font-medium">{log.eventName}</div>
                    <div className="text-[11px] text-white/40">{log.details}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-white/60">Bulan {log.month}</div>
                  <div className="text-[10px] text-white/30">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
