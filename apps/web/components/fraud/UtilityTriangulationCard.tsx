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
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    icon: "bolt",
    desc: "Konsumsi daya listrik mesin kopi & AC berkorelasi sehat dengan omzet QRIS yang tercatat.",
    anomaly: false
  };

  if (activeScenario === "S4") {
    statusBadge = {
      label: "LEAKAGE ANOMALY DETECTED",
      color: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      icon: "warning",
      desc: "Konsumsi listrik tinggi (mesin espresso 3.200W aktif penuh), tetapi omzet QRIS turun 30%. Terindikasi kebocoran uang tunai atau QR pribadi.",
      anomaly: true
    };
  } else if (activeScenario === "S6" && currentMonth >= 6) {
    statusBadge = {
      label: "CRITICAL BREACH: AUDIT FLAGGED",
      color: "bg-red-500/10 text-red-300 border-red-500/30",
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

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="material-symbols-outlined text-xl">electric_meter</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Triangulasi Utilitas PLN & Konsumsi Mesin (ERR)
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Deteksi kecurangan omzet kasir via korelasi sensor IoT daya listrik (PLN kWh) vs Mutasi QRIS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-white/40">
          <span>Sensor IoT CT-Clamp:</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>

      {/* Sensor Metrics Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Pemakaian Listrik Bulanan</div>
          <div className="text-base font-bold text-white">
            {monthlyKwh.toLocaleString()} <span className="text-xs font-normal text-white/50">kWh</span>
          </div>
          <div className="text-[10px] text-white/40">
            ~{dailyKwh.toFixed(1)} kWh / hari (AC + Espresso)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Estimasi Tagihan Listrik</div>
          <div className="text-base font-bold text-amber-400">
            {formatIDR(powerCostIdr)}
          </div>
          <div className="text-[10px] text-white/40">Tarif Bisnis B-2 / TR 6.600 VA</div>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Omzet QRIS Tercatat</div>
          <div className="text-base font-bold text-white">
            {formatIDR(grossMonthly)}
          </div>
          <div className="text-[10px] text-white/40">
            Ekspektasi: ≥ {formatIDR(expectedMonthlyMin)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-white/40 uppercase">Rasio Energi-to-Revenue (ERR)</div>
          <div className={`text-base font-bold ${statusBadge.anomaly ? "text-red-400" : "text-emerald-400"}`}>
            {errRatio}
          </div>
          <div className="text-[10px] text-white/40">Batas Wajar: ≤ 0.000025</div>
        </div>
      </div>

      {/* Evaluation Diagnostic Banner */}
      <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${statusBadge.color}`}>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-lg">{statusBadge.icon}</span>
          <div className="font-sans leading-tight">
            <span className="font-bold">{statusBadge.label}: </span>
            <span>{statusBadge.desc}</span>
          </div>
        </div>

        {statusBadge.anomaly && (
          <button className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-mono font-bold text-[11px] whitespace-nowrap transition">
            Trigger Audit Fisik
          </button>
        )}
      </div>
    </div>
  );
}
