"use client";

import React, { useState, useEffect } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useWeb3 } from "../../context/Web3Context";

interface OnboardingWizardProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ forceOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRolePreview, setSelectedRolePreview] = useState<string>("INVESTOR");
  const { isWalletConnected } = useWeb3();

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    const hasSeen = localStorage.getItem("euthial_onboarded_v1");
    if (!hasSeen) {
      // Small timeout for smooth initial load
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleComplete = () => {
    localStorage.setItem("euthial_onboarded_v1", "true");
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0E0E11] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 flex">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              PANDUAN PENGGUNA · LANGKAH {step} DARI 4
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            title="Lewati panduan"
          >
            <MaterialIcon name="close" size={20} />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 pt-2 flex-1 min-h-[340px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <MaterialIcon name="domain" size={32} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Selamat Datang di Euthial Protocol
                </h2>
                <p className="text-sm text-slate-600 dark:text-[#9A9A9A] mt-1.5 leading-relaxed">
                  Protokol tokenisasi Real-World Asset (RWA) pertama yang mengubah ruko kosong di koridor komersial Jakarta menjadi aset ritel produktif melalui skema <strong>Revenue Sharing Terotomasi Smart Contract</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MaterialIcon name="lock" size={14} className="text-blue-500" />
                    2-of-3 Multisig
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#888]">
                    Capex renovasi hanya cair setelah inspektur dan pemilik menyetujui termin.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MaterialIcon name="waterfall_chart" size={14} className="text-emerald-500" />
                    80:15:5 Waterfall
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#888]">
                    Senior tranche menerima pembayaran prioritas hingga 1.25x Return Cap.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MaterialIcon name="verified" size={14} className="text-purple-500" />
                    Dynamic Bond
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#888]">
                    Uang jaminan terkunci di escrow dan rolling otomatis melindungi investor.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Pilih & Pahami Peran Anda
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#9A9A9A] mt-1">
                  Setiap pihak memiliki tanggung jawab, dashboard, dan hak suara kriptografis tersendiri.
                </p>
              </div>

              {/* Role Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: "INVESTOR", label: "Investor", icon: "trending_up" },
                  { key: "LANDLORD", label: "Pemilik Ruko", icon: "real_estate_agent" },
                  { key: "TENANT", label: "Penyewa (UMKM)", icon: "storefront" },
                  { key: "INSPECTOR", label: "Inspektur", icon: "fact_check" },
                  { key: "CONTRACTOR", label: "Kontraktor", icon: "construction" },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setSelectedRolePreview(r.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 shrink-0 transition-colors ${
                      selectedRolePreview === r.key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-white"
                    }`}
                  >
                    <MaterialIcon name={r.icon} size={15} />
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Role Detail Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 space-y-2">
                {selectedRolePreview === "INVESTOR" && (
                  <>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MaterialIcon name="trending_up" size={18} className="text-emerald-500" />
                      Investor: Pendanaan Capex & Dividen Prioritas
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      Anda menyetor modal awal (Senior Tranche Rp 120M) untuk fit-out renovasi ruko. Pendapatan harian dari QRIS toko mengalir pertama kali ke Senior Vault sampai modal + return 25% lunas penuh.
                    </p>
                  </>
                )}

                {selectedRolePreview === "LANDLORD" && (
                  <>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MaterialIcon name="real_estate_agent" size={18} className="text-blue-500" />
                      Pemilik Ruko: Revitalisasi Aset Tanpa Biaya di Awal
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      Ruko kosong Anda diperbaiki dengan pendanaan investor. Anda menyetujui termin renovasi fisik 2-of-3, memantau uang jaminan, dan menerima turnover rent bulanan.
                    </p>
                  </>
                )}

                {selectedRolePreview === "TENANT" && (
                  <>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MaterialIcon name="storefront" size={18} className="text-amber-500" />
                      Penyewa (Tenant UMKM): Ruang Usaha Siap Pakai
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      Buka cabang bisnis F&B / retail tanpa beban capex renovasi di depan. Anda cukup menyetor sewa berbasis performa penjualan dan memantau kesehatan covenant ruko.
                    </p>
                  </>
                )}

                {selectedRolePreview === "INSPECTOR" && (
                  <>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MaterialIcon name="fact_check" size={18} className="text-purple-500" />
                      Inspektur Lapangan: Pengawas Fisik Independen
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      Memeriksa progres fisik renovasi ruko di lapangan. Mengunggah bukti foto ke IPFS dan menandatangani persetujuan termin on-chain via smart contract.
                    </p>
                  </>
                )}

                {selectedRolePreview === "CONTRACTOR" && (
                  <>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <MaterialIcon name="construction" size={18} className="text-amber-500" />
                      Kontraktor Renovasi: Penerima Pembayaran Escrow
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#999] leading-relaxed">
                      Melaksanakan pekerjaan fit-out sipil, MEP, dan interior. Menerima pembayaran termin langsung dari smart contract tanpa risiko gagal bayar pemilik ruko.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Deal Pilot #01: Ruko Fatmawati Jakarta
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#9A9A9A] mt-1">
                  Kontrak langsung tersambung di jaringan Ethereum Sepolia Testnet.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Ruko Komersial 3 Lantai · Jl. RS Fatmawati No. 88
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    STATUS: OPERATING
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400 block">Total Capex</span>
                    <strong className="text-slate-900 dark:text-white">Rp 150.000.000</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400 block">Senior Tranche</span>
                    <strong className="text-blue-500">Rp 120.000.000</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400 block">Return Target</span>
                    <strong className="text-emerald-500">1.25x (Rp 150M)</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] text-slate-400 block">Covenant Floor</span>
                    <strong className="text-purple-500">Rp 12.5M/bln</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-[#888] leading-relaxed">
                  💡 Tip Demo: Anda dapat berganti antara <strong>Mode Simulasi</strong> (angka interaktif instan) dan <strong>Mode Live Sepolia</strong> (transaksi on-chain nyata) kapan saja melalui toggle di navbar atas.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <MaterialIcon name="task_alt" size={36} />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Anda Siap Menjelajahi Protokol!
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#9A9A9A] mt-1.5 max-w-md mx-auto leading-relaxed">
                  Semua dashboard role saling tersinkronisasi secara real-time. Tindakan di satu portal akan langsung menggerakkan status di portal lain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 text-xs font-mono text-left space-y-2 max-w-lg mx-auto">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MaterialIcon name="checklist" size={16} className="text-blue-500" />
                  Rekomendasi Rute Uji Coba untuk Juri:
                </div>
                <div className="space-y-1 text-slate-600 dark:text-[#AAA]">
                  <div>1. Buka <strong>/demo</strong> untuk kontrol pusat simulasi (Mission Control)</div>
                  <div>2. Coba ubah skenario ke <strong>S2 (Shortfall)</strong> untuk melihat Cure Period aktif</div>
                  <div>3. Masuk ke <strong>/inspector</strong> untuk tanda tangani bukti termin fisik</div>
                  <div>4. Masuk ke <strong>/investor</strong> untuk tarik dividen hasil waterfall</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <MaterialIcon name="arrow_back" size={16} />
                Sebelumnya
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
            >
              Lewati Tur
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Berikutnya</span>
                <MaterialIcon name="arrow_forward" size={16} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <MaterialIcon name="rocket_launch" size={16} />
                <span>Mulai Sekarang</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
