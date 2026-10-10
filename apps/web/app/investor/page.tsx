"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { WaterfallVisualizer } from "../../components/waterfall/WaterfallVisualizer";
import { ActionCenter } from "../../components/ui/ActionCenter";
import { InteractiveTour } from "../../components/tour/InteractiveTour";
import { INVESTOR_TOUR_STEPS } from "../../components/tour/tour-steps";
import { RukoShowcaseCard } from "../../components/marketplace/RukoShowcaseCard";
import { toast } from "../../components/ui/Toast";

export default function InvestorPortalPage() {
  const {
    currentMonth,
    activeScenario,
    seniorRepaid,
    seniorClaimCap,
    idleCashSenior,
    juniorRepaid,
    juniorClaimCap,
    covenantStatus,
    auditLogs,
  } = useProtocol();

  const web3 = useWeb3();
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

  // Constants based on 02_ECONOMIC_MODEL.md
  const SENIOR_PRINCIPAL = 120_000_000; // Rp 120 Juta (80% Capex)
  const TARGET_MULTIPLE = 1.25;
  const seniorProgressPct = Math.min(100, Math.round((seniorRepaid / seniorClaimCap) * 100));
  const remainingClaim = Math.max(0, seniorClaimCap - seniorRepaid);
  const isSeniorCompleted = seniorRepaid >= seniorClaimCap;

  // Formatter
  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleWithdraw = async () => {
    if (idleCashSenior <= 0 || isWithdrawing) return;
    setIsWithdrawing(true);
    const amount = idleCashSenior;
    try {
      await web3.withdrawSeniorCash(amount);
      setWithdrawSuccessMsg(`Berhasil menarik ${formatIDR(amount)} ke dompet investor!`);
      setTimeout(() => setWithdrawSuccessMsg(null), 5000);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Filter audit logs relevant to payouts & senior tranche
  const investorLogs = auditLogs
    .filter(
      (log) =>
        log.eventName.toLowerCase().includes("tranche") ||
        log.eventName.toLowerCase().includes("penarikan") ||
        log.eventName.toLowerCase().includes("setoran") ||
        log.eventName.toLowerCase().includes("distribusi") ||
        log.eventName.toLowerCase().includes("investor")
    )
    .slice(0, 6);

  return (
    <Shell>
      <div className="space-y-6">
        {/* Action Center - Urgent & Pending Alerts (#88) */}
        <ActionCenter />

        {/* Guided Tour for Guest & Judges */}
        <InteractiveTour steps={INVESTOR_TOUR_STEPS} tourKey="investor_tour" />

        {/* E-Commerce Showcase: Deal Discovery & Live ROI Simulator */}
        <RukoShowcaseCard
          onInvestClick={(tranche, amount) => {
            toast.success(
              "Simulasi Investasi Berhasil!",
              `Deposit Rp ${amount.toLocaleString("id-ID")} dialokasikan ke ${tranche} Tranche.`
            );
          }}
        />

        {/* 1. Context Banner (Consistent with /tenant) */}
        <div className="p-4 sm:p-5 rounded-card bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10 shrink-0">
              <MaterialIcon name="trending_up" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Portal Investor Senior: FitOut Capital Tranche A
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10">
                  SENIOR TRANCHE (80% CAPEX)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5 font-mono">
                Ruko Komersial Sentra #01 · Hak Prioritas #1 (1.25x Cap) · Bulan {currentMonth}/24
              </p>
            </div>
          </div>

          {/* Status Capsule */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0A0A0A] px-3.5 py-2 rounded-md border border-slate-200/80 dark:border-white/10 shrink-0 self-start md:self-center">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Status Tranche:</span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSeniorCompleted ? "bg-emerald-500" : "bg-emerald-500"
                }`}
              />
              <span>{isSeniorCompleted ? "SENIOR 100% LUNAS" : "WATERFALL AKTIF (15%)"}</span>
            </span>
          </div>
        </div>

        {/* Withdrawal Success Alert Banner */}
        {withdrawSuccessMsg && (
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white text-xs flex items-center justify-between animate-fadeIn font-mono">
            <div className="flex items-center gap-2">
              <MaterialIcon name="check_circle" size={16} className="text-slate-700 dark:text-zinc-300" />
              <span className="font-medium">{withdrawSuccessMsg}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-white/40">
              {web3.lastTxHash ? `TX: ${web3.lastTxHash.slice(0, 10)}...` : "ON-CHAIN CONFIRMED"}
            </span>
          </div>
        )}

        {/* 2. 4 Primary Operational Metric Cards (Consistent with /tenant) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Pokok Investasi Senior */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">POKOK INVESTASI (80%)</span>
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                Tranche A
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(SENIOR_PRINCIPAL)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              Target Cap (1.25x): {formatIDR(seniorClaimCap)}
            </span>
          </div>

          {/* Card 2: Realisasi Pengembalian */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">REALISASI PENGEMBALIAN</span>
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                {seniorProgressPct}%
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(seniorRepaid)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 mt-1.5 overflow-hidden border border-transparent dark:border-white/10">
              <div
                className="bg-slate-900 dark:bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${seniorProgressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono block mt-1">
              Sisa Target: {formatIDR(remainingClaim)}
            </span>
          </div>

          {/* Card 3: Sisa Hak Klaim Waterfall */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">SISA HAK KLAIM WATERFALL</span>
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                {isSeniorCompleted ? "LUNAS" : "PRIORITAS #1"}
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(remainingClaim)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#71717A] font-mono">
              {isSeniorCompleted
                ? "Semua hak klaim telah terpenuhi 100%"
                : "Menyerap 15% omzet QRIS bulanan"}
            </span>
          </div>

          {/* Card 4: Kas Vault Siap Ditarik */}
          <div className="bg-white dark:bg-black p-4 rounded-card border border-slate-200/90 dark:border-white/10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">KAS VAULT SIAP DITARIK</span>
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">
                ERC-4626
              </span>
            </div>
            <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
              {formatIDR(idleCashSenior)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
              {idleCashSenior > 0 ? "✓ Tersedia untuk klaim wallet" : "✓ Kas telah ditarik ke wallet"}
            </span>
          </div>
        </div>

        {/* 3. Interactive Action & Parameter Widgets (2 Columns, like /tenant) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card A: On-Chain Vault Withdrawal Desk */}
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
              <MaterialIcon name="account_balance_wallet" size={15} className="text-slate-700 dark:text-zinc-300" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Penarikan Dividen On-Chain (Senior Vault Desk)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8A8A8A] leading-relaxed">
              Tarik akumulasi pembagian hasil 15% omzet QRIS yang telah dialirkan oleh smart contract ke saldo ERC-4626 Senior Vault Anda secara instan.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-[#0D0D0F] rounded-md border border-slate-200/80 dark:border-[rgba(207,207,207,0.06)] space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-[#71717A]">Saldo Siap Tarik:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {formatIDR(idleCashSenior)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 dark:text-[#71717A]">Wallet Investor:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {web3.address ? `${web3.address.slice(0, 6)}...${web3.address.slice(-4)}` : "0x7099...79C8 (Mocked)"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500 dark:text-[#71717A]">Mekanisme Smart Contract:</span>
                <span className="text-slate-700 dark:text-zinc-300 font-medium">ERC-4626 redeem()</span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleWithdraw}
                disabled={idleCashSenior <= 0 || isWithdrawing}
                className={`flex-1 py-2.5 px-4 rounded-md text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all shadow-sm ${
                  idleCashSenior > 0 && !isWithdrawing
                    ? "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black cursor-pointer active:scale-[0.99]"
                    : "bg-slate-100 dark:bg-[#1E1E22] text-slate-400 dark:text-[#52525B] border border-slate-200/80 dark:border-[rgba(207,207,207,0.06)] cursor-not-allowed"
                }`}
              >
                <MaterialIcon name="savings" size={15} />
                <span>
                  {isWithdrawing
                    ? "Memproses Penarikan..."
                    : idleCashSenior > 0
                    ? `Tarik ${formatIDR(idleCashSenior)} ke Wallet`
                    : "Kas Telah Ditarik ke Wallet"}
                </span>
              </button>
            </div>
          </div>

          {/* Card B: Parameter Kontrak & Status Covenant */}
          <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
                <MaterialIcon name="gavel" size={18} className="text-slate-700 dark:text-zinc-300" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Parameter Kontrak & Covenant Proteksi
                </h2>
              </div>
              
              <div className="mt-3 space-y-2 text-xs font-mono divide-y divide-slate-100 dark:divide-[rgba(207,207,207,0.06)]">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Alokasi Arus Kas:</span>
                  <span className="text-slate-900 dark:text-white font-medium">15% Omzet Kasir QRIS</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Batas Maksimal (Cap):</span>
                  <span className="text-slate-900 dark:text-white font-medium">1.25x (Rp 150.000.000)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Status Covenant:</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {covenantStatus} (Threshold Min: 2.0x)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Bantalan Proteksi:</span>
                  <span className="text-slate-700 dark:text-slate-300">Junior Buffer 20% + Bond Rp 15M</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#8A8A8A]">Token Standar:</span>
                  <span className="text-slate-500 dark:text-slate-400">ERC-4626 Vault Share</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/demo"
                className="w-full py-2 px-3.5 rounded-md bg-slate-100 dark:bg-[#27272A] hover:bg-slate-200 dark:hover:bg-[#323238] text-slate-800 dark:text-white text-xs font-semibold font-mono flex items-center justify-center gap-2 border border-slate-200/80 dark:border-[rgba(207,207,207,0.12)] transition-colors shadow-xs"
              >
                <MaterialIcon name="tune" size={15} />
                <span>Uji Skenario Stres di Jury Deck</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Structural Protection & First-Loss Subordination */}
        <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
            <MaterialIcon name="shield" size={18} className="text-slate-700 dark:text-zinc-300" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Mekanisme Proteksi Senior & Subordinasi First-Loss
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                Modal Anda dilindungi secara terstruktur oleh subordinasi modal junior pemilik ruko dan dana jaminan escrow.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Senior Tranche Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    SENIOR TRANCHE (Anda)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded font-medium">
                  PRIORITAS #1
                </span>
              </div>
              <div className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                Pokok Rp 120M &rarr; Cap Rp 150M (1.25x)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                Semua arus kas 15% dari omzet kedai dialirkan terlebih dahulu 100% untuk Anda sampai target Rp 150M tercapai.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-500">Status:</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {isSeniorCompleted ? "100% LUNAS" : `${seniorProgressPct}% Terbayar`}
                </span>
              </div>
            </div>

            {/* Junior Tranche Card */}
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-zinc-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    JUNIOR TRANCHE (Landlord)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded font-medium">
                  SUBORDINASI #2
                </span>
              </div>
              <div className="text-sm font-mono font-semibold text-slate-900 dark:text-white">
                Pokok Rp 30M &rarr; Cap Rp 42M (1.40x)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                <strong>First-Loss Buffer 20%:</strong> Pemilik ruko tidak menerima pembagian waterfall sepeser pun sebelum Senior Tranche selesai 100%.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-500">Terbayar:</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {formatIDR(juniorRepaid)} / {formatIDR(juniorClaimCap)}
                </span>
              </div>
            </div>
          </div>

          {/* Standby Deposit Bond Card */}
          <div className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <MaterialIcon name="lock" size={18} className="text-slate-700 dark:text-zinc-300" />
              <div>
                <span className="text-slate-800 dark:text-white font-medium">Security Deposit Escrow (Rp 15 Juta)</span>
                <p className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">
                  Jika omzet kedai anjlok di bawah floor covenant, dana jaminan ini otomatis ditarik untuk menambal shortfall imbal hasil Senior.
                </p>
              </div>
            </div>
            <span className="font-mono text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-[11px] font-medium">
              STANDBY AKTIF
            </span>
          </div>
        </div>

        {/* 5. Interactive Waterfall Split Visualizer */}
        <WaterfallVisualizer />

        {/* 6. On-Chain Payout & Distribution Audit Feed */}
        <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-card p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[rgba(207,207,207,0.06)]">
            <div className="flex items-center gap-2">
              <MaterialIcon name="history" size={18} className="text-slate-400 dark:text-[#8A8A8A]" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Log Distribusi Dana & Penarikan On-Chain
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">
              Verifikasi Mutasi Bank & Vault
            </span>
          </div>

          {investorLogs.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/5 text-center text-xs text-slate-400 dark:text-white/40 font-mono">
              Belum ada catatan transaksi distribusi untuk bulan ini.
            </div>
          ) : (
            <div className="space-y-2">
              {investorLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0 bg-slate-400 dark:bg-zinc-500" />
                    <div>
                      <div className="font-mono text-slate-900 dark:text-white font-medium">{log.eventName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">{log.details}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono shrink-0 ml-4">
                    <div className="text-slate-700 dark:text-white/70 font-semibold">Bulan {log.month}</div>
                    <div className="text-[10px] text-slate-400 dark:text-[#71717A]">{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
