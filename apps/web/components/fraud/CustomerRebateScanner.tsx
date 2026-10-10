"use client";

import React, { useState } from "react";
import { useProtocol } from "@/context/ProtocolContext";
import { MaterialIcon } from "../ui/MaterialIcon";

export function CustomerRebateScanner() {
  const { currentMonth, grossMonthly, activeScenario } = useProtocol();
  const [trxInput, setTrxInput] = useState<string>("");
  const [scanState, setScanState] = useState<"IDLE" | "VERIFYING" | "VERIFIED" | "ROGUE_FLAGGED">("IDLE");
  const [showBountyModal, setShowBountyModal] = useState<boolean>(false);
  const [bountyClaimed, setBountyClaimed] = useState<boolean>(false);

  const sampleValidTrx = `QRIS-JBR-M0${currentMonth}-9841`;
  const sampleRogueTrx = `DANA-PERSONAL-KASIR-0812`;

  const handleVerify = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setScanState("VERIFYING");

    setTimeout(() => {
      if (trimmed.includes("PERSONAL") || trimmed.includes("DANA") || trimmed.includes("PRIBADI") || trimmed.includes("BCA-KASIR")) {
        setScanState("ROGUE_FLAGGED");
      } else {
        setScanState("VERIFIED");
      }
    }, 500);
  };

  const handleClaimBounty = (e: React.FormEvent) => {
    e.preventDefault();
    setBountyClaimed(true);
    setTimeout(() => {
      setShowBountyModal(false);
      setBountyClaimed(false);
      setScanState("IDLE");
      setTrxInput("");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black p-6 sm:p-7 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <MaterialIcon name="qr_code_scanner" size={16} />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Customer Rebate Scanner
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8A8A8A] mt-0.5 font-normal leading-relaxed">
              Pelanggan mengaudit kasir: Verifikasi struk QRIS resmi untuk klaim cashback 10% & loyalty reward.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-[#8A8A8A] shrink-0 self-start sm:self-center">
          <span>Struk Resmi M{currentMonth}</span>
        </div>
      </div>

      {/* Input / Scanner Box (Modern Fintech Inline Action) */}
      <div className="space-y-3">
        <label className="block text-xs font-mono text-slate-600 dark:text-[#A1A1AA]">
          Masukkan Ref ID Transaksi Struk Kasir / Scan QR:
        </label>
        <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0A0A0A] p-1.5 focus-within:border-slate-500 dark:focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-[#0A0A0A] transition-all">
          <MaterialIcon name="receipt_long" size={14} className="text-slate-400 dark:text-[#71717A] ml-2.5 mr-2" />
          <input
            type="text"
            value={trxInput}
            onChange={(e) => setTrxInput(e.target.value)}
            placeholder="Contoh: QRIS-JBR-M01-9841..."
            className="w-full bg-transparent text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#71717A] focus:outline-none"
          />
          <button
            onClick={() => handleVerify(trxInput)}
            disabled={!trxInput || scanState === "VERIFYING"}
            className="px-4 py-2 rounded-lg bg-slate-950 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-medium text-xs font-mono transition disabled:opacity-40 flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <MaterialIcon name="search_check" size={13} />
            <span>{scanState === "VERIFYING" ? "Memeriksa..." : "Verifikasi"}</span>
          </button>
        </div>

        {/* Quick Simulation Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A] pt-0.5">
          <span className="text-[11px] text-slate-500 dark:text-[#8A8A8A]">Uji Coba Validasi:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTrxInput(sampleValidTrx);
                handleVerify(sampleValidTrx);
              }}
              className="px-3 py-1 rounded-full text-[11px] font-mono border border-slate-200 dark:border-[rgba(207,207,207,0.12)] bg-slate-100 dark:bg-[#1E1E22] hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-[#D4D4D8] transition"
            >
              QR Escrow Resmi ({sampleValidTrx})
            </button>
            <button
              type="button"
              onClick={() => {
                setTrxInput(sampleRogueTrx);
                handleVerify(sampleRogueTrx);
              }}
              className="px-3 py-1 rounded-full text-[11px] font-mono border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-500/50 hover:text-rose-900 dark:hover:text-rose-200 text-rose-700 dark:text-rose-300 transition"
            >
              QR Kasir Nakal (Pribadi)
            </button>
          </div>
        </div>
      </div>

      {/* Result Status: VERIFIED */}
      {scanState === "VERIFIED" && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-emerald-800 dark:text-emerald-400">
              <MaterialIcon name="check_circle" size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>STRUK TERVERIFIKASI PADA REKENING ESCROW RESMI</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 font-medium">
              REWARD ACTIVE
            </span>
          </div>
          <div className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-relaxed font-normal">
            Transaksi terdaftar dalam mutasi harian Mandiri/BCA Escrow protokol Euthial.
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono border-t border-emerald-200 dark:border-emerald-500/20">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-emerald-200 dark:border-emerald-500/20 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">CASHBACK INSTAN:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">Rp 3.500 (10%)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#0A0A0A] border border-sky-200 dark:border-sky-500/20 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-[#71717A] block">LOYALTY TOKEN:</span>
              <span className="text-sky-700 dark:text-sky-400 font-semibold text-sm">+1 Tiket Undian RUKOMA</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-[#8A8A8A] italic flex-1">
              *Pelanggan selalu termotivasi scan QR resmi agar tidak kehilangan cashback ini!
            </p>
          </div>
        </div>
      )}

      {/* Result Status: ROGUE_FLAGGED */}
      {scanState === "ROGUE_FLAGGED" && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-rose-800 dark:text-rose-400">
              <MaterialIcon name="warning" size={14} className="text-rose-600 dark:text-rose-400" />
              <span>PERINGATAN: QRIS TIDAK TERDAFTAR DI PROTOKOL ESCROW!</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20 font-medium">
              UNAUTHORIZED QR
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-[#A1A1AA] leading-relaxed font-normal">
            QR yang Anda scan mengarah ke rekening pribadi atau e-wallet di luar protokol Euthial.
            Anda <strong className="text-rose-700 dark:text-rose-400">TIDAK BERHAK</strong> atas cashback 10% dan tiket undian.
          </p>
          <div className="p-3 rounded-xl bg-white dark:bg-[#0A0A0A] border border-rose-200 dark:border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Program Mystery Dining Bounty:</div>
              <div className="text-[11px] text-slate-600 dark:text-[#8A8A8A]">
                Laporkan kasir yang menyodorkan QR pribadi dan klaim hadiah tunai Rp 250.000 dari sitaan uang jaminan tenant.
              </div>
            </div>
            <button
              onClick={() => setShowBountyModal(true)}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs font-mono transition flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
            >
              <MaterialIcon name="report" size={13} />
              <span>Klaim Bounty Rp 250k</span>
            </button>
          </div>
        </div>
      )}

      {/* Bounty Report Modal */}
      {showBountyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[rgba(207,207,207,0.08)] pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono font-bold text-sm">
                <MaterialIcon name="campaign" size={15} />
                Laporan Kasir Nakal (Mystery Shopper)
              </div>
              <button
                onClick={() => setShowBountyModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono"
              >
                Tutup
              </button>
            </div>

            {bountyClaimed ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-2">
                <MaterialIcon name="check_circle" size={24} className="text-emerald-600 dark:text-emerald-400" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">Laporan Berhasil Diproses!</div>
                <div className="text-xs text-slate-600 dark:text-[#8A8A8A]">
                  Reward Bounty <strong className="text-emerald-700 dark:text-emerald-400">Rp 250.000</strong> telah dikirimkan ke akun dompet Anda dari pemotongan bond tenant.
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimBounty} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-[#A1A1AA] font-mono mb-1">Nama Pelapor / Mystery Shopper:</label>
                  <input
                    type="text"
                    defaultValue="Dimas Prayoga (Auditor Independen)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E1E22] border border-slate-300 dark:border-[rgba(207,207,207,0.12)] text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-[#1E1E22] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-[#A1A1AA] font-mono mb-1">Bukti Foto Stiker QR Pribadi:</label>
                  <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-[rgba(207,207,207,0.18)] bg-slate-50 dark:bg-[#1E1E22] text-center text-slate-500 dark:text-[#8A8A8A] font-mono text-[11px]">
                    bukti_foto_kasir_qris_dana_pribadi.jpg (Terlampir)
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-[#A1A1AA] font-mono mb-1">Nominal yang Diminta Kasir:</label>
                  <input
                    type="text"
                    defaultValue="Rp 28.000"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#1E1E22] border border-slate-300 dark:border-[rgba(207,207,207,0.12)] text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-[#1E1E22] focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBountyModal(false)}
                    className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#1E1E22] hover:bg-slate-200 dark:hover:bg-[#27272A] text-slate-700 dark:text-slate-300 font-mono text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs transition shadow-sm"
                  >
                    Kirim Laporan & Sita Denda Bond
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
