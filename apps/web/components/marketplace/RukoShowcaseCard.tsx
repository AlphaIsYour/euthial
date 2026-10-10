"use client";

import React, { useState } from "react";
import {
  Coffee,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  FileText
} from "lucide-react";

interface RukoShowcaseCardProps {
  dealId?: number;
  onInvestClick?: (tranche: "SENIOR" | "JUNIOR", amount: number) => void;
}

export function RukoShowcaseCard({ onInvestClick }: RukoShowcaseCardProps) {
  const [viewMode, setViewMode] = useState<"AFTER" | "BEFORE">("AFTER");
  const [investAmount, setInvestAmount] = useState<number>(10_000_000); // 10 Juta IDR default
  const [selectedTranche, setSelectedTranche] = useState<"SENIOR" | "JUNIOR">("SENIOR");

  // Multiplier logic
  const seniorMultiplier = 1.25; // 1.25x
  const juniorMultiplier = 1.40; // 1.40x
  const calculatedReturn =
    selectedTranche === "SENIOR"
      ? investAmount * seniorMultiplier
      : investAmount * juniorMultiplier;
  const netProfit = calculatedReturn - investAmount;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700">
      {/* Top Banner / Image Area */}
      <div id="tour-ruko-catalog" className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden group">
        {/* Visual Render Placeholder / Background Simulation */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
            viewMode === "AFTER"
              ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-slate-900 to-slate-950"
              : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950"
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {viewMode === "AFTER" ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-950/50">
                  <Coffee className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-1">
                  Render Visual 3D Interior Fit-Out
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  Kedai Kopi Fore — Konsep Minimalis Modern
                </h3>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Barista counter marmer, pencahayaan warm acoustic ceiling, dan 40 seating area siap beroperasi.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                  <Building2 className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-1">
                  Kondisi Ruko Kosong Sebelum Renovasi
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-300">
                  Ruko Kemang Grand Square (2 Lantai)
                </h3>
                <p className="text-xs text-slate-500 max-w-md mt-1">
                  Bangunan kosong tanpa partisi interior. Membutuhkan instalasi MEP dan finishing lantai.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Before / After Toggle Buttons */}
        <div className="absolute top-4 right-4 z-10 flex items-center bg-slate-900/90 border border-slate-700 p-1 rounded-xl backdrop-blur-md shadow-lg text-xs font-semibold">
          <button
            onClick={() => setViewMode("AFTER")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "AFTER"
                ? "bg-amber-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Setelah Fit-Out</span>
          </button>
          <button
            onClick={() => setViewMode("BEFORE")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "BEFORE"
                ? "bg-slate-700 text-slate-100 font-bold shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Sebelum</span>
          </button>
        </div>

        {/* Tenant Brand Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-md text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Tenant Terverifikasi: Kopi Fore</span>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header Title & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>Ruko Kemang Grand Square No. 45</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Jl. Kemang Raya, Jakarta Selatan • Luas 160 m² (2 Lantai) • Tenor 18 Bulan
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 font-mono font-semibold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>SHM #04821 (Hash On-Chain)</span>
            </span>
          </div>
        </div>

        {/* Financial Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Biaya Fit-Out</div>
            <div className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">Rp 150.000.000</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Renovasi Interior & MEP</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Senior Principal</div>
            <div className="text-lg sm:text-xl font-bold text-amber-400 mt-0.5">Rp 120.000.000</div>
            <div className="text-[10px] text-amber-500/80 mt-0.5">Imbal Hasil 1.25x (80%)</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Junior Principal</div>
            <div className="text-lg sm:text-xl font-bold text-indigo-400 mt-0.5">Rp 30.000.000</div>
            <div className="text-[10px] text-indigo-400/80 mt-0.5">Imbal Hasil 1.40x (20%)</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Alokasi Kasir QRIS</div>
            <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">15% Omzet</div>
            <div className="text-[10px] text-slate-400 mt-0.5">85% Aman di Toko</div>
          </div>
        </div>

        {/* Skin In The Game Clarification Alert */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-emerald-300">Komitmen Mitra & Skin in the Game:</div>
            <p className="text-slate-300 leading-relaxed">
              Tenant menyediakan <strong>mesin espresso, tablet POS kasir, inventaris bahan baku kopi, dan gaji karyawan</strong> secara mandiri. Dana investor 100% dialokasikan murni untuk renovasi fisik ruko yang meningkatkan nilai aset permanen.
            </p>
          </div>
        </div>

        {/* Tranche Selector */}
        <div id="tour-tranches" className="space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pilih Tranche Investasi:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedTranche("SENIOR")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedTranche === "SENIOR"
                  ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Senior Tranche</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">Target 1.25x Modal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritas pembayaran pertama dari kasir tiap hari. Risiko terendah dan terlindungi oleh cadangan Deposit Bond.
              </p>
            </div>

            <div
              onClick={() => setSelectedTranche("JUNIOR")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedTranche === "JUNIOR"
                  ? "bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50"
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Junior Tranche</span>
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300">Target 1.40x Modal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Imbal hasil lebih tinggi (keuntungan 40%). Menerima sisa alokasi setelah cicilan Senior harian terpenuhi.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive ROI Calculator */}
        <div id="tour-roi-calculator" className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Simulasi Modal Investasi Anda</span>
            </span>
            <span className="text-base font-mono font-black text-emerald-400">
              Rp {investAmount.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="1000000"
            max="30000000"
            step="1000000"
            value={investAmount}
            onChange={(e) => setInvestAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Min: Rp 1 Jt</span>
            <span>Rp 15 Jt</span>
            <span>Max: Rp 30 Jt</span>
          </div>

          {/* Projected Payout Box */}
          <div className="grid grid-cols-2 gap-4 pt-3">
            <div>
              <div className="text-[11px] text-slate-400">Total Pengembalian Target:</div>
              <div className="text-lg font-bold text-slate-100 font-mono">
                Rp {calculatedReturn.toLocaleString("id-ID")}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-emerald-400 font-semibold">Keuntungan Bersih (Profit):</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                + Rp {netProfit.toLocaleString("id-ID")} ({selectedTranche === "SENIOR" ? "25%" : "40%"})
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div id="tour-deposit-action" className="pt-2">
          <button
            onClick={() => onInvestClick && onInvestClick(selectedTranche, investAmount)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-98 transition-all"
          >
            <span>Simulasi Investasi Rp {investAmount.toLocaleString("id-ID")} ({selectedTranche})</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Uang terkunci di Smart Contract Escrow dan hanya cair ke kontraktor setelah verifikasi fisik.
          </p>
        </div>
      </div>
    </div>
  );
}
