"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useProtocol, type Milestone } from "../../context/ProtocolContext";
import { useWeb3 } from "../../context/Web3Context";
import { AddressBadge } from "../ui/AddressBadge";
import { TxLink } from "../ui/TxLink";

interface MultiSigApprovalModalProps {
  milestone: Milestone;
  isOpen: boolean;
  onClose: () => void;
}

export const MultiSigApprovalModal: React.FC<MultiSigApprovalModalProps> = ({
  milestone,
  isOpen,
  onClose,
}) => {
  const { approveLandlordMilestone, signInspectorMilestone } = useProtocol();
  const { approveMilestone, isWalletConnected, address } = useWeb3();

  const [actingRole, setActingRole] = useState<"LANDLORD" | "INSPECTOR" | "TENANT">("INSPECTOR");
  const [evidenceHash, setEvidenceHash] = useState(milestone.evidenceHash);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txConfirmed, setTxConfirmed] = useState(false);

  if (!isOpen) return null;

  const approvals = milestone.approvals;
  const approvalCount = [approvals.landlord, approvals.inspector, approvals.tenant].filter(Boolean).length;
  const isThresholdMet = approvalCount >= 2;
  const isReleased = milestone.status === "RELEASED";

  const handleSignVote = async () => {
    setIsSubmitting(true);
    try {
      if (isWalletConnected) {
        await approveMilestone(milestone.id);
      }

      if (actingRole === "LANDLORD") {
        approveLandlordMilestone(milestone.id);
      } else if (actingRole === "INSPECTOR") {
        signInspectorMilestone(milestone.id, evidenceHash);
      }

      setTxConfirmed(true);
      setTimeout(() => {
        setTxConfirmed(false);
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0E0E12] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                2-OF-3 MULTISIG ESCROW
              </span>
              <span className="text-xs font-mono text-slate-400">
                Termin #{milestone.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {milestone.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <MaterialIcon name="close" size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Milestone Financial Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-500">Nilai Termin Dicairkan:</span>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {formatIDR(milestone.amount)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-500">Status Quorum:</span>
              <div
                className={`text-sm font-bold font-mono ${
                  isReleased
                    ? "text-emerald-500"
                    : isThresholdMet
                    ? "text-blue-500"
                    : "text-amber-500"
                }`}
              >
                {approvalCount}/3 TANDA TANGAN {isThresholdMet ? "(TERPENUHI ✓)" : "(BUTUH 2)"}
              </div>
            </div>
          </div>

          {/* 3-Stakeholder Signature Breakdown (Issue #52 requirement) */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 block">
              STATUS TANDA TANGAN KRIPTOGRAFIS PARA PIHAK:
            </span>

            {/* Landlord */}
            <div className="p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name={approvals.landlord ? "check_circle" : "hourglass_empty"}
                  size={18}
                  className={approvals.landlord ? "text-emerald-500" : "text-slate-400"}
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Pemilik Ruko (Landlord)</span>
                  <div className="text-[10px] text-slate-400">0x7099...79C8</div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  approvals.landlord
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                }`}
              >
                {approvals.landlord ? "APPROVED ✓" : "MENUNGGU"}
              </span>
            </div>

            {/* Inspector */}
            <div className="p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name={approvals.inspector ? "check_circle" : "hourglass_empty"}
                  size={18}
                  className={approvals.inspector ? "text-emerald-500" : "text-slate-400"}
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Inspektur Lapangan (Auditor Fisik)</span>
                  <div className="text-[10px] text-slate-400">0x15d3...6A65</div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  approvals.inspector
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                }`}
              >
                {approvals.inspector ? "APPROVED ✓" : "MENUNGGU"}
              </span>
            </div>

            {/* Tenant */}
            <div className="p-3 rounded-xl border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name={approvals.tenant ? "check_circle" : "hourglass_empty"}
                  size={18}
                  className={approvals.tenant ? "text-emerald-500" : "text-slate-400"}
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Penyewa (Pengelola Toko)</span>
                  <div className="text-[10px] text-slate-400">0x3C44...93BC</div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  approvals.tenant
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-400"
                }`}
              >
                {approvals.tenant ? "APPROVED ✓" : "MENUNGGU"}
              </span>
            </div>
          </div>

          {/* Interactive Role Action Selector */}
          {!isReleased && (
            <div className="p-4 rounded-xl bg-blue-50/30 dark:bg-blue-950/20 border border-blue-500/30 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MaterialIcon name="signature" size={16} className="text-blue-500" />
                Tandatangani Persetujuan Sebagai:
              </div>

              <div className="flex gap-2">
                {(["INSPECTOR", "LANDLORD", "TENANT"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setActingRole(r)}
                    className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg transition-colors ${
                      actingRole === r
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {actingRole === "INSPECTOR" && (
                <div>
                  <label className="text-[11px] font-mono text-slate-500 block mb-1">
                    Hash Bukti Fisik IPFS (Evidence Hash):
                  </label>
                  <input
                    type="text"
                    value={evidenceHash}
                    onChange={(e) => setEvidenceHash(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-700 dark:hover:text-white"
          >
            Tutup
          </button>

          {!isReleased && (
            <button
              onClick={handleSignVote}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <MaterialIcon name="sync" size={16} className="animate-spin" />
                  Merekam Signature On-Chain...
                </>
              ) : txConfirmed ? (
                <>
                  <MaterialIcon name="check" size={16} />
                  Signature Terkonfirmasi!
                </>
              ) : (
                <>
                  <MaterialIcon name="draw" size={16} />
                  Kirim Tanda Tangan ({actingRole})
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
