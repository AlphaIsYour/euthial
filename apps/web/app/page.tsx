"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProtocol } from "@/context/ProtocolContext";
import { CustomerRebateScanner } from "@/components/fraud/CustomerRebateScanner";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { EcosystemMarquee } from "@/components/landing/EcosystemMarquee";
import { RukoTransformationScroller } from "@/components/landing/RukoTransformationScroller";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function HomePage() {
  const { currentMonth } = useProtocol();

  // State for interactive tenant fit-out calculator
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(70000000); // Rp 70 Jt / bln
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // Calculator outputs based on 80:15:5 economic model
  const calcTenantKeep = Math.round(estimatedRevenue * 0.8);
  const calcInvestorTake = Math.round(estimatedRevenue * 0.15);
  const calcLandlordRent = Math.round(estimatedRevenue * 0.05);
  const capexTarget = 150000000;
  const seniorCap = 150000000;
  const estMonthsToPayoff = Math.max(1, Math.ceil(seniorCap / calcInvestorTake));

  // Showcase Ruko Properties
  const rukoListings = [
    {
      id: "RU-01",
      name: "Ruko Kampus UNEJ (Pilot Aktif)",
      address: "Jl. Kalimantan No. 12, Sumbersari, Jember",
      status: "LIVE_ACTIVE",
      statusBadge: "Protokol Berjalan",
      tenant: "Kedai Kopi Melati (F&B Coffee)",
      capex: 150000000,
      size: "2 Lantai · 140 m²",
      seniorFunded: 100,
      roiTarget: "1.25x Senior Cap",
      takeRate: "80% Kasir / 15% Investor / 5% Sewa",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      category: "ACTIVE",
      actionText: "Buka Detail Vault Pilot",
      actionHref: "/tenant",
      roleLinks: [
        { label: "Buka Portal Tenant", href: "/tenant", color: "text-emerald-400" },
        { label: "Buka Portal Investor", href: "/investor", color: "text-blue-400" },
      ],
    },
    {
      id: "RU-02",
      name: "Ruko Tegal Boto Sentra",
      address: "Jl. Jawa No. 45, Sumbersari, Jember",
      status: "OPEN_TENANT",
      statusBadge: "Tersedia untuk Penyewa",
      tenant: "Dicari: F&B / Bakery / Roastery",
      capex: 135000000,
      size: "2 Lantai · 120 m²",
      seniorFunded: 100,
      roiTarget: "1.25x Cap (Rp 135M)",
      takeRate: "Bagi Hasil 15% QRIS (Tanpa Bunga Bank)",
      imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
      category: "VACANT",
      actionText: "Ajukan Sewa & Fit-Out",
      actionHref: "/tenant",
    },
    {
      id: "RU-03",
      name: "Ruko Komersial Roxy Mall Area",
      address: "Jl. Gajah Mada No. 88, Kaliwates, Jember",
      status: "FUNDING_OPEN",
      statusBadge: "Pendanaan Terbuka 68%",
      tenant: "Calon: Kitchen Hub & Artisan Tea",
      capex: 180000000,
      size: "3 Lantai · 210 m²",
      seniorFunded: 68,
      roiTarget: "1.25x Cap · First-Loss Protected",
      takeRate: "Senior Tranche Rp 144M + Junior Rp 36M",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      category: "FUNDING",
      actionText: "Danai sebagai Investor",
      actionHref: "/investor",
    },
  ];

  const filteredRukos =
    selectedCategory === "ALL"
      ? rukoListings
      : rukoListings.filter((r) => r.category === selectedCategory);

  // Role portal definitions
  const roleCards = [
    {
      role: "Penyewa Kedai",
      sub: "Operator F&B / Tenant",
      href: "/tenant",
      color: "emerald",
      icon: "storefront",
      badge: "Kas Bersih & Kasir",
      desc: "Kelola kas harian 80%, catat transaksi QRIS, pantau status kepatuhan covenant, dan deposit jaminan Rp 15M.",
    },
    {
      role: "Investor Senior",
      sub: "Luar / Tranche Senior",
      href: "/investor",
      color: "blue",
      icon: "trending_up",
      badge: "Prioritas #1 (1.25x)",
      desc: "Pantau pengembalian pokok Rp 120M & target cap Rp 150M. Dilindungi modal junior 20% + tombol tarik kas vault.",
    },
    {
      role: "Pemilik Ruko",
      sub: "Landlord Properti Fisik",
      href: "/landlord",
      color: "amber",
      icon: "domain",
      badge: "Sewa 5% & Junior 20%",
      desc: "Pantau sewa variabel 5% berkelanjutan, subordinasi modal junior Rp 30M, dan persetujuan termin renovasi fisik.",
    },
    {
      role: "Inspektur Fisik",
      sub: "Verifikator & Kontraktor",
      href: "/inspector",
      color: "purple",
      icon: "verified",
      badge: "Multisig 2-of-3",
      desc: "Verifikasi 3 termin fisik capex renovasi ruko dengan bukti hash SHA-256 dan otorisasi pencairan escrow.",
    },
    {
      role: "Jury Demo Control",
      sub: "Evaluasi & Mesin Waktu",
      href: "/demo",
      color: "cyan",
      icon: "tune",
      badge: "Simulator 24 Bulan",
      desc: "Uji coba mesin waktu 24 bulan, stres skenario S1/S4/S6 (kebocoran kas & default), kurva floor, dan audit on-chain.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 1. PUBLIC TOP HEADER & NAVBAR (PLUME-STYLE) */}
      <LandingHeader />

      {/* 2. DEDICATED 3D RUKO FIT-OUT SCROLL ANIMATION (FIRST EXPERIENCE) */}
      <RukoTransformationScroller />

      {/* MAIN CONTAINER (SECTION 1: HERO & PROTOCOL ECOSYSTEM) */}
      <main id="hero-protocol" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-24 scroll-mt-20">
        {/* 1. HERO SECTION (PLUME LIGHT) */}
        <section className="text-center pt-8 md:pt-14 space-y-7">

          {/* Heading with subtle dark gradient & tight tracking */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-medium tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.18]">
            Ubah Ruko Kosong Menjadi Kedai Produktif{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-slate-500">
              Tanpa Beban Modal Renovasi di Muka
            </span>
          </h1>

          {/* Subheadline: concise, 2-lines max-w-2xl text-slate-600 */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Protokol pendanaan fit-out komersial berbasis bagi hasil kasir QRIS.
            Tanpa agunan sertifikat tanah, didukung proteksi dual-tranche dan verifikasi fisik on-chain.
          </p>

          {/* Streamlined 2-Button Hero CTAs (Plume Light) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#katalog-ruko"
              className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition shadow-sm hover:shadow active:scale-[0.98] flex items-center gap-2"
            >
              <MaterialIcon name="storefront" size={14} />
              <span>Jelajahi Ruko Siap Fit-Out</span>
            </a>
            <a
              href="#kalkulator-keekonomian"
              className="py-3 px-6 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs sm:text-sm transition shadow-sm flex items-center gap-2"
            >
              <MaterialIcon name="calculate" size={14} className="text-slate-500" />
              <span>Buka Simulasi Bagi Hasil</span>
            </a>
          </div>

          {/* Clean Institutional Stats Row (Plume Light: #F8FAFC + slate-200 border) */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="rounded-xl border border-slate-200/90 bg-[#F8FAFC] shadow-sm grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-slate-200/90 sm:divide-x sm:divide-slate-200/90 overflow-hidden">
              <div className="p-5 sm:p-6 text-left flex flex-col justify-between space-y-1.5 bg-white sm:bg-transparent">
                <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
                  DANA RENOVASI ESCROW
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  Rp 150 Juta
                </div>
                <p className="text-xs text-slate-600 leading-snug font-normal">
                  Termin bertahap via multisig inspektur
                </p>
              </div>

              <div className="p-5 sm:p-6 text-left flex flex-col justify-between space-y-1.5 bg-white sm:bg-transparent">
                <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
                  PROTEKSI SENIOR
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  1.25x Cap
                </div>
                <p className="text-xs text-slate-600 leading-snug font-normal">
                  First-loss buffer dari modal junior 20%
                </p>
              </div>

              <div className="p-5 sm:p-6 text-left flex flex-col justify-between space-y-1.5 bg-white sm:bg-transparent">
                <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
                  KAS OPERASIONAL TENANT
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  80% Omzet
                </div>
                <p className="text-xs text-slate-600 leading-snug font-normal">
                  Diterima langsung kasir tanpa potongan bank
                </p>
              </div>

              <div className="p-5 sm:p-6 text-left flex flex-col justify-between space-y-1.5 bg-white sm:bg-transparent">
                <div className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
                  SEWA VARIABEL PEMILIK
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                  5% Turnover
                </div>
                <p className="text-xs text-slate-600 leading-snug font-normal">
                  Kompensasi adil proporsional pengunjung
                </p>
              </div>
            </div>
          </div>

          {/* ECOSYSTEM & PARTNER MARQUEE (ENLARGED & PROMINENT) */}
          <div className="pt-8 pb-4">
            <EcosystemMarquee
              title="SUPPORTED BY & COMPOSABLE WITH INDUSTRY LEADERS"
              size="large"
            />
          </div>
        </section>

        {/* 3. SHOWCASE KATALOG RUKO (PLUME VAULT CARDS) */}
        <section id="katalog-ruko" className="space-y-8 pt-4 scroll-mt-24">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
                ACTIVE FIT-OUT VAULTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
                Pilihan Ruko & Kedai Produktif
              </h2>
              <p className="text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
                Penyewa dapat memilih ruko strategis tanpa modal di muka, sementara investor mendanai renovasi dengan hak pengembalian prioritas.
              </p>
            </div>

            {/* Minimalist Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium self-start md:self-auto overflow-x-auto">
              {[
                { id: "ALL", label: "Semua Unit" },
                { id: "ACTIVE", label: "Sedang Berjalan" },
                { id: "VACANT", label: "Siap Disewa" },
                { id: "FUNDING", label: "Buka Pendanaan" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap ${selectedCategory === tab.id
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plume-style Elegant Vault Cards Grid (Clean visual by default, full specs on hover) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRukos.map((ruko) => (
              <div
                key={ruko.id}
                className="group relative flex flex-col rounded-xl bg-white border border-slate-200/80 p-3 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Visual Image Squircle Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={ruko.imageUrl}
                    alt={ruko.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Default State Status Badge */}
                  <div className="absolute top-3 left-3 z-10 transition-opacity duration-200 group-hover:opacity-0">
                    <span
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${
                        ruko.status === "LIVE_ACTIVE"
                          ? "bg-emerald-500/90 border-emerald-400 text-white font-medium"
                          : ruko.status === "OPEN_TENANT"
                            ? "bg-slate-900/90 border-slate-700 text-white font-medium"
                            : "bg-emerald-500/90 border-emerald-400 text-white font-medium"
                      }`}
                    >
                      {ruko.statusBadge}
                    </span>
                  </div>

                  {/* Default State Property Size Metadata */}
                  <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs text-white/95 font-medium drop-shadow-sm z-10 group-hover:opacity-0 transition-opacity duration-200">
                    <MaterialIcon name="domain" size={13} className="text-white/90" />
                    <span>{ruko.size}</span>
                  </div>

                  {/* Default State Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-300" />

                  {/* HOVER TRANSFORMATION OVERLAY: Smoothly reveals full specifications */}
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 p-5 flex flex-col justify-between z-20">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                          SPESIFIKASI FIT-OUT
                        </span>
                        <span className="text-[11px] font-mono text-white/70">
                          {ruko.id} · {ruko.size}
                        </span>
                      </div>

                      {/* Financial & Physical Metrics Grid */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-normal">Target Biaya Fit-Out</span>
                          <span className="text-white font-semibold font-mono">{formatIDR(ruko.capex)}</span>
                        </div>
                        <div className="border-t border-white/10" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-normal">Proteksi Tranche</span>
                          <span className="text-emerald-400 font-semibold">{ruko.roiTarget}</span>
                        </div>
                        <div className="border-t border-white/10" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-normal">Model Cash Flow</span>
                          <span className="text-slate-200 font-medium">{ruko.takeRate}</span>
                        </div>
                      </div>

                      {/* Progress Bar (Funding Open) */}
                      {ruko.status === "FUNDING_OPEN" && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-[11px] font-mono text-slate-300">
                            <span>Tranche Senior Terkumpul</span>
                            <span className="text-emerald-400 font-semibold">{ruko.seniorFunded}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${ruko.seniorFunded}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive CTA Inside Hover State */}
                    <Link
                      href={ruko.actionHref || "/tenant"}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                    >
                      <span>{ruko.actionText || "Lihat Detail Vault"}</span>
                      <MaterialIcon name="arrow_forward" size={13} className="text-slate-950" />
                    </Link>
                  </div>
                </div>

                {/* Below Visual: Clean Minimalist Title & Meta (Plume-style) */}
                <div className="px-2 pt-3 pb-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {ruko.name}
                    </h3>
                    <span className="text-xs font-mono font-semibold text-slate-900 shrink-0">
                      {formatIDR(ruko.capex)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate font-normal">
                    <MaterialIcon name="location_on" size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{ruko.address}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KALKULATOR KEEKONOMIAN PENYEWA (PLUME-STYLE) */}
        <section
          id="kalkulator-keekonomian"
          className="rounded-xl border border-slate-200/90 bg-[#F8FAFC]/95 backdrop-blur-md p-6 sm:p-8 space-y-8 scroll-mt-24 shadow-sm"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
                TRANSPARENT REVENUE MODEL
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
                Kalkulator Bagi Hasil vs Pinjaman Bank Konvensional
              </h2>
              <p className="text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
                Bandingkan bagaimana skema bagi hasil 80:15:5 melindungi arus kas kedai Anda tanpa beban bunga dan sita jaminan bank.
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-xs font-mono text-slate-500 block">
                Estimasi Omzet Bulanan
              </span>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 font-mono mt-0.5">
                {formatIDR(estimatedRevenue)}
              </div>
              <span className="text-xs font-mono text-slate-500 block mt-0.5">
                ~{formatIDR(Math.round(estimatedRevenue / 30))} / hari
              </span>
            </div>
          </div>

          {/* Slider & Kontrol Estimasi Omzet */}
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="range"
                min={30000000}
                max={150000000}
                step={5000000}
                value={estimatedRevenue}
                onChange={(e) => setEstimatedRevenue(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
            </div>

            {/* Preset Quick-Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Preset Skenario:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Skenario Sepi", val: 30000000, display: "Rp 30 Jt" },
                  { label: "Kedai Normal", val: 70000000, display: "Rp 70 Jt" },
                  { label: "Sangat Ramai", val: 150000000, display: "Rp 150 Jt" },
                ].map((chip) => {
                  const isActive = estimatedRevenue === chip.val;
                  return (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setEstimatedRevenue(chip.val)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-150 border ${isActive
                          ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:border-slate-400 shadow-xs"
                        }`}
                    >
                      <span>{chip.label}</span>
                      <span className={isActive ? "text-slate-300 ml-1.5" : "text-slate-500 ml-1.5"}>({chip.display})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual Proporsi Split (Mini Bar) */}
          <div className="space-y-2.5 pt-2">
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 border border-slate-300">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: "80%" }}
                title="80% Kasir Kedai"
              />
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: "15%" }}
                title="15% Pelunasan Senior"
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: "5%" }}
                title="5% Sewa Pemilik"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-0.5 gap-2 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>80% Kasir Kedai (Bebas Angsuran)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>15% Pengembalian Investor Senior</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>5% Sewa Variabel Pemilik Ruko</span>
              </span>
            </div>
          </div>

          {/* 3 Outcome Distribution Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
            {/* Card 1: 80% Kas Bersih Tenant */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-5 sm:p-6 space-y-2.5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-800 font-semibold">
                    Kas Bersih Operasional
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-medium">
                    80% Porsi
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-mono">
                  {formatIDR(calcTenantKeep)}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal pt-2 border-t border-emerald-200/60">
                Uang bebas pakai langsung diterima kasir harian untuk belanja bahan baku, operasional harian, gaji barista, utilitas listrik, dan laba operasional kedai.
              </p>
            </div>

            {/* Card 2: 15% Pelunasan Senior Tranche */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-2.5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-sky-700 font-semibold">
                    Pelunasan Senior Tranche
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-medium">
                    15% Porsi
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-mono">
                  {formatIDR(calcInvestorTake)}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <span className="inline-block text-[11px] font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-medium">
                  Estimasi Lunas: ~{estMonthsToPayoff} Bulan
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Otomatis terpotong via split QRIS POS hingga target 1.25x Return Cap tercapai, kemudian berhenti permanen.
                </p>
              </div>
            </div>

            {/* Card 3: 5% Sewa Variabel Pemilik Ruko */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-2.5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider uppercase text-amber-700 font-semibold">
                    Sewa Variabel Pemilik
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                    5% Porsi
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-mono">
                  {formatIDR(calcLandlordRent)}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <span className="inline-block text-[11px] font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                  Turnover Rent Adil
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kompensasi sewa dinamis: jika omzet sepi beban sewa ikut meringan, jika omzet melonjak pemilik ruko menerima keuntungan proporsional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CARA KERJA PROTOKOL (PLUME 3-STEP FLOW) */}
        <section id="cara-kerja" className="space-y-8 pt-4 scroll-mt-24">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              VERIFIABLE ON-CHAIN WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
              Tiga Langkah dari Ruko Kosong ke Bagi Hasil Terverifikasi
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Arsitektur terpadu yang menyatukan penyewa, investor, dan pemilik properti dalam siklus pendanaan aman tanpa agunan konvensional.
            </p>
          </div>

          {/* 3-Step Grid Cards (1 Col Mobile, 3 Cols Desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Step 01 */}
            <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 relative overflow-hidden group hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
                    <MaterialIcon name="assignment" size={14} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    Step 01
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Ajukan & Kurasi RAB
                    </h3>
                  </div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                    Tanpa Agunan Sertifikat
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    Calon penyewa mengajukan rancangan fisik & RAB renovasi kedai F&B. Protokol memvalidasi potensi lokasi dan kelayakan unit tanpa menyita sertifikat tanah atau agunan aset pribadi.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Verifikasi Lokasi & RAB</span>
                <span className="text-emerald-700 font-medium">Tahap Pra-Protokol</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 relative overflow-hidden group hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-xs">
                    <MaterialIcon name="verified_user" size={14} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    Step 02
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                      Escrow Dual-Tranche 2-of-3
                    </h3>
                  </div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-medium">
                    Smart Contract Escrow
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    Investor luar mendanai Senior (80%) dan pemilik ruko mendanai Junior (20%). Dana renovasi Rp 150M dikunci di vault, dirilis bertahap per 3 termin fisik via multisig inspektur independen.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Rilis Termin Bertahap</span>
                <span className="text-sky-700 font-medium">Proteksi 1.25x Cap</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 relative overflow-hidden group hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                    <MaterialIcon name="qr_code_2" size={14} />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    Step 03
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                      Split Kasir QRIS Real-Time
                    </h3>
                  </div>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                    Zero Default Settlement
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                    Kedai beroperasi penuh. Setiap transaksi kasir QRIS POS otomatis displit 80% ke kasir kedai, 15% pengembalian investor senior, dan 5% sewa variabel pemilik tanpa risiko gagal bayar bulanan.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Distribusi Harian</span>
                <span className="text-amber-700 font-medium">Automasi EIP-712</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5.5. FITUR AUDIT PARTISIPATIF PELANGGAN (ISSUE #34) */}
        <section id="customer-rebate" className="pt-2">
          <CustomerRebateScanner />
        </section>

        {/* 6. CONSOLE AKSES MASUK STAKEHOLDER (BENTO GRID 5 ROLES) */}
        <section id="portal-sistem" className="space-y-8 pt-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              AUTHENTICATED CONSOLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
              Pilih Portal Sesuai Peran Anda
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
              Masuk langsung ke antarmuka operasional tiap peran yang telah terhubung ke simulator keuangan reaktif 24 bulan.
            </p>
          </div>

          <div className="space-y-4">
            {/* Featured Bento Card: Jury Demo Console & Time Machine */}
            <Link
              href="/demo"
              className="block rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 sm:p-7 hover:border-slate-300 hover:shadow-md transition-all duration-300 group shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs group-hover:border-emerald-500/40 transition-colors">
                    <MaterialIcon name="tune" size={14} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Jury Demo Control · Mesin Waktu 24 Bulan
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl font-normal">
                      Evaluasi menyeluruh siklus protokol 24 bulan: percepat waktu, picu skenario kebocoran kas kasir 30%, uji coba gagal bayar S6, verifikasi kurva floor, dan audit cryptographic proof secara on-chain.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 shrink-0 self-end md:self-center">
                  <span>Launch Demo Deck</span>
                  <MaterialIcon name="arrow_forward" size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* 4 Symmetric Core Stakeholder Cards (2x2 on md, 4 cols on lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {roleCards
                .filter((c) => c.href !== "/demo")
                .map((card, idx) => (
                  <Link
                    key={idx}
                    href={card.href}
                    className="rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-4 group shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:border-slate-300 transition-colors">
                          <MaterialIcon name={card.icon} size={14} />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {card.role}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{card.sub}</p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{card.desc}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-900 group-hover:text-emerald-700 transition-colors font-medium">
                      <span>Buka Console</span>
                      <MaterialIcon name="arrow_forward" size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* STANDAR PROTOKOL & INTEGRASI INFRASTRUKTUR FINTECH (STATIC STATIONARY GRID) */}
        <div className="pt-8">
          <EcosystemMarquee
            title="STANDAR PROTOKOL & INTEGRASI INFRASTRUKTUR FINTECH"
            subtitle="INSTITUTIONAL ECOSYSTEM & COMPATIBILITY"
            mode="grid"
          />
        </div>

        {/* PRE-FOOTER AMBIENT CALL-TO-ACTION (PLUME-STYLE BANNER) */}
        <div className="relative overflow-hidden rounded-xl group border border-slate-200/80 shadow-md">
          <div className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full overflow-hidden bg-slate-900">
            <img
              src="/jaison-lin-2WHTac8jVA8-unsplash.jpg"
              alt="Open finance together"
              className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Subtle dark cinematic glass overlay */}
            <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/40 transition-colors duration-700" />

            {/* Centered Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 space-y-4 sm:space-y-4.5 z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-white drop-shadow-sm font-normal">
                Open finance together
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-xl font-normal leading-relaxed drop-shadow-xs">
                Work with Euthial to issue, distribute, and manage real-world assets.
              </p>
              <div className="pt-1.5">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/25 bg-black/40 hover:bg-white/20 hover:border-white/40 text-white text-xs sm:text-sm font-medium backdrop-blur-md transition-all duration-200 shadow-sm active:scale-95"
                >
                  Work with us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 7. INSTITUTIONAL FOOTER (PLUME-STYLE - CLEAN BORDERLESS) */}
        <footer className="pt-8 pb-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Monogram (Spans 2 cols on md) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <img
                    src="/euthial.png"
                    alt="Euthial Protocol"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-semibold tracking-[-0.02em] text-slate-900">
                  Euthial Protocol
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-sm font-normal leading-relaxed">
                Verifiable Revenue-Based Financing for Commercial Ruko Fit-outs.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Protokol
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <a href="#katalog-ruko" className="hover:text-slate-900 transition-colors">
                    Katalog Ruko
                  </a>
                </li>
                <li>
                  <a href="#kalkulator-keekonomian" className="hover:text-slate-900 transition-colors">
                    Simulasi Keekonomian
                  </a>
                </li>
                <li>
                  <a href="#cara-kerja" className="hover:text-slate-900 transition-colors">
                    Cara Kerja Protokol
                  </a>
                </li>
                <li>
                  <a href="#customer-rebate" className="hover:text-slate-900 transition-colors">
                    Anti-Rogue Scanner
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Role Consoles & External */}
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Console Peran
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/tenant" className="hover:text-slate-900 transition-colors">
                    Portal Penyewa
                  </Link>
                </li>
                <li>
                  <Link href="/investor" className="hover:text-slate-900 transition-colors">
                    Portal Investor Senior
                  </Link>
                </li>
                <li>
                  <Link href="/landlord" className="hover:text-slate-900 transition-colors">
                    Portal Pemilik Ruko
                  </Link>
                </li>
                <li>
                  <Link href="/inspector" className="hover:text-slate-900 transition-colors">
                    Portal Inspektur Fisik
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                    Jury Mission Control →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <p>© {new Date().getFullYear()} Euthial Protocol. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Base Sepolia (Chain ID 84532)</span>
              </span>
              <span>·</span>
              <span>EIP-712 Attestation Engine</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
