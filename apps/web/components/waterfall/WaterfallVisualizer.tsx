"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const WaterfallVisualizer: React.FC = () => {
  // Daily gross turnover in IDR (Default Rp 2.370.370 / day ~ Rp 71.1 jt / month)
  const [dailyGross, setDailyGross] = useState<number>(2370370);
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly");

  const effectiveGross = period === "monthly" ? dailyGross * 30 : dailyGross;

  // Split calculation based on 02_ECONOMIC_MODEL.md:
  // 80% Tenant Retained, 15% Investor Take, 5% Landlord Turnover Rent
  const tenantRetained = Math.round(effectiveGross * 0.80);
  const investorTake = Math.round(effectiveGross * 0.15);
  const landlordRent = Math.round(effectiveGross * 0.05);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-xl p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <MaterialIcon name="waterfall_chart" size={16} />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Waterfall Split Visualizer (QRIS Settlement)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-1 font-normal leading-relaxed">
            Simulasi pembagian omzet kotor otomatis antara Penyewa, Investor, dan Pemilik Ruko
          </p>
        </div>

        {/* Period Selector Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0A0A0A] p-1 rounded-lg border border-slate-200/80 dark:border-white/10 text-xs font-mono">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-3 py-1 rounded-md transition-all ${
              period === "daily"
                ? "bg-white dark:bg-[#141414] text-slate-900 dark:text-white font-semibold shadow-xs"
                : "text-slate-500 dark:text-[#8A8A8A] hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Harian
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 rounded-md transition-all ${
              period === "monthly"
                ? "bg-white dark:bg-[#141414] text-slate-900 dark:text-white font-semibold shadow-xs"
                : "text-slate-500 dark:text-[#8A8A8A] hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Bulanan (30 Hari)
          </button>
        </div>
      </div>

      {/* Gross Revenue Input / Slider */}
      <div className="p-4 bg-slate-50/80 dark:bg-[#0A0A0A] rounded-xl border border-slate-200/80 dark:border-white/10 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-slate-600 dark:text-[#A1A1AA]">
            Omzet Kotor Kasir / QRIS Settlement ({period === "monthly" ? "30 Hari" : "1 Hari"}):
          </span>
          <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
            {formatIDR(effectiveGross)}
          </span>
        </div>
        <input
          type="range"
          min={1000000}
          max={5000000}
          step={50000}
          value={dailyGross}
          onChange={(e) => setDailyGross(Number(e.target.value))}
          className="w-full accent-blue-600 dark:accent-blue-500 h-2 bg-slate-200 dark:bg-[#141414] rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-[#71717A]">
          <span>Min: Rp 1.000.000 / hari</span>
          <span>Baseline: Rp 2.370.370 / hari</span>
          <span>Max: Rp 5.000.000 / hari</span>
        </div>
      </div>

      {/* Proportional Split Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 dark:text-[#8A8A8A] font-mono">
          <span>Proporsi Alokasi Kas</span>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">Formula: 80% + 15% + 5% = 100%</span>
        </div>
        <div className="w-full h-4 rounded-lg overflow-hidden flex bg-slate-100 dark:bg-[#0A0A0A] p-0.5 gap-0.5 border border-slate-200/80 dark:border-white/10">
          <div
            style={{ width: "80%" }}
            className="h-full bg-emerald-500 rounded-l transition-all duration-300 relative group cursor-pointer"
            title="80% Retained Tenant"
          />
          <div
            style={{ width: "15%" }}
            className="h-full bg-blue-500 transition-all duration-300 relative group cursor-pointer"
            title="15% Investor Payout"
          />
          <div
            style={{ width: "5%" }}
            className="h-full bg-purple-500 rounded-r transition-all duration-300 relative group cursor-pointer"
            title="5% Landlord Turnover Rent"
          />
        </div>
      </div>

      {/* Distribution Breakdown Cards (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Tenant Retained (80%) */}
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-800 dark:text-emerald-400 font-semibold">Tenant Retained</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-bold border border-transparent dark:border-emerald-500/20">
              80%
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-emerald-950 dark:text-emerald-300 tracking-tight">
            {formatIDR(tenantRetained)}
          </div>
          <div className="text-[11px] text-emerald-700/90 dark:text-emerald-400/80 leading-relaxed font-normal">
            Kas operasional tenant (HPP, bahan baku, gaji pegawai kedai).
          </div>
        </div>

        {/* 2. Investor Take (15%) */}
        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/80 dark:border-blue-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-800 dark:text-blue-400 font-semibold">Investor Repayment</span>
            <span className="font-mono text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-500/10 px-2 py-0.5 rounded text-[11px] font-bold border border-transparent dark:border-blue-500/20">
              15%
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-blue-950 dark:text-blue-300 tracking-tight">
            {formatIDR(investorTake)}
          </div>
          <div className="text-[11px] text-blue-700/90 dark:text-blue-400/80 leading-relaxed font-normal">
            Mengalir ke <strong className="text-blue-900 dark:text-blue-200">Senior Vault</strong> hingga Rp150M tercapai, lalu ke Junior.
          </div>
        </div>

        {/* 3. Landlord Turnover Rent (5%) */}
        <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200/80 dark:border-purple-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-800 dark:text-purple-400 font-semibold">Turnover Rent</span>
            <span className="font-mono text-purple-700 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-500/10 px-2 py-0.5 rounded text-[11px] font-bold border border-transparent dark:border-purple-500/20">
              5%
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-purple-950 dark:text-purple-300 tracking-tight">
            {formatIDR(landlordRent)}
          </div>
          <div className="text-[11px] text-purple-700/90 dark:text-purple-400/80 leading-relaxed font-normal">
            Sewa variabel pemilik ruko. Mengalir terus tanpa henti tiap settlement.
          </div>
        </div>
      </div>
    </div>
  );
};
