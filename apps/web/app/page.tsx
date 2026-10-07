"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProtocol } from "@/context/ProtocolContext";
import { CustomerRebateScanner } from "@/components/fraud/CustomerRebateScanner";

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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* 1. PUBLIC TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0A0A]/85 border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <span className="material-symbols-outlined text-lg">domain</span>
              </div>
              <span className="text-base font-bold tracking-tight text-white font-mono">
                EUTHIAL<span className="text-emerald-400">.</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/50">
              FitOut Vault
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-white/60">
            <a href="#katalog-ruko" className="hover:text-white transition">Katalog Ruko</a>
            <a href="#kalkulator-keekonomian" className="hover:text-white transition">Kalkulator Bagi Hasil</a>
            <a href="#cara-kerja" className="hover:text-white transition">Cara Kerja</a>
            <a href="#portal-sistem" className="hover:text-emerald-400 transition">Portal Stakeholder</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#portal-sistem"
              className="py-1.5 px-3 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">login</span>
              <span>Pilih Role</span>
            </a>
            <Link
              href="/demo"
              className="py-1.5 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">play_circle</span>
              <span className="hidden sm:inline">Launch</span> Demo Deck
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* 2. HERO SECTION */}
        <section className="text-center pt-6 md:pt-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform Verifiable RBF untuk Fit-Out Ruko Komersial · Pilot Jember
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Ubah Ruko Kosong Menjadi Kedai Produktif{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Tanpa Beban Modal Renovasi di Muka
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            <strong>Euthial (FitOut Vault)</strong> membuka jalan buntu properti mangkrak. Renovasi didanai bersama oleh Investor dan Pemilik Ruko, dengan pengembalian terverifikasi otomatis via split kasir QRIS.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#katalog-ruko"
              className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono transition shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[17px]">storefront</span>
              Jelajahi Ruko Tersedia
            </a>
            <a
              href="#portal-sistem"
              className="py-3 px-5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-xs font-mono transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[17px]">dashboard</span>
              Masuk Dashboard Sistem (5 Role)
            </a>
            <Link
              href="/demo"
              className="py-3 px-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs flex items-center gap-2 transition"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              Jury Mission Control
            </Link>
          </div>

          {/* Trust Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-white/10 bg-[#121212]">
              <div className="text-[11px] font-mono text-white/40">DANA RENOVASI ESCROW</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">Rp 150 Juta</div>
              <div className="text-[10px] text-emerald-400">Rilis per Termin Multisig</div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#121212]">
              <div className="text-[11px] font-mono text-white/40">PROTEKSI SENIOR</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">1.25x Return Cap</div>
              <div className="text-[10px] text-blue-400">First-Loss Buffer Junior 20%</div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#121212]">
              <div className="text-[11px] font-mono text-white/40">KAS OPERASIONAL TENANT</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">80% Omzet Kasir</div>
              <div className="text-[10px] text-emerald-400">Langsung Diterima Penyewa</div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-[#121212]">
              <div className="text-[11px] font-mono text-white/40">SEWA VARIABEL PEMILIK</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">5% Turnover Rent</div>
              <div className="text-[10px] text-amber-400">Adil Mengikuti Keramaian</div>
            </div>
          </div>
        </section>

        {/* 3. SHOWCASE KATALOG RUKO (PRODUCT CARDS) */}
        <section id="katalog-ruko" className="space-y-6 pt-4 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Katalog Properti & Peluang Bisnis
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                Pilihan Ruko Siap Pakai di Jember
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Penyewa baru dapat memilih lokasi ruko strategis dan mengajukan permohonan pembiayaan fit-out tanpa agunan sertifikat.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#141414] p-1 rounded-lg border border-white/10 text-xs font-mono">
              {[
                { id: "ALL", label: "Semua Unit" },
                { id: "ACTIVE", label: "Sedang Berjalan" },
                { id: "VACANT", label: "Siap Disewa" },
                { id: "FUNDING", label: "Buka Pendanaan" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-md transition ${
                    selectedCategory === tab.id
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRukos.map((ruko) => (
              <div
                key={ruko.id}
                className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden flex flex-col justify-between hover:border-white/20 transition group"
              >
                <div>
                  {/* Photo with Overlay */}
                  <div className="relative h-48 w-full bg-[#1e1e1e] overflow-hidden">
                    <img
                      src={ruko.imageUrl}
                      alt={ruko.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border ${
                          ruko.status === "LIVE_ACTIVE"
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : ruko.status === "OPEN_TENANT"
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                            : "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        }`}
                      >
                        {ruko.statusBadge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-3 text-xs font-mono text-white/80">
                      {ruko.size}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5 space-y-3.5">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {ruko.name}
                      </h3>
                      <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px] text-white/40">
                          location_on
                        </span>
                        {ruko.address}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-white/40">Tenant:</span>
                        <span className="text-white font-medium">{ruko.tenant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Estimasi Fit-Out:</span>
                        <span className="text-emerald-400 font-semibold">{formatIDR(ruko.capex)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Bagi Hasil:</span>
                        <span className="text-white/80">{ruko.roiTarget}</span>
                      </div>
                    </div>

                    {ruko.status === "FUNDING_OPEN" && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-white/50">
                          <span>Progress Pendanaan:</span>
                          <span className="text-blue-400 font-bold">{ruko.seniorFunded}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-400 h-full rounded-full"
                            style={{ width: `${ruko.seniorFunded}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  {ruko.roleLinks ? (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      {ruko.roleLinks.map((btn, i) => (
                        <Link
                          key={i}
                          href={btn.href}
                          className="py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-center text-white/80 hover:text-white transition"
                        >
                          {btn.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={ruko.actionHref || "/tenant"}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{ruko.actionText}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KALKULATOR KEEKONOMIAN PENYEWA */}
        <section id="kalkulator-keekonomian" className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#121212] space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Simulasi Keekonomian
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Kalkulator Bagi Hasil vs Pinjaman Bank Konvensional
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Bandingkan bagaimana skema bagi hasil 80:15:5 melindungi kas kedai Anda tanpa beban bunga pinjaman bank.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-white/40 block">Estimasi Omzet Bulanan:</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {formatIDR(estimatedRevenue)}
              </span>
              <span className="text-[11px] text-white/40 block">~{formatIDR(Math.round(estimatedRevenue / 30))} per hari</span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={30000000}
              max={150000000}
              step={5000000}
              value={estimatedRevenue}
              onChange={(e) => setEstimatedRevenue(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-white/30">
              <span>Rp 30 Jt (Skenario Sepi)</span>
              <span>Rp 70 Jt (Kedai Normal)</span>
              <span>Rp 150 Jt (Sangat Ramai)</span>
            </div>
          </div>

          {/* 3 Outcome Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                80% Kas Bersih Tetap Milik Anda
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatIDR(calcTenantKeep)}
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Uang bebas pakai untuk belanja biji kopi, susu, gaji barista, utilitas listrik, dan profit bersih kedai.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
              <div className="text-[11px] font-mono text-blue-300 uppercase font-semibold">
                15% Pelunasan Fit-Out (Senior)
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatIDR(calcInvestorTake)}
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Otomatis terpotong dari QRIS. Estimasi modal renovasi lunas dalam <strong>~{estMonthsToPayoff} bulan</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
              <div className="text-[11px] font-mono text-amber-300 uppercase font-semibold">
                5% Sewa Variabel Pemilik Ruko
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {formatIDR(calcLandlordRent)}
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                Turnover Rent adil: Jika omzet kedai sedang turun, biaya sewa ruko ikut mengecil secara proporsional.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CARA KERJA PROTOKOL (3 LANGKAH) */}
        <section id="cara-kerja" className="space-y-6 pt-4 scroll-mt-24">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Arsitektur & Alur Kerja
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Bagaimana FitOut Vault Bekerja?
            </h2>
            <p className="text-xs text-white/50 max-w-xl mx-auto">
              Tiga pihak disatukan dalam satu smart contract yang aman, transparan, dan dapat diverifikasi secara on-chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-white/10 bg-[#121212] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-white">Pilih Ruko & Ajukan Fit-Out</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Penyewa memilih lokasi ruko kosong di Jember dan mengajukan rencana anggaran biaya (RAB) renovasi ke protokol.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#121212] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-white">Pendanaan & Rilis Escrow 2-of-3</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Investor luar mendanai Tranche Senior (80%) dan Pemilik Ruko mendanai Junior (20%). Dana renovasi dicairkan per termin setelah diverifikasi inspektur.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#121212] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-white">Operasi & Bagi Hasil QRIS</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Kedai mulai buka. Setiap transaksi kasir QRIS otomatis displit 80% ke rekening kedai, 15% ke investor, dan 5% ke pemilik ruko tanpa risiko penipuan.
              </p>
            </div>
          </div>
        </section>

        {/* 5.5. FITUR AUDIT PARTISIPATIF PELANGGAN (ISSUE #34) */}
        <section id="customer-rebate" className="pt-2">
          <CustomerRebateScanner />
        </section>

        {/* 6. CONSOLE AKSES MASUK STAKEHOLDER (5 ROLE PORTALS) */}
        <section id="portal-sistem" className="space-y-6 pt-6 scroll-mt-24">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-mono">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              Console Sistem Berdasarkan Hak Akses
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Pilih Portal Sesuai Peran Anda
            </h2>
            <p className="text-xs text-white/50 max-w-xl mx-auto">
              Masuk langsung ke antarmuka operasional peran yang telah terhubung ke simulator keuangan reaktif 24 bulan.
            </p>
          </div>

          {/* 5 Distinct Cards for Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.href}
                className="group p-5 rounded-2xl border border-white/10 bg-[#121212] hover:border-white/20 hover:bg-[#161616] transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        card.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : card.color === "blue"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : card.color === "amber"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : card.color === "purple"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{card.icon}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/50 bg-white/5">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-1.5">
                      {card.role}
                      <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-white/40">{card.sub}</p>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-white transition">
                  <span>Buka Console {card.role}</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_right_alt</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. PUBLIC FOOTER */}
        <footer className="pt-12 border-t border-white/10 text-center text-xs font-mono text-white/40 space-y-2">
          <p>Euthial · Verifiable Revenue-Based Financing for Commercial Shop-house (Ruko) Fit-outs</p>
          <p className="text-[11px] text-white/20">
            Ethereum Jakarta 2026 Hackathon · Target Implementasi Pilot: Jember, Jawa Timur
          </p>
        </footer>
      </main>
    </div>
  );
}
