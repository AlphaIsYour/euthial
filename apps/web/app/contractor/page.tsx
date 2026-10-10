"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { ActionCenter } from "../../components/ui/ActionCenter";
import { AddressBadge } from "../../components/ui/AddressBadge";
import { TxLink } from "../../components/ui/TxLink";
import { InteractiveTour } from "../../components/tour/InteractiveTour";
import { CONTRACTOR_TOUR_STEPS } from "../../components/tour/tour-steps";

export default function ContractorPortalPage() {
  const { milestones, currentMonth } = useProtocol();
  const { networkConfig, address } = useWeb3();

  const [activeTab, setActiveTab] = useState<"milestones" | "payouts">("milestones");

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const totalCapex = milestones.reduce((acc, m) => acc + m.amount, 0);
  const releasedCapex = milestones
    .filter((m) => m.status === "RELEASED")
    .reduce((acc, m) => acc + m.amount, 0);
  const pendingCapex = totalCapex - releasedCapex;
  const progressPct = Math.round((releasedCapex / totalCapex) * 100);

  const CONTRACTOR_WALLET = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

  return (
    <Shell>
      <div className="space-y-6">
        {/* Action Center */}
        <ActionCenter />

        {/* Guided Tour for Contractor Portal */}
        <InteractiveTour steps={CONTRACTOR_TOUR_STEPS} tourKey="contractor_tour" />

        {/* 1. Context Banner */}
        <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-black border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
              <MaterialIcon name="construction" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal Kontraktor & Pelaksana Renovasi
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  CONTRACTOR RECIPIENT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                PT Ruko Karya Mandiri · Penerima Termin Fisik 2-of-3 Multisig Escrow · Bulan {currentMonth}/24
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A0A] px-3.5 py-2 rounded-md border border-slate-200/80 dark:border-white/10 shrink-0 self-start md:self-center">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Rekening Penerima:</span>
            <AddressBadge address={CONTRACTOR_WALLET} roleLabel="KONTRAKTOR" />
          </div>
        </div>

        {/* 2. Top Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-black shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-[#8A8A8A] font-medium">Total Anggaran Renovasi</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatIDR(totalCapex)}
            </div>
            <span className="text-[10px] font-mono text-slate-400">4 Termin Pekerjaan</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-xs">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Dana Termin Dicairkan</span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {formatIDR(releasedCapex)}
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">{progressPct}% dari total kontrak</span>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 shadow-xs">
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Dana Escrow Tertahan</span>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {formatIDR(pendingCapex)}
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">Menunggu verifikasi fisik</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-black shadow-xs">
            <span className="text-[11px] text-slate-500 dark:text-[#8A8A8A] font-medium">Aturan Pencairan Dana</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">2-of-3</span> Multisig
            </div>
            <span className="text-[10px] font-mono text-slate-400">Landlord + Inspector + Tenant</span>
          </div>
        </div>

        {/* 3. Milestones Timeline & Status Card */}
        <div id="tour-milestone-stages" className="p-5 sm:p-6 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-black shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                Daftar Termin Renovasi & Progres Persetujuan
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  ESCROW CONTROL
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                Dana ditransfer langsung dari smart contract ke wallet kontraktor tanpa perantara pihak ketiga.
              </p>
            </div>
          </div>

          <div id="tour-evidence-upload" className="space-y-3">
            {milestones.map((m) => {
              const approvalCount = [m.approvals.landlord, m.approvals.inspector, m.approvals.tenant].filter(Boolean).length;
              const isReady = approvalCount >= 2;
              const isReleased = m.status === "RELEASED";

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isReleased
                      ? "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/20"
                      : isReady
                      ? "bg-blue-50/20 dark:bg-blue-950/10 border-blue-500/20"
                      : "bg-slate-50/50 dark:bg-[#0A0A0A] border-slate-200/70 dark:border-white/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Termin #{m.id}: {m.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isReleased
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : isReady
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                              : "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400"
                          }`}
                        >
                          {isReleased ? "DANA CAIR (RELEASED)" : isReady ? "SIAP CAIR (2/3 VOTED)" : "MENUNGGU VERIFIKASI"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        Nilai Termin: <strong>{formatIDR(m.amount)}</strong> · Evidence Hash: {m.evidenceHash.slice(0, 16)}...
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 2-of-3 Signature Checklist */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span
                          className={`px-2 py-1 rounded border flex items-center gap-1 ${
                            m.approvals.landlord
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400"
                          }`}
                          title="Persetujuan Pemilik Ruko"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {m.approvals.landlord ? "check_circle" : "hourglass_empty"}
                          </span>
                          Landlord
                        </span>

                        <span
                          className={`px-2 py-1 rounded border flex items-center gap-1 ${
                            m.approvals.inspector
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400"
                          }`}
                          title="Verifikasi Fisik Inspektur"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {m.approvals.inspector ? "check_circle" : "hourglass_empty"}
                          </span>
                          Inspektur
                        </span>

                        <span
                          className={`px-2 py-1 rounded border flex items-center gap-1 ${
                            m.approvals.tenant
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400"
                          }`}
                          title="Konfirmasi Pengelola Toko"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {m.approvals.tenant ? "check_circle" : "hourglass_empty"}
                          </span>
                          Penyewa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Anti-Corruption Protocol Guarantee */}
        <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-950/15 border border-blue-500/20 text-xs font-mono text-slate-700 dark:text-zinc-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-sm">security</span>
            Jaminan Proteksi Anti-Fraud & Anti-Kolusi
          </div>
          <p className="leading-relaxed opacity-90">
            Sesuai arsitektur protokol Euthial: Kontraktor tidak memiliki hak suara voting untuk menghindari conflict of interest.
            Pencairan dana otomatis terkunci di smart contract sampai setidaknya 2 dari 3 stakeholder independen (Pemilik Ruko, Inspektur Lapangan, Penyewa) membubuhkan tanda tangan kriptografis.
          </p>
        </div>
      </div>
    </Shell>
  );
}
