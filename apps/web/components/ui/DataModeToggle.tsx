"use client";

import React from "react";
import { useDataLayer } from "../../lib/data-layer";

export const DataModeToggle: React.FC = () => {
  const { mode, toggleMode, isSimulation } = useDataLayer();

  return (
    <button
      onClick={toggleMode}
      title={isSimulation ? "Beralih ke Live Sepolia Testnet" : "Beralih ke Mode Simulasi Offline"}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 border shadow-sm ${isSimulation
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
        }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulation ? "bg-amber-400" : "bg-emerald-400"
            }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${isSimulation ? "bg-amber-500" : "bg-emerald-500"
            }`}
        />
      </span>

      <span>
        {isSimulation ? "Mode: Simulasi 🟡" : "Mode: Sepolia Live 🟢"}
      </span>

      <span className="text-[10px] opacity-75 font-normal ml-0.5 underline">
        ganti
      </span>
    </button>
  );
};

export const DataModeBanner: React.FC = () => {
  const { isSimulation, toggleMode } = useDataLayer();

  if (!isSimulation) {
    return (
      <div className="bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-200 px-4 py-1.5 text-xs font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong>ON-CHAIN MODE ACTIVE:</strong> Data terhubung langsung ke smart contract Sepolia Testnet.
          </span>
        </div>
        <button
          onClick={toggleMode}
          className="text-emerald-400 hover:text-white underline text-[11px]"
        >
          Kembali ke Simulasi Offline &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/70 border-b border-amber-500/30 text-amber-200 px-4 py-1 text-xs font-mono flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-amber-400" />
        <span>
          <strong>🟡 MODE SIMULASI OFFLINE:</strong> Menggunakan simulator real-time responsif. Transaksi dicatat secara optimistik.
        </span>
      </div>
      <button
        onClick={toggleMode}
        className="text-amber-400 hover:text-white underline text-[11px]"
      >
        Aktifkan Live Sepolia &rarr;
      </button>
    </div>
  );
};
