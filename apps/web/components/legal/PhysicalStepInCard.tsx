"use client";

import React, { useState } from "react";
import { useProtocol } from "../../context/ProtocolContext";
import { MaterialIcon } from "../ui/MaterialIcon";

export const PhysicalStepInCard: React.FC = () => {
  const { covenantStatus, activeScenario } = useProtocol();

  const isDefaultActive = covenantStatus === "BREACHED" || activeScenario === "S6";
  const [isSimulatingExecution, setIsSimulatingExecution] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(isDefaultActive ? 3 : 1);
  const [doorLockStatus, setDoorLockStatus] = useState<"NORMAL" | "REVOKED" | "STANDBY_DEPLOYED">(
    isDefaultActive ? "REVOKED" : "NORMAL"
  );
  const [lastPinRotation, setLastPinRotation] = useState<string>(
    isDefaultActive ? "2026-10-06 23:59:00 WIB" : "Belum Pernah Terpicu"
  );
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const handleSimulateStepIn = () => {
    setIsSimulatingExecution(true);
    setFeedbackToast("Menginisiasi eksekusi Grosse Akta Pengosongan Notariil...");
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setFeedbackToast("Memverifikasi Sertifikat Jaminan Fidusia AHU Kemenkumham...");
    }, 1200);

    setTimeout(() => {
      setActiveStep(3);
      setDoorLockStatus("REVOKED");
      setLastPinRotation(new Date().toLocaleString("id-ID") + " WIB");
      setFeedbackToast("IoT Gateway: PIN tenant dicabut, Master PIN dikirim ke Pemilik Ruko!");
    }, 2500);

    setTimeout(() => {
      setActiveStep(4);
      setDoorLockStatus("STANDBY_DEPLOYED");
      setIsSimulatingExecution(false);
      setFeedbackToast("Konsorsium Operator Pengganti resmi mengambil alih kedai!");
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 3800);
  };

  const handleResetLock = () => {
    setDoorLockStatus("NORMAL");
    setActiveStep(1);
    setFeedbackToast("Kredensial IoT Smart Lock dipulihkan ke Penyewa Utama.");
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const fidusiaAssets = [
    {
      name: "Mesin Espresso 2-Group (La Marzocco Linea)",
      spec: "Dual Boiler, Rotary Pump, PID",
      estValue: 78_000_000,
      ahuNumber: "AHU-FID-2026-0812",
      status: "TERDAFTAR & DIAMANKAN",
    },
    {
      name: "Grinder On-Demand (Mahlkönig + Mazzer)",
      spec: "Flat Burrs 98mm + Conical 64mm",
      estValue: 26_000_000,
      ahuNumber: "AHU-FID-2026-0813",
      status: "TERDAFTAR & DIAMANKAN",
    },
    {
      name: "Chiller Undercounter Stainless Steel 180cm",
      spec: "Food Grade 304, Digital Controller",
      estValue: 16_500_000,
      ahuNumber: "AHU-FID-2026-0814",
      status: "TERDAFTAR & DIAMANKAN",
    },
    {
      name: "Genset Silent 15 kVA (Backup Power)",
      spec: "Diesel 4-Cylinder, Soundproof Box",
      estValue: 19_500_000,
      ahuNumber: "AHU-FID-2026-0815",
      status: "TERDAFTAR & DIAMANKAN",
    },
  ];

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="bg-[#121214] border border-red-500/30 rounded-xl p-5 space-y-5 text-white">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-xs font-mono text-red-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <MaterialIcon name="verified_user" size={16} className="text-red-400" />
            <span>{feedbackToast}</span>
          </div>
          <span className="text-[10px] opacity-70">LEGAL EXECUTION LOG</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
            <MaterialIcon name="gavel" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-white">
                Protokol Eksekusi Fisik: Grosse Akta, Fidusia & IoT Door Lock
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                PASAL 224 HIR / 258 RBG
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Mitigasi sengketa fisik Pasal 167 KUHP. Eksekusi pengosongan ruko dan pengalihan operasional tanpa gugatan perdata berlarut-larut.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {doorLockStatus !== "NORMAL" ? (
            <button
              onClick={handleResetLock}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition flex items-center gap-1.5"
            >
              <MaterialIcon name="restart_alt" size={14} />
              <span>Reset Akses Normal</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateStepIn}
              disabled={isSimulatingExecution}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                isSimulatingExecution
                  ? "bg-red-800 text-white cursor-wait animate-pulse"
                  : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
              }`}
            >
              <MaterialIcon name="lock_reset" size={15} />
              <span>
                {isSimulatingExecution ? "Mengeksekusi..." : "Uji Eksekusi Step-In & Rotasi PIN IoT"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 4-Step Legal Pipeline Progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Step 1 */}
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono transition-all ${
            activeStep >= 1
              ? "bg-red-950/30 border-red-500/50 text-red-200"
              : "bg-white/[0.02] border-white/10 text-zinc-500"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-red-400">FASE 1</span>
            <span className="material-symbols-outlined text-sm">
              {activeStep >= 1 ? "check_circle" : "radio_button_unchecked"}
            </span>
          </div>
          <div className="font-bold text-white mb-0.5">Somasi & Cure Expired</div>
          <p className="text-[11px] opacity-80 leading-snug">
            Cure period 7 hari terlewati. Event <code>State.BREACHED</code> terkonfirmasi di smart contract.
          </p>
        </div>

        {/* Step 2 */}
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono transition-all ${
            activeStep >= 2
              ? "bg-red-950/30 border-red-500/50 text-red-200"
              : "bg-white/[0.02] border-white/10 text-zinc-500"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-red-400">FASE 2</span>
            <span className="material-symbols-outlined text-sm">
              {activeStep >= 2 ? "check_circle" : "radio_button_unchecked"}
            </span>
          </div>
          <div className="font-bold text-white mb-0.5">Grosse Akta Aktif</div>
          <p className="text-[11px] opacity-80 leading-snug">
            Irah-irah &quot;Demi Keadilan...&quot; berkekuatan hukum tetap. Parate executie tanpa sidang.
          </p>
        </div>

        {/* Step 3 */}
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono transition-all ${
            activeStep >= 3
              ? "bg-red-950/40 border-red-500/60 text-red-100 ring-1 ring-red-500/30"
              : "bg-white/[0.02] border-white/10 text-zinc-500"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-red-400">FASE 3</span>
            <span className="material-symbols-outlined text-sm">
              {activeStep >= 3 ? "lock" : "lock_open"}
            </span>
          </div>
          <div className="font-bold text-white mb-0.5">Rotasi PIN Smart Lock</div>
          <p className="text-[11px] opacity-80 leading-snug">
            Webhook Tuya mencabut PIN tenant jam 23:59. Master PIN dialihkan ke Pemilik Ruko.
          </p>
        </div>

        {/* Step 4 */}
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono transition-all ${
            activeStep >= 4
              ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
              : "bg-white/[0.02] border-white/10 text-zinc-500"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-emerald-400">FASE 4</span>
            <span className="material-symbols-outlined text-sm">
              {activeStep >= 4 ? "check_circle" : "radio_button_unchecked"}
            </span>
          </div>
          <div className="font-bold text-white mb-0.5">Operator Siaga Masuk</div>
          <p className="text-[11px] opacity-80 leading-snug">
            Konsorsium F&B Jember mengambil alih ruko &lt; 7 hari. Arus kas bagi hasil QRIS berlanjut.
          </p>
        </div>
      </div>

      {/* Grid: IoT Gateway Cockpit & Fidusia Collateral Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: IoT Door Lock Hardware Live Monitor */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#0e0e10] space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MaterialIcon name="meeting_room" size={18} className="text-red-400" />
              <span className="text-xs font-bold text-white">IoT Gateway: Pintu Ruko</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                doorLockStatus === "NORMAL"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse"
              }`}
            >
              {doorLockStatus === "NORMAL" ? "TENANT ACCESS OK" : "ACCESS REVOKED"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Device ID:</span>
              <span className="text-zinc-300">IOT-RUKO-JBR-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Hardware Model:</span>
              <span className="text-zinc-300">Tuya Commercial Smart Lock</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status Kunci:</span>
              <span className={doorLockStatus === "NORMAL" ? "text-emerald-400" : "text-red-400 font-bold"}>
                {doorLockStatus === "NORMAL"
                  ? "Akses Penyewa Aktif"
                  : "Master PIN Baru (Terenkripsi)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Waktu Rotasi Terakhir:</span>
              <span className="text-zinc-300 text-[11px]">{lastPinRotation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Penerima Kredensial:</span>
              <span className="text-amber-300 text-[11px]">
                {doorLockStatus === "NORMAL" ? "Penyewa (Kedai Melati)" : "Pemilik Ruko & Operator Siaga"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 text-[10px] text-zinc-500 leading-relaxed">
            *Webhook otomatis merotasi PIN pintu saat status on-chain beralih ke <code>STEP_IN</code>, mencegah penyewa menahan aset komersial.
          </div>
        </div>

        {/* Right 2 cols: Sertifikat Jaminan Fidusia Kemenkumham */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-white/10 bg-[#0e0e10] space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <MaterialIcon name="inventory_2" size={18} className="text-amber-400" />
              <span className="text-xs font-bold text-white">
                Sertifikat Jaminan Fidusia AHU Online (Total: Rp 140.000.000)
              </span>
            </div>
            <span className="text-[11px] text-amber-300">UU No. 42 / 1999</span>
          </div>

          <div className="space-y-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-500 text-[10px] border-b border-white/5 pb-1">
                  <th className="pb-1.5 font-normal">Aset Fit-Out</th>
                  <th className="pb-1.5 font-normal">Nilai Taksasi</th>
                  <th className="pb-1.5 font-normal">No. Akta AHU</th>
                  <th className="pb-1.5 font-normal text-right">Status Hak Preferen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fidusiaAssets.map((asset, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2 pr-2">
                      <div className="font-bold text-zinc-200">{asset.name}</div>
                      <div className="text-[10px] text-zinc-500">{asset.spec}</div>
                    </td>
                    <td className="py-2 pr-2 text-zinc-300 font-bold">
                      {formatIDR(asset.estValue)}
                    </td>
                    <td className="py-2 pr-2 text-amber-300 text-[11px]">
                      {asset.ahuNumber}
                    </td>
                    <td className="py-2 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Konsorsium Pengganti: <strong>Roastery Kopi Jember Bersatu</strong></span>
            <span className="text-emerald-400">SLA Take-Over: Maks. 7 Hari Kalender</span>
          </div>
        </div>
      </div>
    </div>
  );
};
