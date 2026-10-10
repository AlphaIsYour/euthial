"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shell } from "../../../components/layout/Shell";
import { MaterialIcon } from "../../../components/ui/MaterialIcon";

export default function CoverageCheckCalculatorPage() {
  // Financial parameters
  const [capex, setCapex] = useState<number>(150_000_000);
  const [seniorSplitPct, setSeniorSplitPct] = useState<number>(80);
  const [targetMultiple, setTargetMultiple] = useState<number>(1.25);
  const [tenorMonths, setTenorMonths] = useState<number>(24);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(85_000_000);
  const [takeRatePct, setTakeRatePct] = useState<number>(15);
  const [covenantFloor, setCovenantFloor] = useState<number>(12_500_000);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse URL search params on mount if any
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("capex")) setCapex(Number(params.get("capex")));
      if (params.get("split")) setSeniorSplitPct(Number(params.get("split")));
      if (params.get("multiple")) setTargetMultiple(Number(params.get("multiple")));
      if (params.get("tenor")) setTenorMonths(Number(params.get("tenor")));
      if (params.get("revenue")) setMonthlyRevenue(Number(params.get("revenue")));
      if (params.get("takerate")) setTakeRatePct(Number(params.get("takerate")));
    }
  }, []);

  // Sync to URL
  const updateUrl = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams({
        capex: capex.toString(),
        split: seniorSplitPct.toString(),
        multiple: targetMultiple.toString(),
        tenor: tenorMonths.toString(),
        revenue: monthlyRevenue.toString(),
        takerate: takeRatePct.toString(),
      });
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  const copyShareLink = () => {
    updateUrl();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Calculations based on 02_ECONOMIC_MODEL.md
  const seniorPrincipal = (capex * seniorSplitPct) / 100;
  const juniorPrincipal = capex - seniorPrincipal;
  const seniorTargetCap = seniorPrincipal * targetMultiple;

  // Monthly expected revenue share from tenant
  const monthlyTakeAmount = (monthlyRevenue * takeRatePct) / 100;
  const totalExpectedRevenueShare = monthlyTakeAmount * tenorMonths;

  // Coverage Ratio = Total expected revenue share / Senior target claim
  const coverageRatio = seniorTargetCap > 0 ? totalExpectedRevenueShare / seniorTargetCap : 0;

  // Floor Coverage = (Covenant Floor * Tenor) / Senior target claim
  const floorCoverageRatio = seniorTargetCap > 0 ? (covenantFloor * tenorMonths) / seniorTargetCap : 0;

  // Estimated Months to Break-Even / Full Repayment
  const estimatedMonthsToPayoff = monthlyTakeAmount > 0 ? Math.ceil(seniorTargetCap / monthlyTakeAmount) : 999;

  const isPass = coverageRatio >= 1.3;
  const isModerate = coverageRatio >= 1.1 && coverageRatio < 1.3;

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A]">
              <Link href="/demo" className="hover:text-blue-500">Alat Publik</Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-semibold">Coverage Check Calculator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Kalkulator Kelayakan Deal & Rasio Proteksi Investor
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
              Formula standar audit Euthial: Validasi kelayakan underwriting sebelum menerbitkan kontrak di Sepolia.
            </p>
          </div>

          <button
            onClick={copyShareLink}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-blue-500 text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
          >
            <MaterialIcon name={copiedLink ? "check" : "share"} size={16} className={copiedLink ? "text-emerald-500" : ""} />
            {copiedLink ? "Link Tersalin!" : "Bagikan Simulasi (URL)"}
          </button>
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <MaterialIcon name="tune" size={18} className="text-blue-500" />
              Parameter Finansial & Properti Ruko
            </h2>

            {/* Input 1: Total Capex */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-zinc-300">Total Anggaran Renovasi (Capex)</span>
                <strong className="text-blue-600 dark:text-blue-400">{formatIDR(capex)}</strong>
              </div>
              <input
                type="range"
                min={50_000_000}
                max={500_000_000}
                step={10_000_000}
                value={capex}
                onChange={(e) => setCapex(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Rp 50 Juta</span>
                <span>Rp 500 Juta</span>
              </div>
            </div>

            {/* Input 2: Senior Tranche Split */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-zinc-300">Porsi Senior Tranche ({seniorSplitPct}%)</span>
                <strong className="text-slate-900 dark:text-white">
                  Senior: {formatIDR(seniorPrincipal)} · Junior: {formatIDR(juniorPrincipal)}
                </strong>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={seniorSplitPct}
                onChange={(e) => setSeniorSplitPct(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>50% Senior / 50% Junior</span>
                <span>80% Rekomendasi</span>
                <span>90% Max</span>
              </div>
            </div>

            {/* Input 3: Target Multiple & Tenor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block">
                  Senior Target Return Multiple
                </label>
                <select
                  value={targetMultiple}
                  onChange={(e) => setTargetMultiple(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                >
                  <option value={1.15}>1.15x (15% Profit Cap)</option>
                  <option value={1.20}>1.20x (20% Profit Cap)</option>
                  <option value={1.25}>1.25x Standar (25% Profit Cap)</option>
                  <option value={1.30}>1.30x (30% Profit Cap)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block">
                  Jangka Waktu Tenor Sewa
                </label>
                <select
                  value={tenorMonths}
                  onChange={(e) => setTenorMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                >
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={18}>18 Bulan (1.5 Tahun)</option>
                  <option value={24}>24 Bulan Standar (2 Tahun)</option>
                  <option value={36}>36 Bulan (3 Tahun)</option>
                </select>
              </div>
            </div>

            {/* Input 4: Estimated Store Monthly Revenue & Take Rate */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600 dark:text-zinc-300">Estimasi Omzet Toko / Bulan</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{formatIDR(monthlyRevenue)}</strong>
              </div>
              <input
                type="range"
                min={30_000_000}
                max={300_000_000}
                step={5_000_000}
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Rp 30 Juta/bln</span>
                <span>Rp 300 Juta/bln</span>
              </div>
            </div>

            {/* Input 5: Take Rate & Floor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-zinc-300">Take Rate Omzet ({takeRatePct}%)</span>
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {formatIDR(monthlyTakeAmount)}/bln
                  </span>
                </div>
                <input
                  type="range"
                  min={8}
                  max={25}
                  step={1}
                  value={takeRatePct}
                  onChange={(e) => setTakeRatePct(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 dark:text-zinc-300">Covenant Floor Target</span>
                  <span className="text-purple-500 font-semibold">{formatIDR(covenantFloor)}/bln</span>
                </div>
                <input
                  type="range"
                  min={5_000_000}
                  max={25_000_000}
                  step={500_000}
                  value={covenantFloor}
                  onChange={(e) => setCovenantFloor(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Results Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Verdict Badge Card */}
            <div
              className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
                isPass
                  ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30"
                  : isModerate
                  ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/30"
                  : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                  HASIL ANALISIS UNDERWRITING
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    isPass
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : isModerate
                      ? "bg-amber-500 text-black border-amber-600"
                      : "bg-rose-500 text-white border-rose-600"
                  }`}
                >
                  {isPass ? "🟢 PASS · LAYAK" : isModerate ? "🟡 MODERATE · RISIKO SEDANG" : "🔴 HIGH RISK · DITOLAK"}
                </span>
              </div>

              <div>
                <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {coverageRatio.toFixed(2)}x
                </div>
                <div className="text-xs text-slate-600 dark:text-zinc-300 font-mono mt-0.5">
                  Debt Service Coverage Ratio (DSCR)
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                {isPass
                  ? "✅ Struktur deal sangat sehat. Estimasi bagi hasil pendapatan mencukupi pelunasan Senior Tranche dengan buffer keamanan lebih dari 30%."
                  : isModerate
                  ? "⚠️ Rasio coverage tipis (1.1x–1.3x). Disarankan menaikkan uang jaminan (bond) minimal menjadi 4 bulan sewa untuk melindungi investor."
                  : "❌ Rasio coverage di bawah 1.1x. Proyeksi pendapatan toko terlalu riskan untuk menutupi 1.25x modal investor dalam 24 bulan."}
              </p>
            </div>

            {/* Financial Metrics Summary */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 font-mono text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
                <MaterialIcon name="analytics" size={16} className="text-blue-500" />
                Ringkasan Angka Kunci
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500">Target Pelunasan Senior (Cap):</span>
                <strong className="text-slate-900 dark:text-white">{formatIDR(seniorTargetCap)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500">Total Proyeksi Bagi Hasil:</span>
                <strong className="text-emerald-500">{formatIDR(totalExpectedRevenueShare)}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500">Estimasi Waktu BEP Investor:</span>
                <strong className="text-blue-500">{estimatedMonthsToPayoff} Bulan</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500">Covenant Floor Coverage:</span>
                <strong className={floorCoverageRatio >= 1 ? "text-emerald-500" : "text-rose-500"}>
                  {floorCoverageRatio.toFixed(2)}x
                </strong>
              </div>

              <div className="pt-2">
                <Link
                  href="/landlord/new-deal"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MaterialIcon name="post_add" size={16} />
                  Gunakan Parameter Ini untuk Deal Baru &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
