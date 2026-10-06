"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const LandlordView: React.FC = () => {
  const [approvedMilestone, setApprovedMilestone] = useState(false);

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Modal Junior Disetor</span>
          <div className="text-base font-mono font-bold text-white mt-1">Rp 30.000.000</div>
          <span className="text-[10px] text-purple-400 font-mono">First-Loss Protection (20%)</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Akumulasi Turnover Rent (5%)</span>
          <div className="text-base font-mono font-bold text-emerald-400 mt-1">Rp 42.600.000</div>
          <span className="text-[10px] text-[#71717A] font-mono">Sewa Variabel Masuk Otomatis</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Target Return Junior</span>
          <div className="text-base font-mono font-bold text-purple-400 mt-1">1.40x (Rp 42 jt)</div>
          <span className="text-[10px] text-[#71717A] font-mono">Mulai Payout paska Senior</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Status Hak Ruko & Unit</span>
          <div className="text-base font-semibold text-white mt-1">Aktif Disewa</div>
          <span className="text-[10px] text-emerald-400 font-mono">Hak Milik Terproteksi</span>
        </div>
      </div>

      {/* Landlord Action & Milestone Oversight */}
      <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(207,207,207,0.08)]">
          <div className="flex items-center gap-2">
            <MaterialIcon name="approval_delegation" size={18} className="text-purple-400" />
            <h4 className="text-sm font-semibold text-white">
              Persetujuan Rilis Dana Renovasi (Milestone 3 of 3)
            </h4>
          </div>
          <span className="text-xs text-[#8A8A8A] font-mono">Skema Multisig 2-of-3</span>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#E4E4E7] font-medium">
              Milestone 3: Finishing Interior & Pemasangan Mesin Espresso
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5 max-w-xl">
              Kontraktor telah mengunggah hash dokumentasi fisik (IPFS / SHA-256). Inspektur telah memberikan tanda tangan persetujuan ke-1.
            </p>
          </div>

          <button
            onClick={() => setApprovedMilestone(true)}
            disabled={approvedMilestone}
            className={`px-4 py-2 text-xs font-semibold rounded-card transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              approvedMilestone
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            <MaterialIcon name={approvedMilestone ? "verified" : "edit_document"} size={16} />
            <span>{approvedMilestone ? "Milestone Disetujui (2/2)" : "Beri Persetujuan Pemilik"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
