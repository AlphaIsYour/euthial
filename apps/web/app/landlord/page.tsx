"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { PhysicalStepInCard } from "../../components/legal/PhysicalStepInCard";
import { WaterfallVisualizer } from "../../components/waterfall/WaterfallVisualizer";
import { ActionCenter } from "../../components/ui/ActionCenter";

export default function LandlordPortalPage() {
  const {
    currentMonth,
    landlordRent,
    juniorReservePool,
    juniorRepaid,
    juniorClaimCap,
    seniorRepaid,
    seniorClaimCap,
    milestones,
    auditLogs,
  } = useProtocol();

  const web3 = useWeb3();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [approvingMilestoneId, setApprovingMilestoneId] = useState<number | null>(null);

  // Constants based on 02_ECONOMIC_MODEL.md
  const JUNIOR_PRINCIPAL = 30_000_000; // Rp 30 Juta (20% Capex)
  const isSeniorCompleted = seniorRepaid >= seniorClaimCap;
  const juniorProgressPct = Math.min(100, Math.round((juniorRepaid / juniorClaimCap) * 100));
  const remainingJunior = Math.max(0, juniorClaimCap - juniorRepaid);

  // Formatters
  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleApproveMilestone = async (id: number, title: string) => {
    setApprovingMilestoneId(id);
    try {
      await web3.approveMilestone(id);
      setFeedbackMsg(`Persetujuan Pemilik Ruko untuk Termin #${id} ("${title}") berhasil dikonfirmasi!`);
      setTimeout(() => setFeedbackMsg(null), 5000);
    } finally {
      setApprovingMilestoneId(null);
    }
  };

  // Filter audit logs for landlord events
  const landlordLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("sewa") ||
        log.eventName.toLowerCase().includes("landlord") ||
        log.eventName.toLowerCase().includes("milestone") ||
        log.eventName.toLowerCase().includes("junior") ||
        log.eventName.toLowerCase().includes("step_in") ||
        log.eventName.toLowerCase().includes("distribusi")
    )
    .slice(0, 6);

  return (
    <Shell>
      <div className="space-y-6">
        {/* Action Center - Urgent & Pending Alerts (#88) */}
        <ActionCenter />

        {/* 1. Context Banner (Consistent with /tenant & /investor) */}
        <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-black border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
              <MaterialIcon name="real_estate_agent" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal Pemilik Ruko & Properti: Jl. Kalimantan No. 12
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  PEMILIK ASET (LANDLORD · JUNIOR 20%)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                Ruko 2 Lantai (140 m²) · Turnover Rent 5% Omzet + Kontrol Milestone Capex · Bulan {currentMonth}/24
              </p>
            </div>
          </div>

          {/* Status Capsule & New Deal Button (#47) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <Link
              href="/landlord/new-deal"
              className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <MaterialIcon name="add_circle" size={16} />
              <span>Buat Deal Baru</span>
            </Link>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A0A] px-3.5 py-2 rounded-md border border-slate-200/80 dark:border-white/10">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Status:</span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                <span>AKTIF (24 BULAN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message Toast */}
        {feedbackMsg && (
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between animate-fadeIn font-mono">
            <div className="flex items-center gap-2">
              <MaterialIcon name="verified" size={16} className="text-amber-600 dark:text-amber-400" />
              <span className="font-medium">{feedbackMsg}</span>
            </div>
            <span className="text-[10px] text-amber-700/70 dark:text-white/40">
              MULTISIG CO-SIGNER: LANDLORD
            </span>
          </div>
        )}

        {/* 2. 4 Primary Operational Metric Cards (Consistent with /tenant) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Sewa Variabel Diterima (Turnover Rent 5%) */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">SEWA VARIABEL (5%)</span>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                Turnover Rent
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 mt-1">
              {formatIDR(landlordRent)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Buffer Likuiditas: {formatIDR(juniorReservePool)}
            </span>
          </div>

          {/* Card 2: Modal Junior (Pokok 20%) */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">MODAL JUNIOR (20%)</span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                Subordinasi
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(JUNIOR_PRINCIPAL)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Target Cap (1.40x): {formatIDR(juniorClaimCap)}
            </span>
          </div>

          {/* Card 3: Realisasi Modal Junior */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">REALISASI MODAL JUNIOR</span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {juniorProgressPct}%
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
              {formatIDR(juniorRepaid)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#0A0A0A] rounded-full h-1.5 mt-1.5 overflow-hidden border border-transparent dark:border-white/10">
              <div
                className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${juniorProgressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono block mt-1">
              Sisa Target: {formatIDR(remainingJunior)}
            </span>
          </div>

          {/* Card 4: Status Waterfall Subordinasi */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">STATUS WATERFALL</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  isSeniorCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10"
                }`}
              >
                {isSeniorCompleted ? "AKTIF" : "SUBORDINAT"}
              </span>
            </div>
            <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-1.5 truncate">
              {isSeniorCompleted ? "Hak Junior Berjalan 100%" : "Menunggu Senior Lunas"}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono block mt-0.5">
              {isSeniorCompleted
                ? "15% omzet QRIS mengalir ke Junior"
                : `Sisa klaim Senior: ${formatIDR(Math.max(0, seniorClaimCap - seniorRepaid))}`}
            </span>
          </div>
        </div>

        {/* 3. Capex Renovation Oversight & Property Profile (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left (col-span-2): Capex Renovation Milestones Approval Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
              <div>
                <div className="flex items-center gap-2">
                  <MaterialIcon name="domain" size={18} className="text-amber-600 dark:text-amber-400" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Pengawasan Renovasi Fisik Ruko (Milestone Capex)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                  Dana renovasi Rp 150 Juta dikunci di escrow dan hanya cair secara bertahap atas persetujuan Anda dan Inspektur.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded border border-slate-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
                Multisig: 2-of-3
              </span>
            </div>

            {/* List of 3 Milestones */}
            <div className="space-y-3">
              {milestones.map((m) => {
                const isApprovedByLandlord = m.approvals.landlord;
                const isReleased = m.status === "RELEASED";

                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition ${
                      isReleased
                        ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.02]"
                        : "border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
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
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-white/40">
                          <span>Nilai: <strong className="text-slate-900 dark:text-white/80">{formatIDR(m.amount)}</strong></span>
                          <span>Hash Bukti: <code className="text-slate-600 dark:text-white/60">{m.evidenceHash}</code></span>
                        </div>
                      </div>

                      {/* Actions & Co-sign Indicators */}
                      <div className="flex items-center gap-3">
                        <div className="text-right text-[11px] font-mono space-y-0.5">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-slate-400 dark:text-white/40">Inspektur:</span>
                            <span
                              className={
                                m.approvals.inspector
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-400 dark:text-white/30"
                              }
                            >
                              {m.approvals.inspector ? "✓ Disetujui" : "Menunggu"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="text-slate-400 dark:text-white/40">Anda (Landlord):</span>
                            <span
                              className={
                                isApprovedByLandlord
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400 font-bold"
                              }
                            >
                              {isApprovedByLandlord ? "✓ Disetujui" : "Perlu Approval"}
                            </span>
                          </div>
                        </div>

                        {!isApprovedByLandlord && !isReleased ? (
                          <button
                            onClick={() => handleApproveMilestone(m.id, m.title)}
                            disabled={approvingMilestoneId === m.id}
                            className="py-1.5 px-3 rounded-lg text-xs font-mono font-medium bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10 active:scale-95 transition flex items-center gap-1.5 shrink-0"
                          >
                            <MaterialIcon name="check_circle" size={15} />
                            <span>{approvingMilestoneId === m.id ? "Menyetujui..." : "Setujui Fisik"}</span>
                          </button>
                        ) : (
                          <div className="py-1.5 px-3 rounded-lg text-xs font-mono text-slate-500 dark:text-white/40 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 shrink-0">
                            ✓ Terkonfirmasi
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Property & Contract Profile */}
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
              <MaterialIcon name="store" size={18} className="text-slate-500 dark:text-white/60" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Profil Aset Properti
              </h2>
            </div>

            <div className="space-y-2.5 text-xs font-mono divide-y divide-slate-100 dark:divide-[rgba(207,207,207,0.06)]">
              <div className="pt-0.5 space-y-0.5">
                <span className="text-slate-500 dark:text-[#8A8A8A] block text-[11px]">Lokasi & Objek:</span>
                <span className="text-slate-900 dark:text-white font-medium block">
                  Ruko 2 Lantai (Luas 140 m²)
                </span>
                <span className="text-slate-500 dark:text-[#71717A] text-[11px] block">
                  Kawasan Komersial Sentra, Unit #01
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-[#8A8A8A]">Penyewa Aktif:</span>
                <span className="text-slate-900 dark:text-white font-medium">Kedai Kopi Melati</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-[#8A8A8A]">Durasi Kontrak:</span>
                <span className="text-slate-900 dark:text-white">24 Bulan (2 Tahun)</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-[#8A8A8A]">Struktur Sewa:</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">Turnover Rent 5% Omzet</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-[#8A8A8A]">Penyertaan Modal:</span>
                <span className="text-slate-900 dark:text-white">Rp 30.000.000 (Junior 20%)</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500 dark:text-[#8A8A8A]">Hak Proteksi Aset:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Step-In Lease Takeover</span>
              </div>
            </div>

            {/* Collateral & Step-in Info */}
            <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-xs space-y-1">
              <div className="text-slate-900 dark:text-white/80 font-medium flex items-center gap-1.5">
                <MaterialIcon name="gavel" size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Hak Klausul Step-In</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8A8A8A] leading-relaxed">
                Jika tenant default (Skenario S6), renovasi fit-out (meja bar, MEP, partisi) menjadi aset permanen ruko Anda, dan protokol mengizinkan Anda menyewakan kembali ruko kepada konsorsium pengganti dengan nilai sewa lebih tinggi.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Physical Step-In & Legal IoT Gateway Protocol */}
        <PhysicalStepInCard />

        {/* 5. Waterfall Split Visualizer */}
        <WaterfallVisualizer />

        {/* 6. Live Rental & Contract Event Audit Feed */}
        <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
            <div className="flex items-center gap-2">
              <MaterialIcon name="receipt_long" size={18} className="text-slate-400 dark:text-[#8A8A8A]" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Riwayat Pembayaran Sewa & Aksi Kontrak On-Chain
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">
              Verifikasi Mutasi Bank & Rekening Escrow
            </span>
          </div>

          {landlordLogs.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/5 text-center text-xs text-slate-400 dark:text-white/40 font-mono">
              Belum ada catatan transaksi sewa untuk bulan ini.
            </div>
          ) : (
            <div className="space-y-2">
              {landlordLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        log.type === "success"
                          ? "bg-amber-500"
                          : log.type === "warning"
                          ? "bg-rose-500"
                          : "bg-purple-500"
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
