"use client";

import React, { useState } from "react";
import { useProtocol } from "@/context/ProtocolContext";

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
    <div className="p-5 rounded-2xl border border-white/10 bg-[#121212] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Customer Tokenized Rebate Scanner
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                ANTI-ROGUE QR
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Pelanggan mengaudit kasir: Scan struk QRIS resmi untuk klaim cashback 10% & tiket undian
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
          <span>Struk Resmi Bulan #{currentMonth}</span>
        </div>
      </div>

      {/* Input / Scanner Box */}
      <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-3">
        <label className="block text-xs font-mono text-white/70 font-medium">
          Masukkan Ref ID Transaksi Struk Kasir / Scan QR:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={trxInput}
              onChange={(e) => setTrxInput(e.target.value)}
              placeholder="Contoh: QRIS-JBR-M01-9841..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={() => handleVerify(trxInput)}
            disabled={!trxInput || scanState === "VERIFYING"}
            className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">search_check</span>
            {scanState === "VERIFYING" ? "Memeriksa..." : "Verifikasi Struk"}
          </button>
        </div>

        {/* Quick Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-white/40">
          <span>Simulasi Cepat:</span>
          <button
            onClick={() => {
              setTrxInput(sampleValidTrx);
              handleVerify(sampleValidTrx);
            }}
            className="px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/10 transition"
          >
            [Test QRIS Escrow Resmi]
          </button>
          <button
            onClick={() => {
              setTrxInput(sampleRogueTrx);
              handleVerify(sampleRogueTrx);
            }}
            className="px-2 py-1 rounded bg-white/5 hover:bg-red-500/20 hover:text-red-300 border border-white/10 transition"
          >
            [Test Kasir Kasih QR Pribadi]
          </button>
        </div>
      </div>

      {/* Result Status: VERIFIED */}
      {scanState === "VERIFIED" && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
              <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
              STRUK TERVERIFIKASI PADA REKENING ESCROW RESMI
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
              REWARD ACTIVE
            </span>
          </div>
          <div className="text-xs text-white/80 leading-relaxed font-sans">
            Transaksi terdaftar dalam mutasi harian Mandiri/BCA Escrow protokol Euthial.
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono border-t border-emerald-500/20">
            <div className="p-2 rounded bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-white/40 block">CASHBACK INSTAN:</span>
              <span className="text-emerald-400 font-bold text-sm">Rp 3.500 (10%)</span>
            </div>
            <div className="p-2 rounded bg-black/40 border border-emerald-500/20">
              <span className="text-[10px] text-white/40 block">LOYALTY TOKEN:</span>
              <span className="text-cyan-400 font-bold text-sm">+1 Tiket Undian RUKOMA</span>
            </div>
            <p className="text-[11px] text-white/50 italic flex-1">
              *Pelanggan selalu termotivasi scan QR resmi agar tidak kehilangan cashback ini!
            </p>
          </div>
        </div>
      )}

      {/* Result Status: ROGUE_FLAGGED */}
      {scanState === "ROGUE_FLAGGED" && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300">
              <span className="material-symbols-outlined text-red-400 text-base">warning</span>
              PERINGATAN: QRIS TIDAK TERDAFTAR DI PROTOKOL ESCROW!
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300">
              UNAUTHORIZED QR
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            QR yang Anda scan mengarah ke rekening pribadi atau e-wallet di luar protokol Euthial.
            Anda <strong className="text-red-400">TIDAK BERHAK</strong> atas cashback 10% dan tiket undian.
          </p>
          <div className="p-3 rounded-lg bg-black/50 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">Program Mystery Dining Bounty:</div>
              <div className="text-[11px] text-white/50">
                Laporkan kasir yang menyodorkan QR pribadi dan klaim hadiah tunai Rp 250.000 dari sitaan uang jaminan tenant.
              </div>
            </div>
            <button
              onClick={() => setShowBountyModal(true)}
              className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-bold text-xs font-mono transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">report</span>
              Klaim Bounty Rp 250k
            </button>
          </div>
        </div>
      )}

      {/* Bounty Report Modal */}
      {showBountyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#141414] border border-red-500/30 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                <span className="material-symbols-outlined">campaign</span>
                Laporan Kasir Nakal (Mystery Shopper)
              </div>
              <button
                onClick={() => setShowBountyModal(false)}
                className="text-white/40 hover:text-white text-xs font-mono"
              >
                Tutup
              </button>
            </div>

            {bountyClaimed ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-emerald-400">check_circle</span>
                <div className="text-sm font-bold text-white">Laporan Berhasil Diproses!</div>
                <div className="text-xs text-white/70">
                  Reward Bounty <strong className="text-emerald-400">Rp 250.000</strong> telah dikirimkan ke akun dompet Anda dari pemotongan bond tenant.
                </div>
              </div>
            ) : (
              <form onSubmit={handleClaimBounty} className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/70 font-mono mb-1">Nama Pelapor / Mahasiswa:</label>
                  <input
                    type="text"
                    defaultValue="Dimas Prayoga (Univ. Jember)"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-white/70 font-mono mb-1">Bukti Foto Stiker QR Pribadi:</label>
                  <div className="p-3 rounded-lg border border-dashed border-white/20 text-center text-white/40 font-mono text-[11px]">
                    bukti_foto_kasir_qris_dana_pribadi.jpg (Terlampir)
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 font-mono mb-1">Nominal yang Diminta Kasir:</label>
                  <input
                    type="text"
                    defaultValue="Rp 28.000"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBountyModal(false)}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 font-mono text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs transition"
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
