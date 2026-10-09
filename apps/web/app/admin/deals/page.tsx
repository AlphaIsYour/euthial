"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = () => {
    setLoading(true);
    fetch("/api/admin/deals")
      .then((res) => res.json())
      .then((data) => {
        setDeals(data.deals || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load deals:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleStateChange = async (dealId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dealId, status: newStatus }),
      });
      if (res.ok) {
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Deals & Contract Suites
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage commercial fit-out agreements and inspected on-chain contract suites.
          </p>
        </div>
        <Link
          href="/admin/deals/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <span>+ Deploy New Deal</span>
        </Link>
      </div>

      {/* Deals Cards / Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Deal / Property</th>
                <th className="py-3 px-4">Financials (IDR)</th>
                <th className="py-3 px-4">Tenor & Terms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Contract Suite Addresses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    Loading deals...
                  </td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No deals registered. Click "+ Deploy New Deal" to deploy the first suite.
                  </td>
                </tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/70 transition-colors align-top">
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 text-xs">{deal.propertyName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{deal.location}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        Landlord: {deal.landlordAddress?.slice(0, 6)}...{deal.landlordAddress?.slice(-4)}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 text-xs">
                        Rp {(deal.budget / 1_000_000).toLocaleString("id-ID")}M
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        Senior: Rp {(deal.seniorPrincipal / 1_000_000).toLocaleString("id-ID")}M ({(deal.seniorMultipleBps / 10000).toFixed(2)}x)
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium">
                        Junior: Rp {(deal.juniorPrincipal / 1_000_000).toLocaleString("id-ID")}M ({(deal.juniorMultipleBps / 10000).toFixed(2)}x)
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-slate-700 text-xs font-medium">
                        {deal.targetTenorDays} Days target
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Max {deal.maxTenorDays} Days
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <select
                        value={deal.status}
                        onChange={(e) => handleStateChange(deal.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-md border cursor-pointer ${
                          deal.status === "OPERATING"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : deal.status === "BUILDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : deal.status === "FUNDRAISING"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="FUNDRAISING">FUNDRAISING</option>
                        <option value="BUILDING">BUILDING</option>
                        <option value="OPERATING">OPERATING</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] space-y-1">
                      {deal.agreementAddress ? (
                        <div>
                          <span className="text-slate-400 font-sans text-[10px]">Agreement: </span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-700">
                            {deal.agreementAddress.slice(0, 8)}...{deal.agreementAddress.slice(-6)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic">Off-chain Draft</div>
                      )}
                      {deal.seniorVaultAddress && (
                        <div>
                          <span className="text-slate-400 font-sans text-[10px]">Senior Vault: </span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-700">
                            {deal.seniorVaultAddress.slice(0, 8)}...{deal.seniorVaultAddress.slice(-6)}
                          </span>
                        </div>
                      )}
                      {deal.routerAddress && (
                        <div>
                          <span className="text-slate-400 font-sans text-[10px]">Router: </span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-700">
                            {deal.routerAddress.slice(0, 8)}...{deal.routerAddress.slice(-6)}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
