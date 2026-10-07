"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { useLanguageMode } from "../../hooks/useLanguageMode";

export interface ActionItem {
  id: string;
  role: "INVESTOR" | "LANDLORD" | "TENANT" | "INSPECTOR" | "ALL";
  priority: "urgent" | "pending" | "info";
  title: string;
  description: string;
  buttonLabel?: string;
  onAction?: () => void;
  metadata?: string;
}

export const ActionCenter: React.FC = () => {
  const { role } = useApp();
  const protocol = useProtocol();
  const web3 = useWeb3();
  const { term } = useLanguageMode();

  const actions: ActionItem[] = [];

  // 1. LANDLORD ACTIONS
  const pendingLandlordMilestone = protocol.milestones.find(
    (m) => m.status !== "RELEASED" && !m.approvals.landlord
  );
  if (pendingLandlordMilestone && (role === "LANDLORD" || role === "ALL" as any)) {
    actions.push({
      id: `landlord-ms-${pendingLandlordMilestone.id}`,
      role: "LANDLORD",
      priority: "pending",
      title: `Perlu Persetujuan Anda — Termin #${pendingLandlordMilestone.id}: ${pendingLandlordMilestone.title}`,
      description: `Nilai: Rp ${pendingLandlordMilestone.amount.toLocaleString("id-ID")}. Menunggu persetujuan pemilik ruko agar dana dapat cair ke kontraktor.`,
      metadata: `Inspektur: ${pendingLandlordMilestone.approvals.inspector ? "Sudah ✅" : "Menunggu ⏳"} | Pengelola: ${pendingLandlordMilestone.approvals.tenant ? "Sudah ✅" : "Menunggu ⏳"}`,
      buttonLabel: "Setujui Termin Ini →",
      onAction: () => web3.approveMilestone(pendingLandlordMilestone.id),
    });
  }

  // 2. INVESTOR ACTIONS
  if (protocol.idleCashSenior > 0 && (role === "INVESTOR" || role === "ALL" as any)) {
    actions.push({
      id: "investor-withdraw",
      role: "INVESTOR",
      priority: "info",
      title: `Dana Bagi Hasil Siap Ditarik: Rp ${protocol.idleCashSenior.toLocaleString("id-ID")}`,
      description: `Hasil pembagian pendapatan ${term("waterfallDistribution")} bulan ke-${protocol.currentMonth} telah tersedia di rekening vault Anda.`,
      buttonLabel: "Tarik Kas Dividen →",
      onAction: () => web3.withdrawSeniorCash(protocol.idleCashSenior),
    });
  }

  // 3. TENANT ACTIONS
  if (
    (protocol.covenantStatus === "WARNING" || protocol.covenantStatus === "CURE") &&
    (role === "TENANT" || role === "ALL" as any)
  ) {
    const shortfall = Math.max(0, 40000000 - protocol.grossMonthly);
    actions.push({
      id: "tenant-covenant-alert",
      role: "TENANT",
      priority: "urgent",
      title: `⚠️ ${term("covenantBreach")} — Pendapatan Bulan Ini di Bawah Target`,
      description: `Omzet tercatat Rp ${protocol.grossMonthly.toLocaleString("id-ID")}, kurang Rp ${shortfall.toLocaleString("id-ID")} dari target minimum. Masa tenggang (cure period) sedang berjalan.`,
      metadata: `Sisa Saldo Jaminan: Rp ${protocol.bondBalance.toLocaleString("id-ID")}`,
      buttonLabel: "Top Up Uang Jaminan Sekarang →",
      onAction: () => web3.cureTopUp(shortfall || 5000000),
    });
  }

  // 4. INSPECTOR ACTIONS
  const pendingInspectorMilestone = protocol.milestones.find(
    (m) => m.status !== "RELEASED" && !m.approvals.inspector
  );
  if (pendingInspectorMilestone && (role === "INSPECTOR" || role === "ALL" as any)) {
    actions.push({
      id: `inspector-ms-${pendingInspectorMilestone.id}`,
      role: "INSPECTOR",
      priority: "pending",
      title: `Verifikasi Fisik Lapangan — Termin #${pendingInspectorMilestone.id}: ${pendingInspectorMilestone.title}`,
      description: `Lakukan checklist fisik dan validasi bukti renovasi sebelum membubuhkan tanda tangan verifikasi on-chain.`,
      metadata: `Evidence Hash: ${pendingInspectorMilestone.evidenceHash.slice(0, 16)}...`,
      buttonLabel: "Verifikasi Lapangan →",
      onAction: () => protocol.signInspectorMilestone(pendingInspectorMilestone.id),
    });
  }

  // Filter actions for current role
  const roleActions = actions.filter((a) => a.role === role || a.role === "ALL");

  if (roleActions.length === 0) {
    return (
      <div className="p-4 mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-500 text-xl">
            check_circle
          </span>
          <div>
            <div className="font-semibold text-sm">Semua Tugas Berjalan Lancar</div>
            <div className="text-xs opacity-80">
              Tidak ada tindakan mendesak yang membutuhkan intervensi Anda saat ini.
            </div>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-emerald-500/20 px-2.5 py-1 rounded-md font-bold">
          Status: Optimal
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-amber-500 animate-pulse">
            notifications_active
          </span>
          Action Center · Yang Perlu Anda Lakukan Sekarang
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
          {roleActions.length} Tindakan Menunggu
        </span>
      </div>

      <div className="grid gap-3">
        {roleActions.map((action) => {
          const isUrgent = action.priority === "urgent";
          const isPending = action.priority === "pending";

          return (
            <div
              key={action.id}
              className={`p-4 rounded-xl border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isUrgent
                  ? "bg-red-500/10 border-red-500/40 text-red-950 dark:text-red-200"
                  : isPending
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-200"
                  : "bg-blue-500/10 border-blue-500/40 text-blue-950 dark:text-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`material-symbols-outlined text-2xl shrink-0 mt-0.5 ${
                    isUrgent
                      ? "text-red-500 animate-bounce"
                      : isPending
                      ? "text-amber-500"
                      : "text-blue-500"
                  }`}
                >
                  {isUrgent ? "warning" : isPending ? "schedule" : "info"}
                </span>

                <div className="space-y-1">
                  <div className="font-bold text-sm leading-tight flex items-center gap-2">
                    <span>{action.title}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        isUrgent
                          ? "bg-red-500/20 text-red-700 dark:text-red-300"
                          : isPending
                          ? "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                          : "bg-blue-500/20 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {action.priority}
                    </span>
                  </div>
                  <div className="text-xs opacity-90">{action.description}</div>
                  {action.metadata && (
                    <div className="text-[11px] font-mono opacity-75 pt-0.5">
                      {action.metadata}
                    </div>
                  )}
                </div>
              </div>

              {action.buttonLabel && action.onAction && (
                <button
                  onClick={action.onAction}
                  className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-150 shadow-md ${
                    isUrgent
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : isPending
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {action.buttonLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
