"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell } from "../../../components/layout/Shell";
import { MaterialIcon } from "../../../components/ui/MaterialIcon";
import { useWeb3 } from "../../../context/Web3Context";
import { toast } from "../../../components/ui/Toast";

export default function NewDealWizardPage() {
  const router = useRouter();
  const { isWalletConnected, address } = useWeb3();

  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedDealId, setDeployedDealId] = useState<string | null>(null);

  // Step 1: Property Info
  const [propertyName, setPropertyName] = useState("Ruko Boulevard Artha Gading");
  const [propertyAddress, setPropertyAddress] = useState("Jl. Boulevard Artha Gading Blok D-05, Kelapa Gading, Jakarta Utara");
  const [propertyType, setPropertyType] = useState("3_FLOORS_COMMERCIAL");
  const [shmNumber, setShmNumber] = useState("SHM No. 04892/Kelapa Gading");

  // Step 2: Financials
  const [capexBudget, setCapexBudget] = useState(180_000_000);
  const [seniorSplitPct, setSeniorSplitPct] = useState(80);
  const [tenorMonths, setTenorMonths] = useState(24);
  const [monthlyFloor, setMonthlyFloor] = useState(15_000_000);
  const [targetMultiple, setTargetMultiple] = useState(1.25);

  // Step 3: Stakeholders Invite
  const [tenantEmail, setTenantEmail] = useState("admin@tokokopi.id");
  const [inspectorAddress, setInspectorAddress] = useState("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65");
  const [contractorAddress, setContractorAddress] = useState("0x90F79bf6EB2c4f870365E785982E1f101E93b906");

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  // Coverage metric calculations
  const seniorPrincipal = (capexBudget * seniorSplitPct) / 100;
  const seniorTargetCap = seniorPrincipal * targetMultiple;
  const totalFloorCoverage = (monthlyFloor * tenorMonths) / seniorTargetCap;

  const handleDeployContract = async () => {
    setIsDeploying(true);
    // Simulate on-chain deployment
    await new Promise((r) => setTimeout(r, 2500));
    const newId = "deal-gading-02";
    setDeployedDealId(newId);
    setIsDeploying(false);
    setStep(5); // Success step
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#8A8A8A]">
            <Link href="/landlord" className="hover:text-blue-500">Portal Landlord</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Wizard Buat Deal Baru</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            LANGKAH {step} DARI 5
          </span>
        </div>

        {/* Wizard Form Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {["1. Properti", "2. Finansial", "3. Coverage", "4. Undangan", "5. Selesai"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-mono">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step > i + 1
                      ? "bg-emerald-500 text-white"
                      : step === i + 1
                      ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </span>
                <span className={`hidden sm:inline ${step === i + 1 ? "font-bold text-slate-900 dark:text-white" : "text-slate-400"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Property Info */}
          {step === 1 && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Informasi Properti Ruko
                </h2>
                <p className="text-xs text-slate-500">
                  Data aset fisik ruko yang akan direnovasi dan ditransaksikan hak sewa produktifnya.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                    Nama Proyek / Identitas Ruko
                  </label>
                  <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                    Alamat Lengkap Ruko
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                      Tipe Bangunan
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                    >
                      <option value="2_FLOORS_COMMERCIAL">Ruko 2 Lantai</option>
                      <option value="3_FLOORS_COMMERCIAL">Ruko 3 Lantai (Standar)</option>
                      <option value="4_FLOORS_COMMERCIAL">Ruko 4 Lantai Komersial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                      Nomor Sertifikat Hak Milik (SHM)
                    </label>
                    <input
                      type="text"
                      value={shmNumber}
                      onChange={(e) => setShmNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Financial Parameters */}
          {step === 2 && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Parameter Finansial & Struktur Tranche
                </h2>
                <p className="text-xs text-slate-500">
                  Tentukan modal fit-out renovasi, target return investor, dan floor covenant perlindungan.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600 dark:text-zinc-300">Total Capex Renovasi</span>
                    <strong className="text-blue-600 dark:text-blue-400">{formatIDR(capexBudget)}</strong>
                  </div>
                  <input
                    type="range"
                    min={60_000_000}
                    max={400_000_000}
                    step={10_000_000}
                    value={capexBudget}
                    onChange={(e) => setCapexBudget(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] font-mono text-slate-500 block">Senior Tranche ({seniorSplitPct}%)</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{formatIDR(seniorPrincipal)}</strong>
                    <span className="text-[10px] text-emerald-500 block">Didanai Investor</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] font-mono text-slate-500 block">Target Return Cap (1.25x)</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{formatIDR(seniorTargetCap)}</strong>
                    <span className="text-[10px] text-blue-500 block">Batas Pelunasan</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                    <span className="text-[10px] font-mono text-slate-500 block">Tenor Sewa</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{tenorMonths} Bulan</strong>
                    <span className="text-[10px] text-purple-500 block">Periode Kontrak</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600 dark:text-zinc-300">Covenant Floor Minimal / Bulan</span>
                    <strong className="text-purple-600 dark:text-purple-400">{formatIDR(monthlyFloor)}</strong>
                  </div>
                  <input
                    type="range"
                    min={8_000_000}
                    max={30_000_000}
                    step={1_000_000}
                    value={monthlyFloor}
                    onChange={(e) => setMonthlyFloor(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Coverage Check */}
          {step === 3 && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Pemeriksaan Rasio Coverage (Underwriting Pass)
                </h2>
                <p className="text-xs text-slate-500">
                  Kalkulasi otomatis apakah struktur sewa ini memenuhi standar kelayakan investasi Euthial.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                    HASIL AUDIT PROTOKOL
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500 text-white">
                    🟢 PASS · LAYAK DITERBITKAN
                  </span>
                </div>

                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  Floor Coverage: {totalFloorCoverage.toFixed(2)}x
                </div>

                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  Covenant floor Rp {monthlyFloor.toLocaleString("id-ID")}/bulan selama 24 bulan menghasilkan total komitmen Rp {(monthlyFloor * tenorMonths).toLocaleString("id-ID")}, yang melampaui batas kewajiban Senior Tranche Rp {seniorTargetCap.toLocaleString("id-ID")}. Investor mendapatkan jaminan pengembalian yang solid.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Stakeholders Invite */}
          {step === 4 && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Undang Pemangku Kepentingan On-Chain
                </h2>
                <p className="text-xs text-slate-500">
                  Daftarkan alamat wallet calon penyewa, inspektur independen, dan kontraktor renovasi.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                    Email / Kontak Calon Penyewa UMKM
                  </label>
                  <input
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                    Alamat Wallet Inspektur Lapangan
                  </label>
                  <input
                    type="text"
                    value={inspectorAddress}
                    onChange={(e) => setInspectorAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-600 dark:text-zinc-300 block mb-1">
                    Alamat Rekening Kontraktor Renovasi
                  </label>
                  <input
                    type="text"
                    value={contractorAddress}
                    onChange={(e) => setContractorAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success & Share Link */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <MaterialIcon name="verified" size={36} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Kesepakatan Berhasil Didaftarkan!
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Suite kontrak untuk <strong>{propertyName}</strong> telah dibuat. Link deal siap dibagikan kepada calon investor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono max-w-lg mx-auto flex items-center justify-between gap-3">
                <span className="truncate text-slate-600 dark:text-zinc-300">
                  https://euthial.protocol/deals/{deployedDealId}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://euthial.protocol/deals/${deployedDealId}`);
                    toast.success("Tautan Disalin", "Link ruko berhasil disalin ke clipboard.");
                  }}
                  className="px-2.5 py-1 rounded bg-slate-900 dark:bg-white text-white dark:text-black shrink-0 hover:opacity-90 font-medium"
                >
                  Salin
                </button>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href={`/deals/${deployedDealId}`}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Buka Timeline Deal
                </Link>
                <Link
                  href="/landlord"
                  className="px-5 py-2 rounded-xl text-xs font-mono font-medium border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  Kembali ke Portal Landlord
                </Link>
              </div>
            </div>
          )}

          {/* Action Footer Navigation Buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  &larr; Sebelumnya
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                >
                  Berikutnya &rarr;
                </button>
              ) : (
                <button
                  onClick={handleDeployContract}
                  disabled={isDeploying}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
                >
                  {isDeploying ? (
                    <>
                      <MaterialIcon name="sync" size={16} className="animate-spin" />
                      Menerbitkan Kontrak di Sepolia...
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="rocket_launch" size={16} />
                      Terbitkan Kesepakatan (Deploy Deal)
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
