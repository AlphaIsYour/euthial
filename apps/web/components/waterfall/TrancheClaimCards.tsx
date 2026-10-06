"use client";

import React from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const TrancheClaimCards: React.FC = () => {
  const seniorTarget = 150000000;
  const seniorPaid = 115200000;
  const seniorPercent = Math.round((seniorPaid / seniorTarget) * 100);

  const juniorTarget = 42000000;
  const juniorPaid = 0;
  const juniorPercent = Math.round((juniorPaid / juniorTarget) * 100);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Senior Tranche Card */}
      <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(207,207,207,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h3 className="text-sm font-semibold text-white">Senior Tranche Vault (ERC-4626)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              PRIORITAS 1 (80%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div>
              <span className="text-[11px] text-[#8A8A8A]">Pokok Disetor</span>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {formatIDR(120000000)}
              </div>
              <span className="text-[10px] text-[#71717A] font-mono">External Investors</span>
            </div>
            <div>
              <span className="text-[11px] text-[#8A8A8A]">Target Return Multiple</span>
              <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">
                1.25x ({formatIDR(seniorTarget)})
              </div>
              <span className="text-[10px] text-[#71717A] font-mono">Total Klaim Cap</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#A1A1AA]">Progres Pelunasan</span>
              <span className="text-blue-400 font-bold">{seniorPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#27272A] overflow-hidden">
              <div
                style={{ width: `${seniorPercent}%` }}
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
              <span>Terbayar: {formatIDR(seniorPaid)}</span>
              <span>Sisa: {formatIDR(seniorTarget - seniorPaid)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[rgba(207,207,207,0.06)] flex items-center justify-between text-[11px] text-[#8A8A8A]">
          <span className="flex items-center gap-1">
            <MaterialIcon name="schedule" size={14} className="text-blue-400" />
            Estimasi Lunas: Bulan ke-14
          </span>
          <span className="text-emerald-400 font-medium">On-Track</span>
        </div>
      </div>

      {/* 2. Junior Tranche Card */}
      <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(207,207,207,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <h3 className="text-sm font-semibold text-white">Junior Tranche Vault (ERC-4626)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
              FIRST-LOSS (20%)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div>
              <span className="text-[11px] text-[#8A8A8A]">Pokok Disetor</span>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {formatIDR(30000000)}
              </div>
              <span className="text-[10px] text-[#71717A] font-mono">Pemilik Ruko (Landlord)</span>
            </div>
            <div>
              <span className="text-[11px] text-[#8A8A8A]">Target Return Multiple</span>
              <div className="text-sm font-mono font-bold text-purple-400 mt-0.5">
                1.40x ({formatIDR(juniorTarget)})
              </div>
              <span className="text-[10px] text-[#71717A] font-mono">Total Klaim Cap</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#A1A1AA]">Progres Pelunasan</span>
              <span className="text-purple-400 font-bold">{juniorPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#27272A] overflow-hidden">
              <div
                style={{ width: `${juniorPercent}%` }}
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
              <span>Terbayar: {formatIDR(juniorPaid)}</span>
              <span>Sisa: {formatIDR(juniorTarget - juniorPaid)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[rgba(207,207,207,0.06)] flex items-center justify-between text-[11px] text-[#8A8A8A]">
          <span className="flex items-center gap-1">
            <MaterialIcon name="lock" size={14} className="text-purple-400" />
            Menunggu Senior 100% Tercapai
          </span>
          <span className="text-amber-400/90 font-medium">Bantalan Risiko Aktif</span>
        </div>
      </div>
    </div>
  );
};
