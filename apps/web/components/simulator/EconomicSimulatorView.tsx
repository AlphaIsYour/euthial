"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const EconomicSimulatorView: React.FC = () => {
  const [monthlyGross, setMonthlyGross] = useState<number>(71111100);
  const [operatingMargin, setOperatingMargin] = useState<number>(45); // 45%

  const totalTakeRate = 20; // 15% investor + 5% landlord
  const coverageRatio = (operatingMargin / totalTakeRate).toFixed(2);
  const isCoveragePassed = Number(coverageRatio) >= 2.0;

  const seniorTarget = 150000000;
  const monthlyInvestorTake = Math.round(monthlyGross * 0.15);
  const estMonthsSenior = (seniorTarget / monthlyInvestorTake).toFixed(1);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(207,207,207,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="candlestick_chart" size={18} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              Economic Model & Coverage Gate Simulator
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Evaluasi kelayakan origination ruko sebelum agreement diterbitkan on-chain
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#71717A] bg-[#141414] px-2.5 py-1 rounded border border-[rgba(207,207,207,0.06)]">
          Asumsi Model Finansial · Jember Pilot
        </span>
      </div>

      {/* Input Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 bg-[#141414] rounded-md border border-[rgba(207,207,207,0.06)] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#A1A1AA]">Omzet Kotor Bulanan (G):</span>
            <span className="font-mono font-bold text-white">{formatIDR(monthlyGross)}</span>
          </div>
          <input
            type="range"
            min={30000000}
            max={150000000}
            step={1000000}
            value={monthlyGross}
            onChange={(e) => setMonthlyGross(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-[#27272A] rounded-lg cursor-pointer"
          />
        </div>

        <div className="p-3.5 bg-[#141414] rounded-md border border-[rgba(207,207,207,0.06)] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#A1A1AA]">Margin Operasional Tenant (EBITDA Margin):</span>
            <span className="font-mono font-bold text-white">{operatingMargin}%</span>
          </div>
          <input
            type="range"
            min={20}
            max={60}
            step={1}
            value={operatingMargin}
            onChange={(e) => setOperatingMargin(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-[#27272A] rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Gate Check & Key Projections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Coverage Gate */}
        <div
          className={`p-3.5 rounded-card border ${
            isCoveragePassed
              ? "bg-emerald-500/5 border-emerald-500/30"
              : "bg-red-500/5 border-red-500/30"
          }`}
        >
          <span className="text-[11px] text-[#8A8A8A] block">Coverage Gate Check</span>
          <div
            className={`text-lg font-mono font-bold mt-0.5 ${
              isCoveragePassed ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {coverageRatio}x
          </div>
          <div className="text-[10px] font-mono mt-1 text-[#A1A1AA]">
            {isCoveragePassed
              ? "✓ Lolos (Coverage >= 2.0x)"
              : "✗ Gagal: Margin terlalu tipis untuk take-rate 20%"}
          </div>
        </div>

        {/* Est. Payoff Senior */}
        <div className="p-3.5 bg-[#141414] rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A] block">Estimasi Waktu Senior Lunas</span>
          <div className="text-lg font-mono font-bold text-blue-400 mt-0.5">
            ~{estMonthsSenior} Bulan
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-1">
            Target Klaim 1.25x (Rp 150M)
          </div>
        </div>

        {/* Landlord Continuous Rent */}
        <div className="p-3.5 bg-[#141414] rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A] block">Sewa Bulanan Pemilik Ruko (5%)</span>
          <div className="text-lg font-mono font-bold text-purple-400 mt-0.5">
            {formatIDR(monthlyGross * 0.05)}
          </div>
          <div className="text-[10px] font-mono text-[#71717A] mt-1">
            Mengalir stabil tiap bulan
          </div>
        </div>
      </div>
    </div>
  );
};
