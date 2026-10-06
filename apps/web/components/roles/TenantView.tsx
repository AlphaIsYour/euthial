"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const TenantView: React.FC = () => {
  const [topUpDone, setTopUpDone] = useState(false);

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Saldo Uang Jaminan (Bond)</span>
          <div className="text-base font-mono font-bold text-white mt-1">Rp 15.000.000</div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Saldo Tersedia</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Status Covenant Floor</span>
          <div className="text-base font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            HEALTHY
          </div>
          <span className="text-[10px] text-[#71717A] font-mono">Realisasi &gt; Floor Target</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Kas Ditahan Tenant (80%)</span>
          <div className="text-base font-mono font-bold text-white mt-1">Rp 614.400.000</div>
          <span className="text-[10px] text-[#71717A] font-mono">Biaya Operasional Bebas</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Coverage Margin Ratio</span>
          <div className="text-base font-mono font-bold text-emerald-400 mt-1">2.35x</div>
          <span className="text-[10px] text-[#71717A] font-mono">Threshold Minimum: 2.0x</span>
        </div>
      </div>

      {/* Covenant Action Desk */}
      <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="shield" size={18} className="text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Perlindungan Covenant & Uang Jaminan</h4>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1 max-w-xl">
            Protokol menggunakan batas minimal pembayaran kumulatif (Floor). Jika terjadi penurunan omzet atau kebocoran kas di bawah target, tenant memiliki masa perbaikan (*cure period* 7 hari logis) sebelum jaminan ditarik sebagian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTopUpDone(true)}
            className="px-3.5 py-2 bg-[#27272A] hover:bg-[#323238] text-white text-xs font-semibold rounded-card border border-[rgba(207,207,207,0.10)] transition-colors flex items-center gap-1.5"
          >
            <MaterialIcon name="add_circle" size={16} className="text-emerald-400" />
            <span>{topUpDone ? "Saldo Jaminan Ditambah" : "Top-Up Bond"}</span>
          </button>
          <button
            disabled
            title="Tidak ada shortfall saat ini (Status HEALTHY)"
            className="px-3.5 py-2 bg-[#141414] text-[#52525B] text-xs font-semibold rounded-card border border-[rgba(207,207,207,0.06)] cursor-not-allowed"
          >
            Cure Shortfall (N/A)
          </button>
        </div>
      </div>
    </div>
  );
};
