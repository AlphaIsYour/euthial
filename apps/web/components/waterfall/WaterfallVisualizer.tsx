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
    <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(207,207,207,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="waterfall_chart" size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Waterfall Split Visualizer (QRIS Settlement)
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Simulasi pembagian omzet kotor otomatis antara Penyewa, Investor, dan Pemilik Ruko
          </p>
        </div>

        {/* Period Selector Toggle */}
        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-md border border-[rgba(207,207,207,0.08)] text-xs">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-2.5 py-1 rounded transition-colors ${
              period === "daily"
                ? "bg-[#27272A] text-white font-medium shadow-sm"
                : "text-[#8A8A8A] hover:text-white"
            }`}
          >
            Harian
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-2.5 py-1 rounded transition-colors ${
              period === "monthly"
                ? "bg-[#27272A] text-white font-medium shadow-sm"
                : "text-[#8A8A8A] hover:text-white"
            }`}
          >
            Bulanan (30 Hari)
          </button>
        </div>
      </div>

      {/* Gross Revenue Input / Slider */}
      <div className="my-4 p-3.5 bg-[#141414] rounded-md border border-[rgba(207,207,207,0.06)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[#A1A1AA]">
            Omzet Kotor Kasir / QRIS Settlement ({period === "monthly" ? "30 Hari" : "1 Hari"}):
          </span>
          <span className="text-sm font-mono font-bold text-white">
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
          className="w-full accent-blue-500 h-1.5 bg-[#27272A] rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#71717A] mt-1">
          <span>Min: Rp 1.000.000 / hari</span>
          <span>Baseline: Rp 2.370.370 / hari</span>
          <span>Max: Rp 5.000.000 / hari</span>
        </div>
      </div>

      {/* Proportional Split Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs text-[#8A8A8A]">
          <span>Proporsi Alokasi Kas</span>
          <span className="font-mono text-[11px]">Formula: 80% + 15% + 5% = 100%</span>
        </div>
        <div className="w-full h-4 rounded-md overflow-hidden flex bg-[#27272A] p-0.5 gap-0.5">
          <div
            style={{ width: "80%" }}
            className="h-full bg-emerald-500/80 rounded-l transition-all duration-300 relative group cursor-pointer"
            title="80% Retained Tenant"
          />
          <div
            style={{ width: "15%" }}
            className="h-full bg-blue-500/90 transition-all duration-300 relative group cursor-pointer"
            title="15% Investor Payout"
          />
          <div
            style={{ width: "5%" }}
            className="h-full bg-purple-500/90 rounded-r transition-all duration-300 relative group cursor-pointer"
            title="5% Landlord Turnover Rent"
          />
        </div>
      </div>

      {/* Distribution Breakdown Cards (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Tenant Retained (80%) */}
        <div className="p-3 bg-[#141414] rounded-md border border-emerald-500/20">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-emerald-400 font-medium">Tenant Retained</span>
            <span className="font-mono text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              80%
            </span>
          </div>
          <div className="text-base font-mono font-bold text-white tracking-tight">
            {formatIDR(tenantRetained)}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
            Kas operasional tenant (HPP, bahan baku, gaji pegawai kedai).
          </div>
        </div>

        {/* 2. Investor Take (15%) */}
        <div className="p-3 bg-[#141414] rounded-md border border-blue-500/20">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-blue-400 font-medium">Investor Repayment</span>
            <span className="font-mono text-blue-400/90 bg-blue-500/10 px-1.5 py-0.5 rounded text-[11px]">
              15%
            </span>
          </div>
          <div className="text-base font-mono font-bold text-white tracking-tight">
            {formatIDR(investorTake)}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
            Mengalir ke <strong className="text-blue-300">Senior Vault</strong> hingga Rp150M tercapai, lalu ke Junior Vault.
          </div>
        </div>

        {/* 3. Landlord Turnover Rent (5%) */}
        <div className="p-3 bg-[#141414] rounded-md border border-purple-500/20">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-purple-400 font-medium">Turnover Rent</span>
            <span className="font-mono text-purple-400/90 bg-purple-500/10 px-1.5 py-0.5 rounded text-[11px]">
              5%
            </span>
          </div>
          <div className="text-base font-mono font-bold text-white tracking-tight">
            {formatIDR(landlordRent)}
          </div>
          <div className="text-[11px] text-[#71717A] mt-1 leading-relaxed">
            Sewa variabel pemilik ruko. Mengalir terus tanpa henti tiap settlement.
          </div>
        </div>
      </div>
    </div>
  );
};
