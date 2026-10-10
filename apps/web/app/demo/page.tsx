"use client";

import React from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol, ScenarioPreset } from "../../context/ProtocolContext";
import { CovenantChart } from "../../components/charts/CovenantChart";
import { WaterfallVisualizer } from "../../components/waterfall/WaterfallVisualizer";
import { CryptographicProofCard } from "../../components/contracts/CryptographicProofCard";
import { UtilityTriangulationCard } from "../../components/fraud/UtilityTriangulationCard";
import { CustomerRebateScanner } from "../../components/fraud/CustomerRebateScanner";
import { PhysicalStepInCard } from "../../components/legal/PhysicalStepInCard";
import { ActionCenter } from "../../components/ui/ActionCenter";
import { InteractiveTour } from "../../components/tour/InteractiveTour";
import { DEMO_DASHBOARD_TOUR_STEPS } from "../../components/tour/tour-steps";

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
    tenantCash,
    seniorRepaid,
    seniorClaimCap,
    landlordRent,
    idleCashSenior,
    bondBalance,
    rollingBondReserve,
    juniorReservePool,
    juniorClaimCap,
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
      title: "Kondisi Normal (100% Target Kasir)",
      subtitle: "Omzet rata-rata Rp 71,1 Juta/bln. Senior lunas Bulan 14, Junior lunas Bulan 18.",
      badge: "OPTIMAL",
      color: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
    },
    S4: {
      title: "Volatilitas Kasir (Aktivasi Masa Cure)",
      subtitle:
        "Omzet kasir turun 30%. Pembayaran jatuh di bawah Floor -> Masa Cure 7 hari -> Penarikan deposit jaminan.",
      badge: "VOLATILE",
      color: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
    },
    S6: {
      title: "Stres Likuiditas (Aktivasi Jaminan)",
      subtitle:
        "Omzet anjlok drastis. Deposit bond Rp 15M dieksekusi -> Hak Step-In pengambilalihan ruko aktif.",
      badge: "STRESS TEST",
      color: "border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
    },
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Action Center - Urgent & Pending Alerts (#88) */}
        <ActionCenter />

        {/* 1. Context Banner */}
        <div
          id="tour-demo-welcome"
          className="p-4 sm:p-5 rounded-xl bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <MaterialIcon name="analytics" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Konsol Operasional & Waterfall Protocol
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                  ON-CHAIN RUNTIME
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                Ruko Komersial Sentra #01 · Pembukuan Kasir QRIS & Siklus Waterfall Tenor 24 Bulan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("start-interactive-tour", {
                      detail: { tourKey: "demo_dashboard_tour" },
                    })
                  );
                }
              }}
              className="h-8 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 font-medium text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <MaterialIcon name="help_outline" size={15} className="text-slate-500 dark:text-zinc-400" />
              <span>Panduan Membaca Dashboard</span>
            </button>

            {/* Status Capsule */}
            <div className="h-8 flex items-center gap-2 bg-slate-50 dark:bg-zinc-900/60 px-3 rounded-lg border border-slate-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Status:</span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-800 dark:text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Aktif (Bulan {currentMonth}/24)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Control Module 1: 24-Month Time Machine Control Panel */}
        <div
          id="tour-time-machine"
          className="p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <MaterialIcon name="schedule" size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Siklus Arus Kas 24 Bulan
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                  Pantau aliran kasir QRIS dan realisasi pengembalian modal bulan demi bulan.
                </p>
              </div>
            </div>

            {/* Action buttons: Prev, Next, Auto-Play, Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                disabled={currentMonth <= 1}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-xs"
              >
                <MaterialIcon name="skip_previous" size={15} />
                Mundur
              </button>
              <button
                onClick={toggleAutoPlay}
                className={`h-8 px-3.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition shadow-xs ${
                  isPlaying
                    ? "bg-slate-800 text-white font-bold"
                    : "bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black font-semibold"
                }`}
              >
                <MaterialIcon name={isPlaying ? "pause" : "play_arrow"} size={15} />
                {isPlaying ? "Jeda Tenor" : "Auto-Play (24 Bln)"}
              </button>
              <button
                onClick={nextMonth}
                disabled={currentMonth >= 24}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-mono disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-xs"
              >
                Maju
                <MaterialIcon name="skip_next" size={15} />
              </button>
              <button
                onClick={resetSimulation}
                className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs font-mono transition shadow-xs"
                title="Kembali ke Bulan 1"
              >
                <MaterialIcon name="restart_alt" size={15} />
              </button>
            </div>
          </div>

          {/* Month Pills Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#8A8A8A]">
              <span>Bulan 1 (Mulai Operasional)</span>
              <span className="text-slate-900 dark:text-white font-bold text-sm">
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
                        ? "bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-xs z-10"
                        : isPast
                        ? "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-200 dark:hover:bg-zinc-700"
                        : "bg-slate-50 dark:bg-zinc-900/60 text-slate-400 dark:text-zinc-600 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Control Module 2: Scenario Presets */}
        <div
          id="tour-scenarios"
          className="p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <MaterialIcon name="tune" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Kondisi Arus Kas & Stres Pasar
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                Pilih kondisi pasar untuk mengamati respon proteksi protokol saat omzet stabil vs anjlok.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["S1", "S4", "S6"] as ScenarioPreset[]).map((scKey) => {
              const sc = scenarioDescriptions[scKey];
              const isSelected = activeScenario === scKey;

              return (
                <div
                  key={scKey}
                  onClick={() => setScenario(scKey)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? "border-slate-900 dark:border-white bg-slate-50/80 dark:bg-zinc-900/80 ring-1 ring-slate-900 dark:ring-white shadow-xs"
                      : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{sc.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#8A8A8A] leading-relaxed font-normal">{sc.subtitle}</p>
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono">
                    <MaterialIcon
                      name={isSelected ? "radio_button_checked" : "radio_button_unchecked"}
                      size={14}
                      className={isSelected ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-zinc-500"}
                    />
                    <span className={isSelected ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-zinc-400"}>
                      {isSelected ? "Kondisi Aktif" : "Terapkan Kondisi"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Cross-Role Impact Summary Cards */}
        <div id="tour-role-cards" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MaterialIcon name="hub" size={18} className="text-slate-500 dark:text-[#8A8A8A]" />
              Dampak Arus Kas Lintas Peran (Posisi Bulan {currentMonth})
            </h2>
            <span className="text-xs font-mono text-slate-400 dark:text-[#8A8A8A]">Klik kartu untuk inspeksi portal</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tenant Snapshot */}
            <Link
              href="/tenant"
              className="p-5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs hover:border-slate-400 dark:hover:border-zinc-700 transition group space-y-2.5 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-900 dark:text-white font-bold">Portal Penyewa</span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition">
                  &rarr;
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{formatIDR(tenantCash)}</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] space-y-1">
                <div>Kas Bersih (80%)</div>
                <div className="text-slate-600 dark:text-slate-300">
                  Total Bond: <strong className="text-slate-900 dark:text-white">{formatIDR(bondBalance + rollingBondReserve)}</strong>
                </div>
                <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <span>Covenant:</span>
                  <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-semibold">
                    {covenantStatus}
                  </span>
                </div>
              </div>
            </Link>

            {/* Investor Senior Snapshot */}
            <Link
              href="/investor"
              className="p-5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs hover:border-slate-400 dark:hover:border-zinc-700 transition group space-y-2.5 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-900 dark:text-white font-bold">Investor Senior</span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition">
                  &rarr;
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{formatIDR(seniorRepaid)}</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] space-y-1">
                <div>Realisasi Hak Klaim</div>
                <div className="text-slate-600 dark:text-slate-300">Target: {formatIDR(seniorClaimCap)} (1.25x)</div>
                <div className="text-slate-600 dark:text-slate-300">
                  Kas Vault: <strong className="text-slate-900 dark:text-white">{formatIDR(idleCashSenior)}</strong>
                </div>
              </div>
            </Link>

            {/* Landlord Snapshot */}
            <Link
              href="/landlord"
              className="p-5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs hover:border-slate-400 dark:hover:border-zinc-700 transition group space-y-2.5 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-900 dark:text-white font-bold">Pemilik Ruko</span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition">
                  &rarr;
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">{formatIDR(landlordRent)}</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] space-y-1">
                <div>Akumulasi Sewa (5%)</div>
                <div className="text-slate-600 dark:text-slate-300">
                  Buffer Likuiditas: <strong className="text-slate-900 dark:text-white">{formatIDR(juniorReservePool)}</strong>
                </div>
                <div className="text-slate-600 dark:text-slate-300">Target Junior: {formatIDR(juniorClaimCap)}</div>
              </div>
            </Link>

            {/* Inspector Snapshot */}
            <Link
              href="/inspector"
              className="p-5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs hover:border-slate-400 dark:hover:border-zinc-700 transition group space-y-2.5 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-900 dark:text-white font-bold">Inspektur & Capex</span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition">
                  &rarr;
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {milestones.filter((m) => m.status === "RELEASED").length} / 3 Termin
              </div>
              <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] space-y-1">
                <div>Renovasi Fisik Cair</div>
                <div className="text-slate-600 dark:text-slate-300">Total Capex: Rp 150.000.000</div>
                <div className="text-slate-600 dark:text-slate-300">Aturan: Multisig 2-of-3</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 5. Visualizers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="tour-waterfall">
            <WaterfallVisualizer />
          </div>
          <div id="tour-covenant">
            <CovenantChart />
          </div>
        </div>

        {/* 6. Cryptographic EIP-712 Proof Inspector */}
        <div id="tour-crypto-proof">
          <CryptographicProofCard />
        </div>

        {/* 7. Anti-Fraud Defense Matrix */}
        <div id="tour-fraud-scanner" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UtilityTriangulationCard />
          <CustomerRebateScanner />
        </div>

        {/* 8. Physical Step-In & Legal IoT Gateway */}
        <div id="tour-step-in">
          <PhysicalStepInCard />
        </div>

        {/* 9. Real-Time Audit Log Feed */}
        <div className="p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MaterialIcon name="receipt_long" size={18} className="text-slate-500 dark:text-[#8A8A8A]" />
              Log Audit On-Chain Real-Time
            </h2>
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">
              Total Event: {auditLogs.length}
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-[#0A0A0A] hover:bg-slate-100/70 dark:hover:bg-[#141414] transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.type === "success"
                        ? "bg-emerald-500"
                        : log.type === "warning"
                        ? "bg-amber-500"
                        : log.type === "danger"
                        ? "bg-red-500"
                        : "bg-cyan-500"
                    }`}
                  />
                  <div>
                    <div className="font-mono text-slate-900 dark:text-white font-semibold">{log.eventName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A] mt-0.5">{log.details}</div>
                  </div>
                </div>
                <div className="text-right font-mono shrink-0 ml-3">
                  <div className="text-slate-700 dark:text-slate-300 font-medium">Bulan {log.month}</div>
                  <div className="text-[10px] text-slate-400 dark:text-[#666]">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Joyride Interactive Product Tour for Dashboard Mission Control */}
      <InteractiveTour
        steps={DEMO_DASHBOARD_TOUR_STEPS}
        tourKey="demo_dashboard_tour"
      />
    </Shell>
  );
}
