"use client";

import React, { useState } from "react";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { WaterfallVisualizer } from "../../components/waterfall/WaterfallVisualizer";
import { CustomerRebateScanner } from "../../components/fraud/CustomerRebateScanner";

export default function TenantPortalPage() {
  const protocol = useProtocol();
  const web3 = useWeb3();
  const {
    currentMonth,
    grossMonthly,
    tenantCash,
    bondBalance,
    rollingBondReserve,
    covenantStatus,
    simulateDailySale,
  } = protocol;

  const [dailySaleInput, setDailySaleInput] = useState<number>(2500000);
  const [saleProcessed, setSaleProcessed] = useState<boolean>(false);
  const [topUpDone, setTopUpDone] = useState<boolean>(false);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSimulateSale = (e: React.FormEvent) => {
    e.preventDefault();
    simulateDailySale(dailySaleInput);
    setSaleProcessed(true);
    setTimeout(() => setSaleProcessed(false), 2000);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Context Banner */}
        <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-black border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <MaterialIcon name="storefront" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal Penyewa: Kedai Kopi Melati
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  TENANT OPERATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                Ruko Jl. Kalimantan No. 12, Jember · Bulan Operasional ke-{currentMonth} (Hari {currentMonth * 30})
              </p>
            </div>
          </div>

          {/* Covenant Status Badge */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A0A] px-3.5 py-2 rounded-md border border-slate-200/80 dark:border-white/10 shrink-0 self-start md:self-center">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Status Covenant:</span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 ${
                covenantStatus === "HEALTHY"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : covenantStatus === "CURE"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  covenantStatus === "HEALTHY" ? "bg-emerald-500 dark:bg-emerald-400" : "bg-red-500 dark:bg-red-400"
                }`}
              />
              <span>{covenantStatus}</span>
            </span>
          </div>
        </div>

        {/* 4 Primary Operational Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: 80% Retained Cash */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">KAS DITAHAN OPERASIONAL (80%)</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(tenantCash)}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              Bebas untuk HPP, bahan baku & gaji
            </span>
          </div>

          {/* Card 2: Escrow Bond & Rolling Reserve */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">TOTAL JAMINAN (MULTI-TIER)</span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1 py-0.5 rounded border border-cyan-500/20">
                +{(rollingBondReserve / 1_000_000).toFixed(1)}M Rolling
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatIDR(bondBalance + rollingBondReserve)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Base: {formatIDR(bondBalance)} · Rolling: {formatIDR(rollingBondReserve)}
            </span>
          </div>

          {/* Card 3: Omzet QRIS Bulan Ini */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">OMZET QRIS BULAN INI (G)</span>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(grossMonthly)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#8A8A8A] font-mono">
              Tercatat otomatis via mutasi bank
            </span>
          </div>

          {/* Card 4: Coverage Margin Ratio */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">COVERAGE MARGIN RATIO</span>
            <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              2.35x
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/90 font-mono">
              ✓ Lolos (Threshold Min: 2.0x)
            </span>
          </div>
        </div>

        {/* Interactive Cashier Simulation Widget & Covenant Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cashier Simulation Form */}
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
              <MaterialIcon name="point_of_sale" size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Simulasi Kasir QRIS Harian (Demo Tool)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] leading-relaxed">
              Uji bagaimana satu hari penjualan kasir QRIS otomatis teralokasi oleh protokol (80% kas ditahan kedai, 15% investor, 5% sewa pemilik ruko).
            </p>

            <form onSubmit={handleSimulateSale} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-600 dark:text-[#A1A1AA] block mb-1">
                  Total Omzet Kasir Hari Ini (IDR):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dailySaleInput}
                    onChange={(e) => setDailySaleInput(Number(e.target.value))}
                    step={100000}
                    min={500000}
                    max={10000000}
                    className="flex-1 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/15 rounded-md px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MaterialIcon name="send" size={14} />
                    <span>{saleProcessed ? "Tercatat!" : "Kirim Settlement"}</span>
                  </button>
                </div>
              </div>

              {/* Instant Breakdown Preview */}
              <div className="p-3 bg-slate-50 dark:bg-[#0A0A0A] rounded-md border border-slate-200/80 dark:border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">Hak Kedai (80%)</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formatIDR(dailySaleInput * 0.80)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">Investor (15%)</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {formatIDR(dailySaleInput * 0.15)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">Sewa Ruko (5%)</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {formatIDR(dailySaleInput * 0.05)}
                  </span>
                </div>
              </div>
            </form>
          </div>

          {/* Covenant Protection & Bond Top-Up Desk */}
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                <MaterialIcon name="shield" size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Perlindungan Uang Jaminan & Aksi Covenant
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-2 leading-relaxed">
                Uang jaminan (Bond) sebesar Rp 15 Juta melindungi usaha Anda dari risiko penggusuran. Jika omzet turun di bawah batas minimum (*Floor*), Anda memiliki masa perbaikan (*Cure Period* 7 hari) untuk setor mandiri sebelum deposit jaminan ditarik sebagian.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={async () => {
                  await web3.depositBond(5000000);
                  setTopUpDone(true);
                  setTimeout(() => setTopUpDone(false), 2000);
                }}
                className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MaterialIcon name="add_circle" size={15} className="text-emerald-400 dark:text-emerald-600" />
                <span>{topUpDone ? "Top-Up Disetor!" : "Top-Up Deposit Bond"}</span>
              </button>

              <button
                onClick={() => web3.cureTopUp(3200000)}
                disabled={covenantStatus === "HEALTHY"}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-colors ${
                  covenantStatus !== "HEALTHY"
                    ? "bg-amber-600 hover:bg-amber-500 text-white border-transparent cursor-pointer"
                    : "bg-slate-100 dark:bg-[#0A0A0A] text-slate-400 dark:text-[#52525B] border-slate-200 dark:border-white/10 cursor-not-allowed"
                }`}
              >
                <MaterialIcon name="warning" size={15} />
                <span>
                  {covenantStatus !== "HEALTHY"
                    ? "Selesaikan Shortfall (Cure)"
                    : "Cure Shortfall (Tidak Ada Selisih)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Waterfall Proportion Visualizer */}
        <WaterfallVisualizer />

        {/* Customer Tokenized Rebate & Anti-Rogue QR Scanner (Issue #34) */}
        <CustomerRebateScanner />
      </div>
    </Shell>
  );
}
