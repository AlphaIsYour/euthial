"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

interface Milestone {
  id: number;
  title: string;
  amount: number;
  status: "COMPLETED" | "IN_REVIEW" | "PENDING";
  approvals: string;
  evidenceHash: string;
}

const initialMilestones: Milestone[] = [
  {
    id: 1,
    title: "Bongkar & Struktur Partisi Ruko",
    amount: 45000000,
    status: "COMPLETED",
    approvals: "3 of 3 Approved",
    evidenceHash: "0x8f43...9b21",
  },
  {
    id: 2,
    title: "Instalasi Kelistrikan & Jalur Plumbing Bar",
    amount: 60000000,
    status: "COMPLETED",
    approvals: "3 of 3 Approved",
    evidenceHash: "0x3e17...4a8c",
  },
  {
    id: 3,
    title: "Finishing Interior, Bar Counter & Mesin Espresso",
    amount: 45000000,
    status: "IN_REVIEW",
    approvals: "1 of 2 Signed",
    evidenceHash: "0xa21d...7f65",
  },
];

export const InspectorView: React.FC = () => {
  const [milestones, setMilestones] = useState(initialMilestones);
  const [evidenceInput, setEvidenceInput] = useState("0xa21d...7f65");

  const handleSign = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "COMPLETED", approvals: "2 of 2 Approved (Released)" }
          : m
      )
    );
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Verifikasi Milestone Fisik & Rilis Dana Renovasi
          </h3>
          <p className="text-xs text-[#8A8A8A]">
            Pelepasan dana capex renovasi ruko memerlukan bukti fisik terverifikasi dengan ambang batas multisig 2-dari-3.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-md text-amber-400">
          Role: Inspektur Independen
        </span>
      </div>

      <div className="space-y-3">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="p-4 bg-[#1A1A1A] border border-[rgba(207,207,207,0.08)] rounded-card flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#8A8A8A]">
                  #{m.id}
                </span>
                <span className="text-sm font-medium text-white">{m.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    m.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A]">
                <span>Nilai: {formatIDR(m.amount)}</span>
                <span>·</span>
                <span>Bukti: {m.evidenceHash}</span>
                <span>·</span>
                <span>Status: {m.approvals}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {m.status !== "COMPLETED" ? (
                <button
                  onClick={() => handleSign(m.id)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-card flex items-center gap-1.5 transition-colors"
                >
                  <MaterialIcon name="draw" size={16} />
                  <span>Sign & Approve (Release Fund)</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <MaterialIcon name="check_circle" size={16} />
                  Dana Telah Dicairkan
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
