"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../../components/layout/Shell";
import { MaterialIcon } from "../../../components/ui/MaterialIcon";
import { useProtocol } from "../../../context/ProtocolContext";
import { useWeb3 } from "../../../context/Web3Context";
import { TxLink } from "../../../components/ui/TxLink";
import { AddressBadge } from "../../../components/ui/AddressBadge";
import { RukoShowcaseCard } from "../../../components/marketplace/RukoShowcaseCard";
import { toast } from "../../../components/ui/Toast";

export default function DealOverviewPage({ params }: { params: { id: string } }) {
  const { currentMonth, seniorRepaid, seniorClaimCap, milestones, covenantStatus } = useProtocol();
  const { networkConfig } = useWeb3();

  const [activeTab, setActiveTab] = useState<"showcase" | "timeline" | "financials" | "stakeholders">("showcase");

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const stages = [
    { key: "FUNDRAISING", label: "FUNDRAISING", status: "completed", desc: "Rp 150M terkumpul penuh" },
    { key: "BUILDING", label: "BUILDING / FIT-OUT", status: "completed", desc: "Termin 1–3 selesai 100%" },
    { key: "OPERATING", label: "LIVE OPERATING", status: "active", desc: `Bulan ${currentMonth} dari 24 Bulan` },
    { key: "RESIDUAL", label: "RESIDUAL SURPLUS", status: "upcoming", desc: "Setelah Senior 1.25x lunas" },
    { key: "CLOSED", label: "DEAL COMPLETED", status: "upcoming", desc: "Hak milik ruko kembali penuh" },
  ];

  const timelineEvents = [
    {
      date: "1 Okt 2026",
      title: "Kesepakatan Fit-Out Didaftarkan On-Chain",
      desc: "Pemilik ruko dan pengelola UMKM meratifikasi perjanjian sewa bagi hasil.",
      actor: "Landlord (0x7099...)",
      type: "CONTRACT_CREATED",
      txHash: "0x3f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    },
    {
      date: "3 Okt 2026",
      title: "Setoran Modal Senior Tranche (Rp 120.000.000)",
      desc: "Konsorsium investor menyetor likuiditas ke SeniorVault ERC-4626.",
      actor: "Senior Investor (0xf39F...)",
      type: "CAPITAL_INJECTED",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    },
    {
      date: "5 Okt 2026",
      title: "Uang Jaminan (Bond) Rp 37.500.000 Terkunci di Escrow",
      desc: "Penyewa menyetor 3 bulan sewa jaminan ke smart contract.",
      actor: "Tenant (0x90F7...)",
      type: "BOND_DEPOSITED",
      txHash: "0x9876543210abcdef0123456789abcdef01234567",
    },
    {
      date: "12 Okt 2026",
      title: "Pencairan Termin #1: Demolisi & Struktur Sipil",
      desc: "2-of-3 Multisig disetujui (Landlord + Inspector). Rp 45M dicairkan ke Kontraktor.",
      actor: "Multisig Escrow",
      type: "MILESTONE_RELEASED",
      txHash: "0xabcdef0123456789abcdef0123456789abcdef01",
    },
    {
      date: "25 Okt 2026",
      title: "Pencairan Termin #2: Instalasi MEP & Listrik 3-Fasa",
      desc: "Verifikasi hash IPFS bukti foto lapangan berhasil divalidasi.",
      actor: "Multisig Escrow",
      type: "MILESTONE_RELEASED",
      txHash: "0x5566778899001122334455667788990011223344",
    },
    {
      date: "1 Nov 2026",
      title: "Toko Resmi Beroperasi (Grand Opening)",
      desc: "Integrasi QRIS live. Protokol waterfall 80:15:5 mulai memproses settlement harian.",
      actor: "Euthial Protocol Engine",
      type: "OPERATING_START",
      txHash: "0x778899aabbccddeeff00112233445566778899aa",
    },
  ];

  const seniorPct = Math.min(100, Math.round((seniorRepaid / seniorClaimCap) * 100));

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A]">
            <Link href="/profile" className="hover:text-blue-500">Deals</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Deal Pilot #01</span>
            <span>·</span>
            <span className="text-emerald-500">Ruko Fatmawati Jakarta</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tools/coverage-check"
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 flex items-center gap-1.5"
            >
              <MaterialIcon name="calculate" size={15} />
              Kalkulator Simulasi
            </Link>

            <Link
              href="/demo"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
            >
              <MaterialIcon name="tune" size={15} />
              Mission Control
            </Link>
          </div>
        </div>

        {/* Deal Header Hero */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Ruko Komersial Fatmawati Blok B-08
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  LIVE OPERATING
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  24 BULAN TENOR
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] font-mono">
                Jl. RS Fatmawati No. 88, Cilandak, Jakarta Selatan · Pilot #01 · Smart Contract: {networkConfig.contracts.fitOutAgreement.slice(0, 16)}...
              </p>
            </div>

            <div className="flex items-center gap-4 text-right shrink-0">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-slate-400 block">Total Capex</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {formatIDR(150_000_000)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono text-slate-400 block">Pelunasan Senior</span>
                <span className="text-base font-bold font-mono text-emerald-500">
                  {seniorPct}% ({formatIDR(seniorRepaid)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Life-cycle Visual Stage Stepper (Issue #68 requirement) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MaterialIcon name="timeline" size={18} className="text-blue-500" />
              Siklus Hidup Kesepakatan (Deal Lifecycle)
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Tahap Aktif: <strong className="text-emerald-500">OPERATING (Bulan {currentMonth}/24)</strong>
            </span>
          </div>

          {/* Stages Horizontal Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {stages.map((st, idx) => (
              <div
                key={st.key}
                className={`p-3.5 rounded-xl border relative transition-all ${
                  st.status === "completed"
                    ? "bg-emerald-50/20 dark:bg-emerald-950/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : st.status === "active"
                    ? "bg-blue-50/30 dark:bg-blue-950/20 border-blue-500/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "bg-slate-50/50 dark:bg-zinc-900/30 border-slate-200/60 dark:border-zinc-800 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">TAHAP 0{idx + 1}</span>
                  <span className="material-symbols-outlined text-sm">
                    {st.status === "completed"
                      ? "check_circle"
                      : st.status === "active"
                      ? "pending"
                      : "radio_button_unchecked"}
                  </span>
                </div>
                <div className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                  {st.label}
                </div>
                <div className="text-[11px] opacity-80 mt-1 truncate">
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Selector: Showcase vs Timeline vs Stakeholders */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-800 pb-1">
          <button
            onClick={() => setActiveTab("showcase")}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "showcase"
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MaterialIcon name="storefront" size={16} />
            Visual 3D Fit-Out & Simulasi ROI
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "timeline"
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MaterialIcon name="history" size={16} />
            Riwayat Kronologis (Events Timeline)
          </button>

          <button
            onClick={() => setActiveTab("stakeholders")}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "stakeholders"
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MaterialIcon name="group" size={16} />
            Pemangku Kepentingan On-Chain
          </button>
        </div>

        {/* Tab 0: Visual Showcase & ROI Simulator */}
        {activeTab === "showcase" && (
          <RukoShowcaseCard
            onInvestClick={(tranche, amount) => {
              toast.success(
                "Simulasi Investasi Berhasil!",
                `Alokasi Rp ${amount.toLocaleString("id-ID")} ke ${tranche} Tranche disimulasikan.`
              );
            }}
          />
        )}

        {/* Tab 1: Chronological Events Timeline */}
        {activeTab === "timeline" && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-black flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/70 dark:border-zinc-800/80 bg-slate-50/40 dark:bg-zinc-900/30 hover:border-blue-500/40 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {ev.date} · {ev.type}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {ev.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <TxLink hash={ev.txHash} type="tx" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      {ev.desc}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
                      <MaterialIcon name="person" size={14} />
                      Pelaku: <span>{ev.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Stakeholders Matrix */}
        {activeTab === "stakeholders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-500">LANDLORD (PEMILIK RUKO)</span>
                <MaterialIcon name="real_estate_agent" size={20} className="text-blue-500" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Bapak H. Suryanto
              </div>
              <p className="text-xs text-slate-500">
                Pemilik sertifikat SHM ruko. Menyetujui renovasi dan menerima junior tranche + turnover rent.
              </p>
              <div className="pt-2">
                <AddressBadge address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" roleLabel="LANDLORD" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-500">SENIOR INVESTORS</span>
                <MaterialIcon name="trending_up" size={20} className="text-emerald-500" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Konsorsium RWA Capital Jakarta
              </div>
              <p className="text-xs text-slate-500">
                Penyedia dana 80% Capex (Rp 120M). Pemegang token svIDR (Senior Vault ERC-4626).
              </p>
              <div className="pt-2">
                <AddressBadge address={networkConfig.contracts.seniorVault} roleLabel="SENIOR VAULT" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-500">TENANT OPERATOR</span>
                <MaterialIcon name="storefront" size={20} className="text-amber-500" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Kopi Kenangan Nusantara
              </div>
              <p className="text-xs text-slate-500">
                Pengelola gerai F&B. Menyetor bond jaminan dan menyalurkan revenue share via QRIS settlement.
              </p>
              <div className="pt-2">
                <AddressBadge address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" roleLabel="TENANT" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-500">INSPEKTUR TEKNIS</span>
                <MaterialIcon name="fact_check" size={20} className="text-purple-500" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                PT Surveyor Geodesi Mandiri
              </div>
              <p className="text-xs text-slate-500">
                Pihak audit fisik independen. Menandatangani persetujuan termin dan upload hash bukti IPFS.
              </p>
              <div className="pt-2">
                <AddressBadge address="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" roleLabel="INSPEKTUR" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-600">KONTRAKTOR PELAKSANA</span>
                <MaterialIcon name="construction" size={20} className="text-amber-600" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                PT Ruko Karya Mandiri
              </div>
              <p className="text-xs text-slate-500">
                Pelaksana renovasi fit-out ruko. Penerima dana termin langsung dari escrow contract.
              </p>
              <div className="pt-2">
                <AddressBadge address="0x90F79bf6EB2c4f870365E785982E1f101E93b906" roleLabel="KONTRAKTOR" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
