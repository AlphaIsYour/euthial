"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { CryptographicProofCard } from "../../components/contracts/CryptographicProofCard";
import { ActionCenter } from "../../components/ui/ActionCenter";

export default function InspectorPortalPage() {
  const {
    currentMonth,
    milestones,
    signInspectorMilestone,
    auditLogs,
  } = useProtocol();

  const web3 = useWeb3();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number>(3);
  const [evidenceHashInput, setEvidenceHashInput] = useState<string>("0xa21df7e59bc438901b44917bce82e718b5");
  const [isSigning, setIsSigning] = useState<boolean>(false);
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
    if (isSigning) return;
    setIsSigning(true);
    const hash = evidenceHashInput.trim() || "0x" + Math.random().toString(16).substring(2, 10);
    try {
      await web3.approveMilestone(selectedMilestoneId);
      signInspectorMilestone(selectedMilestoneId, hash);
      setSignStatusMsg(
        `Berhasil memvalidasi Termin #${selectedMilestoneId} dengan bukti hash ${hash.slice(0, 10)}...!`
      );
      setTimeout(() => setSignStatusMsg(null), 5000);
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrefillProof = (hash: string) => {
    setEvidenceHashInput(hash);
  };

  const inspectorLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("milestone") ||
        log.eventName.toLowerCase().includes("inspektur") ||
        log.eventName.toLowerCase().includes("escrow") ||
        log.eventName.toLowerCase().includes("renovasi") ||
        log.eventName.toLowerCase().includes("verifikasi")
    )
    .slice(0, 6);

  const inspectionChecklist = [
    {
      title: "Uji Tekanan Saluran Air & Drainase Bar",
      spec: "Pipa PPR PN-10, uji tekan hidrolik 3 Bar selama 24 jam tanpa kebocoran.",
      status: "TERVERIFIKASI",
      icon: "plumbing",
    },
    {
      title: "Beban Daya Listrik & Sertifikat SLO PLN",
      spec: "Kapasitas 16.500 VA 3-Phase, MCB Schneider, grounding resistansi < 2 Ohm.",
      status: "TERVERIFIKASI",
      icon: "bolt",
    },
    {
      title: "Presisi Meja Bar Beton & Keramik Mezzanine",
      spec: "Ketinggian barista 90cm ergonomis, leveling lantai waterpass deviasi < 2mm.",
      status: "TERVERIFIKASI",
      icon: "square_foot",
    },
    {
      title: "Exhaust Hood & Sirkulasi Udara Roasting",
      spec: "Ducting galvanized spiral, blower centrifugal 2.400 CFM, peredam getaran.",
      status: "TERVERIFIKASI",
      icon: "air",
    },
  ];

  return (
    <Shell>
      <div className="space-y-6">
        {/* Action Center - Urgent & Pending Alerts (#88) */}
        <ActionCenter />

        {/* 1. Context Banner (Consistent with /tenant, /investor, /landlord) */}
        <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-black border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <MaterialIcon name="engineering" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal Inspektur Fisik & Verifikasi Capex
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  INSPEKTUR TEKNIS (2-OF-3 MULTISIG)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                Ruko Jl. Kalimantan No. 12, Jember · Otorisasi Pencairan Escrow Capex Rp 150 Juta · Bulan {currentMonth}/24
              </p>
            </div>
          </div>

          {/* Status Capsule */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A0A] px-3.5 py-2 rounded-md border border-slate-200/80 dark:border-white/10 shrink-0 self-start md:self-center">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Status Konsensus:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
              <span>MULTISIG AKTIF (2/3)</span>
            </div>
          </div>
        </div>

        {/* Alert Feedback Toast */}
        {signStatusMsg && (
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between animate-fadeIn font-mono">
            <div className="flex items-center gap-2">
              <MaterialIcon name="verified" size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-medium">{signStatusMsg}</span>
            </div>
            <span className="text-[10px] text-indigo-700/70 dark:text-white/40">
              {web3.lastTxHash ? `TX: ${web3.lastTxHash.slice(0, 10)}...` : "ESCROW UNLOCKED (MULTISIG OK)"}
            </span>
          </div>
        )}

        {/* 2. 4 Primary Operational Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Total Escrow Capex */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">TOTAL ESCROW CAPEX</span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                3 Termin
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(totalCapex)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Terkunci di Smart Contract Escrow
            </span>
          </div>

          {/* Card 2: Dana Telah Dicairkan */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">DANA TELAH DICAIRKAN</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {progressPct}%
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatIDR(releasedCapex)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#0A0A0A] rounded-full h-1.5 mt-1.5 overflow-hidden border border-transparent dark:border-white/10">
              <div
                className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono block mt-1">
              Telah disetor ke kontraktor ruko
            </span>
          </div>

          {/* Card 3: Escrow Tertahan */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">ESCROW TERTAHAN</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  totalCapex - releasedCapex === 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {totalCapex - releasedCapex === 0 ? "SELESAI" : "LOCKED"}
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-300 mt-1">
              {formatIDR(totalCapex - releasedCapex)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Hanya rilis jika bukti fisik diverifikasi
            </span>
          </div>

          {/* Card 4: Syarat Konsensus Otorisasi */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">ATURAN OTORISASI</span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                2 of 3
              </span>
            </div>
            <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-1.5">
              2 dari 3 Tanda Tangan
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono block mt-0.5">
              Inspektur + (Landlord atau Tenant) wajib setuju
            </span>
          </div>
        </div>

        {/* 3. 3 Physical Capex Milestones & Signing Form (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Detailed 3 Capex Milestones List */}
          <div className="lg:col-span-2 bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="fact_check" size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Status Verifikasi 3 Termin Renovasi Fisik
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                  Klik termin untuk mengisi form otorisasi. Setiap termin membutuhkan tanda tangan digital Inspektur.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
                Total 3 Termin
              </span>
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
                        ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-1 ring-indigo-500/30"
                        : isReleased
                        ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/[0.02] opacity-80"
                        : "border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            Termin #{m.id}
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{m.title}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              isReleased
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-white/40">
                          <span>Alokasi: <strong className="text-slate-900 dark:text-white/80">{formatIDR(m.amount)}</strong></span>
                          <span>Evidence Hash: <code className="text-indigo-600 dark:text-indigo-300">{m.evidenceHash}</code></span>
                        </div>
                      </div>

                      {/* Multisig Signatures status */}
                      <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-100 dark:bg-white/5 p-2 rounded-lg border border-slate-200/80 dark:border-white/5 shrink-0">
                        <div className="flex flex-col items-center px-2 border-r border-slate-200 dark:border-white/5">
                          <span className="text-slate-500 dark:text-white/40 text-[9px]">INSPEKTUR</span>
                          <span className={m.approvals.inspector ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-white/30"}>
                            {m.approvals.inspector ? "✓ SIGN" : "PENDING"}
                          </span>
                        </div>
                        <div className="flex flex-col items-center px-2 border-r border-slate-200 dark:border-white/5">
                          <span className="text-slate-500 dark:text-white/40 text-[9px]">LANDLORD</span>
                          <span className={m.approvals.landlord ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-white/30"}>
                            {m.approvals.landlord ? "✓ SIGN" : "PENDING"}
                          </span>
                        </div>
                        <div className="flex flex-col items-center px-2">
                          <span className="text-slate-500 dark:text-white/40 text-[9px]">TENANT</span>
                          <span className={m.approvals.tenant ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-white/30"}>
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
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
              <MaterialIcon name="draw" size={18} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Otorisasi Rilis Termin (Sign Desk)
              </h2>
            </div>

            <form onSubmit={handleSign} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA] block mb-1">
                  Pilih Termin yang Diverifikasi:
                </label>
                <select
                  value={selectedMilestoneId}
                  onChange={(e) => setSelectedMilestoneId(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#1E1E22] border border-slate-300 dark:border-[rgba(207,207,207,0.12)] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id} disabled={m.status === "RELEASED"}>
                      Termin #{m.id} - {m.title.slice(0, 28)}... ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
                    Hash SHA-256 Bukti Fisik:
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePrefillProof("0xa21df7e59bc438901b44917bce82e718b5")}
                    className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Gunakan Hash IPFS
                  </button>
                </div>
                <input
                  type="text"
                  value={evidenceHashInput}
                  onChange={(e) => setEvidenceHashInput(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-slate-50 dark:bg-[#1E1E22] border border-slate-300 dark:border-[rgba(207,207,207,0.12)] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 dark:text-[#71717A] mt-1 block">
                  Dihitung otomatis dari metadata foto GPS progres fisik lapangan.
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-xs font-mono space-y-1 text-slate-600 dark:text-white/60">
                <div className="flex justify-between">
                  <span>Identitas Verifikator:</span>
                  <span className="text-slate-900 dark:text-white font-medium">Inspektur PT Euthial</span>
                </div>
                <div className="flex justify-between">
                  <span>Public Key:</span>
                  <span className="text-indigo-600 dark:text-indigo-300">
                    {web3.address
                      ? `${web3.address.slice(0, 6)}...${web3.address.slice(-4)}`
                      : "0x742d...44e1 (Mocked)"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigning}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MaterialIcon name="approval" size={16} />
                <span>
                  {isSigning
                    ? "Menandatangani On-Chain..."
                    : `Tanda Tangani & Rilis Termin #${selectedMilestoneId}`}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* 4. Physical Quality & Technical Assurance Checklist */}
        <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
            <MaterialIcon name="verified_user" size={18} className="text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Checklist Audit Kualitas Fisik & Standardisasi Fit-Out
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                Standar inspeksi sipil dan MEP wajib lolos 100% sebelum escrow termin kontraktor dapat dirilis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {inspectionChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MaterialIcon name={item.icon} size={15} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">{item.title}</span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#8A8A8A] leading-relaxed">
                    {item.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Cryptographic Proof Card (EIP-712 & On-Chain Audit) */}
        <CryptographicProofCard />

        {/* 6. On-Chain Inspection Event Audit Feed */}
        <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
            <div className="flex items-center gap-2">
              <MaterialIcon name="history_edu" size={18} className="text-slate-400 dark:text-[#8A8A8A]" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Riwayat Verifikasi Lapangan & Tanda Tangan Escrow
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">
              Terverifikasi On-Chain (Smart Contract FitOutEscrow)
            </span>
          </div>

          {inspectorLogs.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/5 text-center text-xs text-slate-400 dark:text-white/40 font-mono">
              Belum ada catatan verifikasi inspeksi untuk bulan ini.
            </div>
          ) : (
            <div className="space-y-2">
              {inspectorLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        log.type === "success"
                          ? "bg-indigo-500"
                          : log.type === "warning"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <div className="font-mono text-slate-900 dark:text-white font-medium">{log.eventName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">{log.details}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono shrink-0 ml-4">
                    <div className="text-slate-700 dark:text-white/70 font-semibold">Bulan {log.month}</div>
                    <div className="text-[10px] text-slate-400 dark:text-[#71717A]">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
