"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, Layers, Activity } from "lucide-react";

interface ProtocolMetrics {
  tvlIdr: number;
  totalDeals: number;
  totalSettlementsCount: number;
  covenantHealthRatioBps: number;
}

export function ProtocolMetricsBanner() {
  const [metrics, setMetrics] = useState<ProtocolMetrics | null>(null);

  useEffect(() => {
    fetch("/api/analytics/metrics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch(() => {
        // Fallback static metrics
        setMetrics({
          tvlIdr: 160_000_000,
          totalDeals: 1,
          totalSettlementsCount: 720,
          covenantHealthRatioBps: 9850,
        });
      });
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Protocol Telemetry
            </div>
            <div className="text-sm font-medium text-slate-200">
              Live Network Metrics (Sepolia & Sandbox)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs">Total TVL:</span>
            <span className="font-semibold text-slate-100">
              {metrics ? formatIDR(metrics.tvlIdr) : "Rp 160.000.000"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs">Settlements:</span>
            <span className="font-semibold text-slate-100">
              {metrics?.totalSettlementsCount || 720} Days
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs">Covenant Health:</span>
            <span className="font-semibold text-emerald-400">
              {metrics ? `${(metrics.covenantHealthRatioBps / 100).toFixed(1)}%` : "98.5%"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
