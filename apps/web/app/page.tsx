"use client";

import React from "react";
import Link from "next/link";
import { Shell } from "../components/layout/Shell";
import { MaterialIcon } from "../components/ui/MaterialIcon";
import { useProtocol } from "../context/ProtocolContext";

interface PortalCardProps {
  href: string;
  roleTitle: string;
  roleBadge: string;
  badgeColor: string;
  iconName: string;
  iconColor: string;
  description: string;
  metrics: { label: string; value: string }[];
  ctaLabel: string;
}

const PortalCard: React.FC<PortalCardProps> = ({
  href,
  roleTitle,
  roleBadge,
  badgeColor,
  iconName,
  iconColor,
  description,
  metrics,
  ctaLabel,
}) => {
  return (
    <div className="bg-[#141414] border border-[rgba(207,207,207,0.10)] hover:border-[rgba(207,207,207,0.25)] rounded-card p-5 flex flex-col justify-between transition-all duration-200 group hover:bg-[#18181C]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[rgba(207,207,207,0.06)]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-md bg-[#1E1E22] border border-[rgba(207,207,207,0.08)] ${iconColor}`}>
              <MaterialIcon name={iconName} size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {roleTitle}
              </h3>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded mt-0.5 inline-block ${badgeColor}`}>
                {roleBadge}
              </span>
            </div>
          </div>
          <MaterialIcon
            name="arrow_forward"
            size={16}
            className="text-[#52525B] group-hover:text-white transition-colors"
          />
        </div>

        {/* Description */}
        <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed">
          {description}
        </p>

        {/* Snapshot Metrics */}
        <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-[#0D0D0F] rounded-md border border-[rgba(207,207,207,0.05)]">
          {metrics.map((m, idx) => (
            <div key={idx}>
              <span className="text-[10px] text-[#71717A] block font-mono">{m.label}</span>
              <span className="text-xs font-mono font-bold text-[#E4E4E7]">{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enter Button */}
      <Link
        href={href}
        className="w-full mt-2 py-2 px-3 bg-[#27272A] hover:bg-blue-600 hover:text-white text-xs font-semibold text-[#D4D4D8] rounded-md border border-[rgba(207,207,207,0.10)] flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <span>{ctaLabel}</span>
        <MaterialIcon name="login" size={14} />
      </Link>
    </div>
  );
};

export default function HomePage() {
  const { currentMonth, activeScenario, covenantStatus, grossMonthly, bondBalance } = useProtocol();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Hero Context Banner */}
        <div className="p-5 rounded-card bg-[#141414] border border-[rgba(207,207,207,0.10)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h1 className="text-base font-bold text-white tracking-tight">
                Euthial (FitOut Protocol) · Portal Selector Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                OPERATING
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] max-w-3xl leading-relaxed">
              Verifiable Revenue-Based Financing untuk renovasi ruko komersial. Pilih portal aktor di bawah untuk masuk ke ruang kerja terdedikasi sesuai peran masing-masing.
            </p>
          </div>

          {/* Quick Global State Capsule */}
          <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-md border border-[rgba(207,207,207,0.08)] shrink-0 font-mono text-xs">
            <div>
              <span className="text-[10px] text-[#71717A] block">SIMULASI AKTIF</span>
              <span className="text-white font-bold">Bulan ke-{currentMonth} (Hari {currentMonth * 30})</span>
            </div>
            <div className="h-6 w-px bg-[rgba(207,207,207,0.10)]" />
            <div>
              <span className="text-[10px] text-[#71717A] block">SKENARIO</span>
              <span className="text-amber-400 font-bold">{activeScenario}</span>
            </div>
            <div className="h-6 w-px bg-[rgba(207,207,207,0.10)]" />
            <div>
              <span className="text-[10px] text-[#71717A] block">COVENANT</span>
              <span className={covenantStatus === "HEALTHY" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {covenantStatus}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Portal Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-[#8A8A8A] uppercase tracking-wider">
            PILIH PORTAL AKSES PERAN TERDEDIKASI:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Tenant Portal */}
            <PortalCard
              href="/tenant"
              roleTitle="Penyewa Kedai (Tenant)"
              roleBadge="MERCHANT OPS"
              badgeColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              iconName="storefront"
              iconColor="text-emerald-400"
              description="Kelola arus kas bersih kedai (80%), pantau kepatuhan omzet kasir QRIS harian, dan lindungi saldo uang jaminan sewa."
              metrics={[
                { label: "KAS BERSIH TOKO", value: "80% Omzet" },
                { label: "UANG JAMINAN (BOND)", value: formatIDR(bondBalance) },
              ]}
              ctaLabel="Masuk Portal Tenant"
            />

            {/* 2. Investor Portal */}
            <PortalCard
              href="/investor"
              roleTitle="Investor Senior"
              roleBadge="TIER-1 YIELD"
              badgeColor="bg-blue-500/10 text-blue-400 border border-blue-500/20"
              iconName="trending_up"
              iconColor="text-blue-400"
              description="Pantau pemulihan pokok modal (80% Capex), target imbal hasil 1.25x cap, dan tarik kas settlement cair di Senior Vault."
              metrics={[
                { label: "TARGET MULTIPLE", value: "1.25x (Rp 150M)" },
                { label: "PRIORITAS PEMBAYARAN", value: "Tier-1 Senior" },
              ]}
              ctaLabel="Masuk Portal Investor"
            />

            {/* 3. Landlord Portal */}
            <PortalCard
              href="/landlord"
              roleTitle="Pemilik Ruko (Landlord)"
              roleBadge="ASET & SEWA"
              badgeColor="bg-purple-500/10 text-purple-400 border border-purple-500/20"
              iconName="real_estate_agent"
              iconColor="text-purple-400"
              description="Awasi aset fisik ruko di Jember, terima sewa variabel turnover rent 5% tanpa henti, dan setujui termin renovasi ruko."
              metrics={[
                { label: "TURNOVER RENT", value: "5% Berkelanjutan" },
                { label: "MODAL JUNIOR", value: "20% (1.40x Cap)" },
              ]}
              ctaLabel="Masuk Portal Pemilik Ruko"
            />

            {/* 4. Inspector Portal */}
            <PortalCard
              href="/inspector"
              roleTitle="Inspektur & Kontraktor"
              roleBadge="2-OF-3 CAPEX"
              badgeColor="bg-amber-500/10 text-amber-400 border border-amber-500/20"
              iconName="engineering"
              iconColor="text-amber-400"
              description="Verifikasi progres fisik renovasi ruko, input hash dokumentasi lapangan, dan tandatangani rilis termin dana escrow."
              metrics={[
                { label: "TOTAL TERMIN", value: "3 Termin (Rp 150M)" },
                { label: "KONSENSUS MULTISIG", value: "2 dari 3 Pihak" },
              ]}
              ctaLabel="Masuk Portal Inspektur"
            />

            {/* 5. Jury Demo Deck */}
            <PortalCard
              href="/demo"
              roleTitle="Jury Mission Control"
              roleBadge="STRESS TEST ARENA"
              badgeColor="bg-red-500/10 text-red-400 border border-red-500/20"
              iconName="play_circle"
              iconColor="text-red-400"
              description="Pusat kendali demonstrasi juri: jalankan mesin waktu 24 bulan, uji skenario ekstrem (S1/S4/S6), dan periksa audit log on-chain."
              metrics={[
                { label: "SIMULASI WAKTU", value: "Maju +30 Hari" },
                { label: "SKENARIO EKSTREM", value: "S1 · S4 · S6" },
              ]}
              ctaLabel="Masuk Arena Demo Juri"
            />
          </div>
        </div>

        {/* Regulatory & Architecture Notice Footer */}
        <div className="p-4 rounded-card bg-[#141414] border border-[rgba(207,207,207,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A8A8A] font-mono">
          <div>
            <span className="text-white font-semibold">Mode B (Regulated Rails):</span> Pembayaran pelanggan tetap 100% Rupiah via QRIS Bank Indonesia berizin.
          </div>
          <div className="text-[11px] text-[#71717A]">
            Agreement ID: AGR-JBR-001 · Sepolia Testnet
          </div>
        </div>
      </div>
    </Shell>
  );
}
