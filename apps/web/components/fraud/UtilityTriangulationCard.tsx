"use client";

import React from "react";
import { useProtocol } from "@/context/ProtocolContext";

export function UtilityTriangulationCard() {
  const { currentMonth, grossMonthly, activeScenario } = useProtocol();

  // Electricity load constants
  const dailyKwh = activeScenario === "S6" && currentMonth > 6 ? 12.4 : 48.6;
  const monthlyKwh = Math.round(dailyKwh * 30);
  const powerCostIdr = monthlyKwh * 1699; // PLN tarif bisnis B-2/TR ~ Rp 1.699/kWh

  // Expected vs actual calculations
  const expectedMonthlyMin = 65000000;
  const errRatio = grossMonthly > 0 ? (monthlyKwh / grossMonthly).toFixed(6) : "INFINITY";
  
  // Status evaluation based on active scenario
  let statusBadge = {
    label: "NORMAL CORRELATION",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "bolt",
    desc: "Konsumsi daya listrik mesin kopi & AC berkorelasi sehat dengan omzet QRIS yang tercatat.",
    anomaly: false
  };

  if (activeScenario === "S4") {
    statusBadge = {
      label: "LEAKAGE ANOMALY DETECTED",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: "warning",
      desc: "Konsumsi listrik tinggi (mesin espresso 3.200W aktif penuh), tetapi omzet QRIS turun 30%. Terindikasi kebocoran uang tunai atau QR pribadi.",
      anomaly: true
    };
  } else if (activeScenario === "S6" && currentMonth >= 6) {
    statusBadge = {
      label: "CRITICAL BREACH: AUDIT FLAGGED",
      color: "bg-red-50 text-red-800 border-red-200",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      icon: "crisis_alert",
      desc: "Peralatan ruko mengonsumsi daya listrik tetapi omzet QRIS tercatat Rp 0! Hak pencairan operasional 80% dibekukan.",
      anomaly: true
    };
  }

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const formatInt = (val: number) =>
    Math.round(val)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">electric_meter</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Triangulasi Utilitas PLN & Konsumsi Mesin (ERR)
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${statusBadge.badgeColor}`}>
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
              Deteksi kecurangan omzet kasir via korelasi sensor IoT daya listrik (PLN kWh) vs Mutasi QRIS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-[#8A8A8A]">
          <span>Sensor IoT CT-Clamp:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>

      {/* Sensor Metrics Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Pemakaian Listrik Bulanan</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {formatInt(monthlyKwh)} <span className="text-xs font-normal text-slate-500 dark:text-[#71717A]">kWh</span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-zinc-500">
            ~{dailyKwh.toFixed(1)} kWh / hari (AC + Espresso)
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Estimasi Tagihan Listrik</div>
          <div className="text-base font-bold text-amber-700 dark:text-amber-400">
            {formatIDR(powerCostIdr)}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-zinc-500">Tarif Bisnis B-2 / TR 6.600 VA</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Omzet QRIS Tercatat</div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            {formatIDR(grossMonthly)}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-zinc-500">
            Ekspektasi: ≥ {formatIDR(expectedMonthlyMin)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 dark:text-[#71717A] uppercase font-semibold">Rasio Energi-to-Revenue (ERR)</div>
          <div className={`text-base font-bold ${statusBadge.anomaly ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {errRatio}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-zinc-500">Batas Wajar: ≤ 0.000025</div>
        </div>
      </div>

      {/* Evaluation Diagnostic Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        statusBadge.anomaly
          ? activeScenario === "S6"
            ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/20"
            : "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/20"
          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20"
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-lg">{statusBadge.icon}</span>
          <div className="font-sans leading-tight">
            <span className="font-bold">{statusBadge.label}: </span>
            <span className="text-slate-700 dark:text-zinc-300">{statusBadge.desc}</span>
          </div>
        </div>

        {statusBadge.anomaly && (
          <button className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-[11px] whitespace-nowrap transition shadow-xs">
            Trigger Audit Fisik
          </button>
        )}
      </div>
    </div>
  );
}
