"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shell } from "../../components/layout/Shell";
import { MaterialIcon } from "../../components/ui/MaterialIcon";
import { useWeb3 } from "../../context/Web3Context";
import { useProtocol } from "../../context/ProtocolContext";
import { TxLink } from "../../components/ui/TxLink";
import { AddressBadge } from "../../components/ui/AddressBadge";

export default function UserProfilePage() {
  const { address, isWalletConnected, disconnectWallet, networkConfig, isSepolia } = useWeb3();
  const { currentMonth } = useProtocol();

  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("INVESTOR");
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("Raditya Pratama");

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const userDeals = [
    {
      id: "deal-ruko-01",
      name: "Ruko Commercial Fatmawati Jakarta Selatan",
      unit: "Blok B-08 (3 Lantai)",
      role: selectedRole,
      status: "LIVE_OPERATING",
      capex: 150_000_000,
      monthlyFloor: 12_500_000,
      contractAddress: networkConfig.contracts.fitOutAgreement,
      progressPct: 65,
    },
    {
      id: "deal-ruko-02",
      name: "Ruko Sentra Bisnis BSD City Tangerang",
      unit: "Blok A-12 (2 Lantai)",
      role: selectedRole,
      status: "ACTIVE_FITOUT",
      capex: 180_000_000,
      monthlyFloor: 15_000_000,
      contractAddress: "0x3344556677889900112233445566778899001122",
      progressPct: 25,
    },
  ];

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A]">
            <Link href="/demo" className="hover:text-blue-500">Platform</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">User Profile & Wallet</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              EIP-4361 VERIFIED
            </span>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              {/* Dynamic Identicon / Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-black flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl text-blue-500">
                    account_balance_wallet
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="px-2 py-1 text-lg font-bold rounded border bg-slate-50 dark:bg-zinc-900 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="px-2.5 py-1 text-xs rounded bg-blue-600 text-white font-medium"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {displayName}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                        title="Edit nama"
                      >
                        <MaterialIcon name="edit" size={16} />
                      </button>
                    </>
                  )}

                  {/* Role Selector Badge */}
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-pointer"
                  >
                    <option value="INVESTOR">ROLE: INVESTOR</option>
                    <option value="LANDLORD">ROLE: LANDLORD</option>
                    <option value="TENANT">ROLE: TENANT</option>
                    <option value="INSPECTOR">ROLE: INSPECTOR</option>
                    <option value="CONTRACTOR">ROLE: CONTRACTOR</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A] flex-wrap">
                  <span>Bergabung: 1 Oktober 2026</span>
                  <span>·</span>
                  <span>ID User: #USR-88219</span>
                  <span>·</span>
                  <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                    <MaterialIcon name="verified_user" size={14} /> KYC Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Quick Action Box */}
            <div className="flex items-center gap-3">
              {isWalletConnected ? (
                <button
                  onClick={disconnectWallet}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
                >
                  <MaterialIcon name="link_off" size={16} />
                  Disconnect Wallet
                </button>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <MaterialIcon name="login" size={16} />
                  Hubungkan Dompet
                </Link>
              )}

              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>

        {/* Grid: Wallet Info & Balances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Active Wallet Details */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MaterialIcon name="account_balance_wallet" size={18} className="text-blue-500" />
                Dompet Web3 Terhubung
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Jaringan: {networkConfig.name} ({networkConfig.chainId})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between gap-3">
              <div className="space-y-1 truncate">
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A]">Alamat Dompet Utama:</span>
                <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {address || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyAddress}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-blue-500 text-slate-700 dark:text-zinc-200 flex items-center gap-1 transition-colors"
                >
                  <MaterialIcon name={copied ? "check" : "content_copy"} size={14} className={copied ? "text-emerald-500" : ""} />
                  {copied ? "Tersalin!" : "Salin"}
                </button>

                <a
                  href={`${networkConfig.blockExplorer}/address/${address || networkConfig.contracts.fitOutAgreement}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  title="Lihat di Block Explorer"
                >
                  <MaterialIcon name="open_in_new" size={16} />
                </a>
              </div>
            </div>

            {/* Balances Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                <span className="text-[11px] font-mono text-slate-500">Saldo Gas (ETH)</span>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                  1.4285 ETH
                </div>
                <span className="text-[10px] text-emerald-500 font-mono">Sepolia Testnet</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                <span className="text-[11px] font-mono text-slate-500">EuthialIDR Token</span>
                <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                  Rp 250.000.000
                </div>
                <span className="text-[10px] text-slate-400 font-mono">ERC-20 Stablecoin</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
                <span className="text-[11px] font-mono text-slate-500">Tranche Vault Shares</span>
                <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">
                  120.000 svIDR
                </div>
                <span className="text-[10px] text-purple-500 font-mono">ERC-4626 Senior Vault</span>
              </div>
            </div>
          </div>

          {/* Quick Role Access Shortcuts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MaterialIcon name="space_dashboard" size={18} className="text-emerald-500" />
              Navigasi Cepat Portal
            </h2>

            <div className="space-y-2">
              <Link
                href="/investor"
                className="p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800 hover:border-blue-500 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MaterialIcon name="trending_up" size={16} className="text-emerald-500" />
                  <span>Portal Investor</span>
                </div>
                <MaterialIcon name="arrow_forward" size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/landlord"
                className="p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800 hover:border-blue-500 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MaterialIcon name="real_estate_agent" size={16} className="text-blue-500" />
                  <span>Portal Landlord</span>
                </div>
                <MaterialIcon name="arrow_forward" size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/tenant"
                className="p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800 hover:border-blue-500 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MaterialIcon name="storefront" size={16} className="text-amber-500" />
                  <span>Portal Tenant (UMKM)</span>
                </div>
                <MaterialIcon name="arrow_forward" size={14} className="text-slate-400" />
              </Link>

              <Link
                href="/contractor"
                className="p-3 rounded-xl border border-slate-200/60 dark:border-zinc-800 hover:border-blue-500 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MaterialIcon name="construction" size={16} className="text-purple-500" />
                  <span>Portal Kontraktor</span>
                </div>
                <MaterialIcon name="arrow_forward" size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Participated Deals List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MaterialIcon name="apartment" size={20} className="text-blue-500" />
                Daftar Kesepakatan (Deals) Terkait
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-0.5">
                Properti ruko di mana Anda tercatat sebagai pemangku kepentingan on-chain.
              </p>
            </div>

            <Link
              href="/landlord/new-deal"
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 self-start sm:self-center"
            >
              <MaterialIcon name="add_circle" size={16} />
              Buat Deal Baru
            </Link>
          </div>

          <div className="space-y-3">
            {userDeals.map((deal) => (
              <div
                key={deal.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200/70 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/30 hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {deal.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {deal.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {deal.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500 flex-wrap">
                    <span>Anggaran Renovasi: <strong>{formatIDR(deal.capex)}</strong></span>
                    <span>·</span>
                    <span>Floor Target: <strong>{formatIDR(deal.monthlyFloor)}/bln</strong></span>
                    <span>·</span>
                    <span>Kontrak: <TxLink hash={deal.contractAddress} type="address" /></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/deals/${deal.id}`}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-slate-300 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
                  >
                    <MaterialIcon name="visibility" size={15} />
                    Lihat Timeline
                  </Link>

                  <Link
                    href="/demo"
                    className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                  >
                    <MaterialIcon name="dashboard" size={15} />
                    Dashboard
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
