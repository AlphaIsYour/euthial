"use client";

import React from "react";
import Link from "next/link";
import { useProtocol, ScenarioPreset } from "@/context/ProtocolContext";
import { CovenantChart } from "@/components/charts/CovenantChart";
import { WaterfallVisualizer } from "@/components/waterfall/WaterfallVisualizer";
import { CryptographicProofCard } from "@/components/contracts/CryptographicProofCard";
import { UtilityTriangulationCard } from "@/components/fraud/UtilityTriangulationCard";
import { CustomerRebateScanner } from "@/components/fraud/CustomerRebateScanner";
import { PhysicalStepInCard } from "@/components/legal/PhysicalStepInCard";

export default function DemoMissionControlPage() {
  const {
    currentMonth,
    activeScenario,
    setMonth,
    nextMonth,
    prevMonth,
    setScenario,
    isPlaying,
    toggleAutoPlay,
    resetSimulation,
    grossMonthly,
    tenantCash,
    seniorRepaid,
    seniorClaimCap,
    juniorRepaid,
    juniorClaimCap,
    landlordRent,
    idleCashSenior,
    bondBalance,
    covenantStatus,
    milestones,
    auditLogs,
  } = useProtocol();

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const scenarioDescriptions: Record<
    ScenarioPreset,
    { title: string; subtitle: string; badge: string; color: string }
  > = {
    S1: {
      title: "S1: Normal (100% Target Omzet)",
      subtitle: "Omzet rata-rata Rp 71,1 Juta/bln. Senior lunas Bulan 14, Junior lunas Bulan 18.",
      badge: "OPTIMAL",
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    },
    S4: {
      title: "S4: Kebocoran Kas 30% (Leakage)",
      subtitle:
        "Omzet kasir bocor 30%. Pembayaran jatuh di bawah Floor -> Masa Cure 7 hari -> Penarikan deposit jaminan.",
      badge: "STRESS TEST",
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    },
    S6: {
      title: "S6: Default Dini (Bulan 6)",
      subtitle:
        "Omzet anjlok drastis. Deposit bond Rp 15M terkuras habis -> Hak Step-In pengambilalihan ruko aktif.",
      badge: "CRITICAL FAILURE",
      color: "border-red-500/30 text-red-400 bg-red-500/10",
    },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
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
            <span className="text-xs font-mono text-cyan-400 font-medium">Jury Mission Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Jury & Demo Mission Control Deck
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-normal">
              Hackathon Evaluation Mode
            </span>
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Arena pengujian skenario stres ekonomi 24 bulan dan verifikasi otomasi smart contract FitOut Vault.
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
            REAKTIF (SEMUA PORTAL TERSINKRONISASI)
          </span>
        </div>
      </div>

      {/* Control Module 1: 24-Month Time Machine Control Panel */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-lg">schedule</span>
              Mesin Waktu Simulasi 24 Bulan
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              Geser bulan atau jalankan auto-play untuk mengamati aliran waterfall kasir QRIS bulan demi bulan.
            </p>
          </div>

          {/* Action buttons: Prev, Next, Auto-Play, Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              disabled={currentMonth <= 1}
              className="py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">skip_previous</span>
              Mundur
            </button>
            <button
              onClick={toggleAutoPlay}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                isPlaying
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
              {isPlaying ? "Jeda Simulasi" : "Auto-Play (24 Bln)"}
            </button>
            <button
              onClick={nextMonth}
              disabled={currentMonth >= 24}
              className="py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1"
            >
              Maju
              <span className="material-symbols-outlined text-[15px]">skip_next</span>
            </button>
            <button
              onClick={resetSimulation}
              className="py-1.5 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-white/50 text-xs font-mono transition"
              title="Reset Simulasi ke Bulan 1"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Month Pills Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-white/40">
            <span>Bulan 1 (Mulai Operasional)</span>
            <span className="text-cyan-300 font-bold text-sm">
              Bulan Aktif: Bulan {currentMonth} dari 24
            </span>
            <span>Bulan 24 (Akhir Tenor)</span>
          </div>

          <div className="grid grid-cols-12 sm:grid-cols-24 gap-1">
            {Array.from({ length: 24 }, (_, i) => i + 1).map((m) => {
              const isCurrent = m === currentMonth;
              const isPast = m < currentMonth;

              return (
                <button
                  key={m}
                  onClick={() => setMonth(m)}
                  className={`py-1.5 text-[10px] font-mono rounded transition text-center ${
                    isCurrent
                      ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30 scale-105 z-10"
                      : isPast
                      ? "bg-white/15 text-white/70 hover:bg-white/20"
                      : "bg-white/5 text-white/30 hover:bg-white/10"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control Module 2: Scenario Presets */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">tune</span>
            Uji Stres Skenario Ekonomi
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Pilih skenario makro untuk menguji respon protokol saat omzet stabil vs anjlok.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["S1", "S4", "S6"] as ScenarioPreset[]).map((scKey) => {
            const sc = scenarioDescriptions[scKey];
            const isSelected = activeScenario === scKey;

            return (
              <div
                key={scKey}
                onClick={() => setScenario(scKey)}
                className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-2 ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{sc.title}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${sc.color}`}>
                    {sc.badge}
                  </span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">{sc.subtitle}</p>
                <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <span className="material-symbols-outlined text-[12px]">
                    {isSelected ? "radio_button_checked" : "radio_button_unchecked"}
                  </span>
                  <span>{isSelected ? "Skenario Aktif" : "Terapkan Skenario"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cross-Role Impact Summary Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-base">hub</span>
            Dampak Lintas Portal (Snapshot Bulan {currentMonth})
          </h2>
          <span className="text-xs font-mono text-white/40">Klik kartu untuk inspeksi portal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tenant Snapshot */}
          <Link
            href="/tenant"
            className="p-4 rounded-xl border border-white/10 bg-[#121212] hover:border-emerald-500/40 transition group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold">Portal Penyewa</span>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-white transition">
                &rarr;
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{formatIDR(tenantCash)}</div>
            <div className="text-[11px] text-white/40 space-y-0.5">
              <div>Kas Bersih (80%)</div>
              <div className="text-white/60">
                Deposit Bond: <strong className="text-emerald-400">{formatIDR(bondBalance)}</strong>
              </div>
              <div className="text-white/60">
                Covenant:{" "}
                <span
                  className={
                    covenantStatus === "HEALTHY"
                      ? "text-emerald-400"
                      : covenantStatus === "CURE"
                      ? "text-amber-400"
                      : "text-red-400"
                  }
                >
                  {covenantStatus}
                </span>
              </div>
            </div>
          </Link>

          {/* Investor Senior Snapshot */}
          <Link
            href="/investor"
            className="p-4 rounded-xl border border-white/10 bg-[#121212] hover:border-blue-500/40 transition group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-bold">Investor Senior</span>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-white transition">
                &rarr;
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{formatIDR(seniorRepaid)}</div>
            <div className="text-[11px] text-white/40 space-y-0.5">
              <div>Realisasi Hak Klaim</div>
              <div className="text-white/60">Target: {formatIDR(seniorClaimCap)} (1.25x)</div>
              <div className="text-white/60">
                Kas Vault: <strong className="text-blue-300">{formatIDR(idleCashSenior)}</strong>
              </div>
            </div>
          </Link>

          {/* Landlord Snapshot */}
          <Link
            href="/landlord"
            className="p-4 rounded-xl border border-white/10 bg-[#121212] hover:border-amber-500/40 transition group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-bold">Pemilik Ruko</span>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-white transition">
                &rarr;
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-white">{formatIDR(landlordRent)}</div>
            <div className="text-[11px] text-white/40 space-y-0.5">
              <div>Akumulasi Sewa (5%)</div>
              <div className="text-white/60">
                Junior Repaid: <strong className="text-amber-300">{formatIDR(juniorRepaid)}</strong>
              </div>
              <div className="text-white/60">Target Junior: {formatIDR(juniorClaimCap)}</div>
            </div>
          </Link>

          {/* Inspector Snapshot */}
          <Link
            href="/inspector"
            className="p-4 rounded-xl border border-white/10 bg-[#121212] hover:border-purple-500/40 transition group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold">Inspektur & Capex</span>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-white transition">
                &rarr;
              </span>
            </div>
            <div className="text-lg font-bold font-mono text-white">
              {milestones.filter((m) => m.status === "RELEASED").length} / 3 Termin
            </div>
            <div className="text-[11px] text-white/40 space-y-0.5">
              <div>Renovasi Fisik Cair</div>
              <div className="text-white/60">Total Capex: Rp 150.000.000</div>
              <div className="text-white/60">Aturan: Multisig 2-of-3</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterfallVisualizer />
        <CovenantChart />
      </div>

      {/* Cryptographic EIP-712 Proof Inspector (Issue #29) */}
      <CryptographicProofCard />

      {/* Anti-Fraud Defense Matrix (Issue #34) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UtilityTriangulationCard />
        <CustomerRebateScanner />
      </div>

      {/* Physical Step-In & Legal IoT Gateway (Issue #32) */}
      <PhysicalStepInCard />

      {/* Real-Time Audit Log Feed */}
      <div className="p-5 rounded-xl border border-white/10 bg-[#121212] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-base">receipt_long</span>
            Log Audit On-Chain Real-Time
          </h2>
          <span className="text-[11px] font-mono text-white/30">
            Total Event: {auditLogs.length}
          </span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
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
                      : log.type === "danger"
                      ? "bg-red-400"
                      : "bg-cyan-400"
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
      </div>
    </div>
  );
}
