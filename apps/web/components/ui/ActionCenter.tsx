"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { useProtocol } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { useLanguageMode } from "../../hooks/useLanguageMode";
import { MaterialIcon } from "./MaterialIcon";

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
      <div className="p-3.5 mb-6 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black text-slate-700 dark:text-zinc-300 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-slate-900 dark:text-white">Operasional Normal: </span>
            <span className="text-slate-500 dark:text-[#8A8A8A]">Tidak ada tindakan mendesak yang membutuhkan intervensi saat ini.</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
          Optimal
        </span>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
          <MaterialIcon name="notifications" size={14} className="text-slate-500" />
          Action Center · Tindakan Menunggu
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-medium">
          {roleActions.length} Tindakan
        </span>
      </div>

      <div className="grid gap-3">
        {roleActions.map((action) => {
          const isUrgent = action.priority === "urgent";

          return (
            <div
              key={action.id}
              className="p-4 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-black transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                  <MaterialIcon
                    name={isUrgent ? "priority_high" : "schedule"}
                    size={16}
                  />
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-sm leading-tight flex items-center gap-2 text-slate-900 dark:text-white">
                    <span>{action.title}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {action.priority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-[#8A8A8A]">{action.description}</div>
                  {action.metadata && (
                    <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 pt-0.5">
                      {action.metadata}
                    </div>
                  )}
                </div>
              </div>

              {action.buttonLabel && action.onAction && (
                <button
                  onClick={action.onAction}
                  className="shrink-0 h-8 px-3.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-100 text-white transition-all shadow-xs"
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
