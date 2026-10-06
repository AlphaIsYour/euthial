"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProtocol } from "@/context/ProtocolContext";

export default function InvestorPortalPage() {
  const {
    currentMonth,
    activeScenario,
    seniorRepaid,
    seniorClaimCap,
    idleCashSenior,
    withdrawSeniorCash,
    hasWithdrawn,
    juniorRepaid,
    juniorClaimCap,
    covenantStatus,
    auditLogs,
  } = useProtocol();

  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Constants
  const SENIOR_PRINCIPAL = 120_000_000; // Rp 120 Juta
  const TARGET_MULTIPLE = 1.25;
  const seniorProgressPct = Math.min(100, Math.round((seniorRepaid / seniorClaimCap) * 100));
  const remainingClaim = Math.max(0, seniorClaimCap - seniorRepaid);
  const isSeniorCompleted = seniorRepaid >= seniorClaimCap;

  // Formatters
  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleWithdraw = () => {
    if (idleCashSenior <= 0) return;
    const amount = idleCashSenior;
    withdrawSeniorCash();
    setWithdrawSuccessMsg(`Berhasil menarik ${formatIDR(amount)} ke wallet investor!`);
    setTimeout(() => setWithdrawSuccessMsg(null), 4000);
  };

  // Filter audit logs relevant to payouts & senior tranche
  const investorLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("tranche") ||
        log.eventName.toLowerCase().includes("penarikan") ||
        log.eventName.toLowerCase().includes("setoran") ||
        log.eventName.toLowerCase().includes("distribusi")
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
            <span className="text-xs font-mono text-emerald-400 font-medium">Investor Senior</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Portal Investor Senior
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-normal">
              Senior Tranche (80% Capex)
            </span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Pengembalian prioritas (Seniority #1) dengan target hak klaim 1.25x (Rp 150M) atas omzet kotor FitOut Vault.
          </p>
        </div>

        {/* Status Pill Header */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono">Bulan Simulasi:</span>
            <span className="text-xs font-mono font-bold text-white">M{currentMonth}/24</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {isSeniorCompleted ? "SENIOR 100% LUNAS" : "WATERFALL AKTIF"}
            </span>
          </div>
        </div>
      </div>

      {/* Alert banner if withdraw success */}
      {withdrawSuccessMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
            <span>{withdrawSuccessMsg}</span>
          </div>
          <span className="text-[10px] text-white/40">TX HASH: 0x9c31...4e81</span>
        </div>
      )}

      {/* Row 1: Primary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Pokok & Cap */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Pokok Investasi
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
              80% Capex
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">{formatIDR(SENIOR_PRINCIPAL)}</div>
          <div className="text-[11px] text-white/40 flex items-center justify-between">
            <span>Target Cap (1.25x):</span>
            <span className="text-white/80 font-mono font-medium">{formatIDR(seniorClaimCap)}</span>
          </div>
        </div>

        {/* Card 2: Realisasi Terbayar */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Realisasi Pengembalian
            </span>
            <span className="text-[11px] font-mono text-emerald-400">{seniorProgressPct}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatIDR(seniorRepaid)}
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${seniorProgressPct}%` }}
            />
          </div>
        </div>

        {/* Card 3: Sisa Hak Klaim */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#121212] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              Sisa Hak Klaim
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              {isSeniorCompleted ? "LUNAS" : "AKTIF"}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {formatIDR(remainingClaim)}
          </div>
          <div className="text-[11px] text-white/40">
            {isSeniorCompleted
              ? "Semua hak klaim telah terpenuhi 100%"
              : "Menyerap 15% dari omzet QRIS bulanan"}
          </div>
        </div>

        {/* Card 4: Kas Vault Siap Ditarik */}
        <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">
              Kas Vault Siap Ditarik
            </span>
            <span className="text-[11px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
              On-Chain Vault
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-blue-200">
            {formatIDR(idleCashSenior)}
          </div>
          <button
            onClick={handleWithdraw}
            disabled={idleCashSenior <= 0}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium font-mono flex items-center justify-center gap-1.5 transition ${
              idleCashSenior > 0
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-98"
                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">account_balance_wallet</span>
            {idleCashSenior > 0 ? "Tarik Kas ke Wallet" : "Kas Telah Ditarik"}
          </button>
        </div>
      </div>

      {/* Row 2: First-Loss Protection & Waterfall Subordination visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Waterfall Priority & Buffer */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/10 bg-[#121212] space-y-5">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg">shield</span>
              Mekanisme Proteksi Senior & Subordinasi Tranche
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Sebagai Investor Senior, modal Anda dilindungi secara struktural oleh subordinasi modal junior pemilik ruko.
            </p>
          </div>

          <div className="space-y-4">
            {/* Visualizer Tranche Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Senior Box */}
              <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      SENIOR TRANCHE (Anda)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    PRIORITAS #1
                  </span>
                </div>
                <div className="text-sm font-mono text-white/80">
                  Pokok Rp 120M &rarr; Cap Rp 150M (1.25x)
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Semua arus kas 15% dari pendapatan kedai dialirkan terlebih dahulu 100% untuk Anda sampai target Rp 150M tercapai.
                </p>
                <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40">Status:</span>
                  <span className="text-emerald-300 font-medium">
                    {isSeniorCompleted ? "100% LUNAS" : `${seniorProgressPct}% Terbayar`}
                  </span>
                </div>
              </div>

              {/* Junior Box */}
              <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      JUNIOR TRANCHE (Landlord)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                    SUBORDINASI #2
                  </span>
                </div>
                <div className="text-sm font-mono text-white/80">
                  Pokok Rp 30M &rarr; Cap Rp 42M (1.40x)
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  <strong>First-Loss Buffer 20%:</strong> Pemilik ruko tidak menerima pembagian waterfall sepeser pun sebelum Senior Tranche selesai 100%.
                </p>
                <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/40">Terbayar:</span>
                  <span className="text-amber-300 font-medium">
                    {formatIDR(juniorRepaid)} / {formatIDR(juniorClaimCap)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Safety: Security Deposit Bond */}
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-blue-400 text-base">lock</span>
                <div>
                  <span className="text-white/90 font-medium">Security Deposit Escrow (Rp 15 Juta)</span>
                  <p className="text-[11px] text-white/40">
                    Jika omzet kedai anjlok di bawah floor, dana jaminan ini ditarik otomatis untuk menambal kekurangan dividen Senior.
                  </p>
                </div>
              </div>
              <span className="font-mono text-white/70 bg-white/5 px-2 py-1 rounded">Aktif</span>
            </div>
          </div>
        </div>

        {/* Right: Tranche Specification & Contract Details */}
        <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/60 text-lg">description</span>
            Detail Kontrak Senior
          </h2>

          <div className="space-y-2.5 text-xs font-mono divide-y divide-white/5">
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Alokasi Waterfall:</span>
              <span className="text-white/90">15% Omzet Kotor</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Batas Maksimal (Cap):</span>
              <span className="text-emerald-400">1.25x (Rp 150.000.000)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Jangka Waktu Evaluasi:</span>
              <span className="text-white/90">Maks. 24 Bulan</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Klausul Perlindungan:</span>
              <span className="text-white/90">Payment Floor + Escrow Bond</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Status Covenant Saat Ini:</span>
              <span
                className={`font-bold ${
                  covenantStatus === "HEALTHY"
                    ? "text-emerald-400"
                    : covenantStatus === "CURE"
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {covenantStatus}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-white/40">Token / Standar:</span>
              <span className="text-white/60">ERC-4626 Vault Share</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/demo"
              className="w-full py-2 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              Uji Skenario Stres di Jury Deck
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Live Payout Audit Feed */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-base">history</span>
            Log Distribusi Dana & Penarikan Terakhir
          </h2>
          <span className="text-[11px] font-mono text-white/30">Terverifikasi On-Chain</span>
        </div>

        {investorLogs.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5 text-center text-xs text-white/40 font-mono">
            Belum ada catatan transaksi distribusi untuk bulan ini.
          </div>
        ) : (
          <div className="space-y-2">
            {investorLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.type === "success"
                        ? "bg-emerald-400"
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
