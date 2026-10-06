"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProtocol } from "@/context/ProtocolContext";

export default function LandlordPortalPage() {
  const {
    currentMonth,
    landlordRent,
    juniorRepaid,
    juniorClaimCap,
    seniorRepaid,
    seniorClaimCap,
    milestones,
    approveLandlordMilestone,
    auditLogs,
  } = useProtocol();

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Constants
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

  const handleApproveMilestone = (id: number, title: string) => {
    approveLandlordMilestone(id);
    setFeedbackMsg(`Persetujuan Pemilik Ruko untuk Termin #${id} ("${title}") berhasil dikonfirmasi!`);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Filter audit logs for landlord events
  const landlordLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("sewa") ||
        log.eventName.toLowerCase().includes("landlord") ||
        log.eventName.toLowerCase().includes("milestone") ||
        log.eventName.toLowerCase().includes("junior")
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
            <span className="text-xs font-mono text-amber-400 font-medium">Pemilik Ruko (Landlord)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Portal Pemilik Ruko & Properti
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 font-normal">
              Aset: Jl. Kalimantan No. 12, Jember
            </span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Pengawasan pendapatan sewa variabel (Turnover Rent 5%), modal Junior Rp 30M (1.40x cap), dan kontrol renovasi fisik ruko.
          </p>
        </div>

        {/* Status Pill Header */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono">Simulasi:</span>
            <span className="text-xs font-mono font-bold text-white">M{currentMonth}/24</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-amber-400 font-semibold">
              KONTRAK AKTIF (24 BULAN)
            </span>
          </div>
        </div>
      </div>

      {/* Alert banner if landlord approved milestone */}
      {feedbackMsg && (
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex items-center justify-between animate-fadeIn font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-amber-400">verified</span>
            <span>{feedbackMsg}</span>
          </div>
          <span className="text-[10px] text-white/40">MULTISIG CO-SIGNER: LANDLORD</span>
        </div>
      )}

      {/* Row 1: Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Sewa Diterima (Turnover Rent 5%) */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider">
              Sewa Variabel Diterima
            </span>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
              5% Omzet
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-200">
            {formatIDR(landlordRent)}
          </div>
          <div className="text-[11px] text-white/40">
            Mengalir langsung dari setiap transaksi QRIS kasir kedai
          </div>
        </div>

        {/* Card 2: Modal Junior (Pokok & Target) */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Penyertaan Junior
            </span>
            <span className="text-[11px] font-mono text-white/70 bg-white/5 px-1.5 py-0.5 rounded">
              20% Capex
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {formatIDR(JUNIOR_PRINCIPAL)}
          </div>
          <div className="text-[11px] text-white/40 flex items-center justify-between">
            <span>Target Cap (1.40x):</span>
            <span className="text-white/80 font-mono font-medium">{formatIDR(juniorClaimCap)}</span>
          </div>
        </div>

        {/* Card 3: Realisasi Pelunasan Junior */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Realisasi Modal Junior
            </span>
            <span className="text-[11px] font-mono text-amber-400">{juniorProgressPct}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {formatIDR(juniorRepaid)}
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${juniorProgressPct}%` }}
            />
          </div>
        </div>

        {/* Card 4: Status Subordinasi Tranche */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Status Waterfall
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isSeniorCompleted
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {isSeniorCompleted ? "AKTIF" : "SUBORDINAT"}
            </span>
          </div>
          <div className="text-sm font-semibold font-mono text-white">
            {isSeniorCompleted ? "Senior Selesai (Hak Junior Berjalan)" : "Menunggu Senior Lunas"}
          </div>
          <p className="text-[11px] text-white/40">
            {isSeniorCompleted
              ? "Waterfall 15% kini mengalir 100% untuk pelunasan Junior Anda."
              : `Senior masih mengumpulkan sisa klaim (${formatIDR(
                  Math.max(0, seniorClaimCap - seniorRepaid)
                )}).`}
          </p>
        </div>
      </div>

      {/* Row 2: Property Identity & Capex Renovation Oversight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Capex Renovation Milestones Approval Panel */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/10 bg-[#121212] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">domain</span>
                Pengawasan Renovasi Fisik Ruko (Milestone Capex)
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Dana renovasi Rp 150M dikunci di escrow dan hanya cair secara bertahap jika Anda dan Inspektur menyetujui hasil fisik.
              </p>
            </div>
            <span className="text-xs font-mono text-white/40 bg-white/5 px-2.5 py-1 rounded border border-white/10">
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
                      ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
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
                      <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                        <span>Nilai: <strong className="text-white/80">{formatIDR(m.amount)}</strong></span>
                        <span>Hash Bukti: <code className="text-white/60">{m.evidenceHash}</code></span>
                      </div>
                    </div>

                    {/* Actions and multisig indicators */}
                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px] font-mono space-y-0.5">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-white/40">Inspektur:</span>
                          <span
                            className={
                              m.approvals.inspector ? "text-emerald-400" : "text-white/30"
                            }
                          >
                            {m.approvals.inspector ? "✓ Disetujui" : "Menunggu"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-white/40">Anda (Landlord):</span>
                          <span
                            className={
                              isApprovedByLandlord ? "text-emerald-400" : "text-amber-400 font-bold"
                            }
                          >
                            {isApprovedByLandlord ? "✓ Disetujui" : "Perlu Approval"}
                          </span>
                        </div>
                      </div>

                      {!isApprovedByLandlord && !isReleased ? (
                        <button
                          onClick={() => handleApproveMilestone(m.id, m.title)}
                          className="py-1.5 px-3 rounded-lg text-xs font-mono font-medium bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/10 active:scale-95 transition flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          Setujui Fisik
                        </button>
                      ) : (
                        <div className="py-1.5 px-3 rounded-lg text-xs font-mono text-white/40 bg-white/5 border border-white/5">
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
        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/60 text-lg">store</span>
            Profil Aset Properti
          </h2>

          <div className="space-y-3 text-xs font-mono divide-y divide-white/5">
            <div className="pt-1 space-y-1">
              <span className="text-white/40 block">Lokasi & Objek:</span>
              <span className="text-white font-medium block">
                Ruko 2 Lantai (Luas 140 m²)
              </span>
              <span className="text-white/60 text-[11px] block">
                Jl. Kalimantan No. 12, Sumbersari, Jember
              </span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-white/40">Penyewa Aktif:</span>
              <span className="text-white font-medium">Kedai Kopi Melati</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-white/40">Durasi Perjanjian:</span>
              <span className="text-white">24 Bulan (2 Tahun)</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-white/40">Struktur Sewa:</span>
              <span className="text-amber-400 font-medium">Turnover Rent 5% Omzet</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-white/40">Penyertaan Modal:</span>
              <span className="text-white">Rp 30.000.000 (Junior 20%)</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-white/40">Hak Proteksi Aset:</span>
              <span className="text-emerald-400 font-medium">Step-In Lease Takeover</span>
            </div>
          </div>

          {/* Collateral & Step-in Info */}
          <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs space-y-1">
            <div className="text-white/80 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-400">gavel</span>
              Hak Klausul Step-In
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Jika tenant default (Skenario S6), renovasi fit-out (meja bar, MEP, partisi) menjadi aset permanen ruko Anda, dan protokol mengizinkan Anda menyewakan kembali ruko kepada penyewa baru dengan nilai sewa lebih tinggi.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Audit Event Logs for Landlord */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-base">receipt_long</span>
            Riwayat Pembayaran Sewa & Aksi Kontrak
          </h2>
          <span className="text-[11px] font-mono text-white/30">Terverifikasi On-Chain</span>
        </div>

        {landlordLogs.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 text-center text-xs text-white/40 font-mono">
            Belum ada catatan sewa untuk bulan ini.
          </div>
        ) : (
          <div className="space-y-2">
            {landlordLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.type === "success"
                        ? "bg-amber-400"
                        : log.type === "warning"
                        ? "bg-red-400"
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
