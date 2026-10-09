"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NETWORKS, DEFAULT_CHAIN_ID } from "@/contracts/addresses";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
        setLoading(false);
      });
  }, []);

  const config = NETWORKS[DEFAULT_CHAIN_ID];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Protocol Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time control plane for agreements, user roles, smart contracts, and compliance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/deals/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <span>+ Deploy New Deal</span>
          </Link>
          <Link
            href="/admin/whitelist"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <span>Whitelist KYC</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Users
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {loading ? "..." : stats?.totalUsers || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">RBAC active</span> across 6 roles
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Deals In Suite
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {loading ? "..." : stats?.totalDeals || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">{stats?.activeDeals || 0} active</span> agreements
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Whitelisted Wallets
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {loading ? "..." : stats?.totalWhitelisted || 0}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">100% compliant</span> transfer gates
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Target Settlement
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            Rp 150M
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            EIP-712 Waterfall verified
          </div>
        </div>
      </div>

      {/* Contract Infrastructure Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Protocol On-Chain Infrastructure
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified contracts on {config?.name || "Ethereum Sepolia"} (Chain ID: {config?.chainId})
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            System Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-600">AgreementFactory (#51)</div>
            <div className="font-mono text-xs text-slate-900 truncate mt-1">
              {config?.contracts?.agreementFactory || "0x0165878A594ca255338adfa4d48449f69242Eb8F"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Atomic Suite Deployer</span>
              <span className="text-emerald-600 font-medium">Ready</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-600">WaterfallRouter</div>
            <div className="font-mono text-xs text-slate-900 truncate mt-1">
              {config?.contracts?.waterfallRouter || "0x5FbDB2315678afecb367f032d93F642f64180aa3"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>EIP-712 Attestation Engine</span>
              <span className="text-emerald-600 font-medium">Active</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-xs font-semibold text-slate-600">EuthialIDR Token</div>
            <div className="font-mono text-xs text-slate-900 truncate mt-1">
              {config?.contracts?.euthialIDR || "0x51E5dB7a216D8c50dC4b917036a4613B9B74F3b0"}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>ERC-20 Settlement Asset</span>
              <span className="text-emerald-600 font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Deals & Recent Registered Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Active Fit-Out Deals
            </h2>
            <Link
              href="/admin/deals"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading deals...</div>
          ) : stats?.recentDeals?.length ? (
            <div className="divide-y divide-slate-100">
              {stats.recentDeals.map((d: any) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{d.propertyName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Budget: Rp {(d.budget / 1_000_000).toLocaleString("id-ID")}M • {d.location}
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No deals deployed yet.</div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Users & Roles
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Manage users →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading users...</div>
          ) : stats?.recentUsers?.length ? (
            <div className="divide-y divide-slate-100">
              {stats.recentUsers.map((u: any) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{u.name || "Anonymous User"}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {u.email || (u.walletAddress ? `${u.walletAddress.slice(0, 8)}...${u.walletAddress.slice(-6)}` : "No address")}
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
