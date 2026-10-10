"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const InvestorView: React.FC = () => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawn(true);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Modal Didepositkan</span>
          <div className="text-base font-mono font-bold text-white mt-1">Rp 120.000.000</div>
          <span className="text-[10px] text-blue-400 font-mono">Senior Tranche (80%)</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Share Balance (ERC-4626)</span>
          <div className="text-base font-mono font-bold text-white mt-1">120.000.000 sTK</div>
          <span className="text-[10px] text-emerald-400 font-mono">NAV: 1.096 per share</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Total Diterima (Realized)</span>
          <div className="text-base font-mono font-bold text-emerald-400 mt-1">Rp 115.200.000</div>
          <span className="text-[10px] text-[#71717A] font-mono">76.8% Target Cap</span>
        </div>

        <div className="bg-[#1A1A1A] p-3.5 rounded-card border border-[rgba(207,207,207,0.08)]">
          <span className="text-[11px] text-[#8A8A8A]">Sisa Klaim Kontrak</span>
          <div className="text-base font-mono font-bold text-white mt-1">Rp 34.800.000</div>
          <span className="text-[10px] text-amber-400 font-mono">Target Return: 1.25x</span>
        </div>
      </div>

      {/* Action Deck & Vault Cash */}
      <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="account_balance_wallet" size={14} className="text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Kas Tersedia di Senior Vault (Idle Cash)</h4>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Dana hasil settlement QRIS yang sudah masuk ke vault dan siap ditarik oleh pemegang share Senior.
          </p>
          <div className="text-lg font-mono font-bold text-white mt-2">
            {withdrawn ? "Rp 0" : "Rp 12.450.000"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled
            title="Fundraising phase has ended (Operating Phase)"
            className="px-3.5 py-2 bg-[#27272A] text-[#71717A] text-xs font-semibold rounded-card border border-[rgba(207,207,207,0.06)] cursor-not-allowed"
          >
            Deposit Senior (Closed)
          </button>
          <button
            onClick={handleWithdraw}
            disabled={withdrawing || withdrawn}
            className={`px-4 py-2 text-xs font-semibold rounded-card transition-colors flex items-center gap-1.5 ${
              withdrawn
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <MaterialIcon name={withdrawn ? "check_circle" : "payments"} size={16} />
            <span>{withdrawing ? "Processing..." : withdrawn ? "Withdrawn!" : "Withdraw Available Cash"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
