"use client";

import React from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export type RoleType = "INVESTOR" | "LANDLORD" | "TENANT" | "CONTRACTOR" | "INSPECTOR";

interface RoleOption {
  id: RoleType;
  title: string;
  badge: string;
  desc: string;
  icon: string;
}

const ROLES: RoleOption[] = [
  {
    id: "INVESTOR",
    title: "Investor Modal (Senior)",
    badge: "Prioritas 1.25x Cap",
    desc: "Menyalurkan modal renovasi dan menerima arus kas harian terverifikasi.",
    icon: "trending_up",
  },
  {
    id: "LANDLORD",
    title: "Pemilik Ruko (Landlord)",
    badge: "Sewa 5% + Junior",
    desc: "Menyediakan aset ruko, menyerap risiko junior tranche, dan menerima sewa.",
    icon: "domain",
  },
  {
    id: "TENANT",
    title: "Penyewa Kedai (Tenant)",
    badge: "Kasir 80% + Bond",
    desc: "Menyetor jaminan 10%, mengoperasikan bisnis, dan setor harian via QRIS.",
    icon: "storefront",
  },
  {
    id: "CONTRACTOR",
    title: "Mitra Kontraktor",
    badge: "Termin Konstruksi",
    desc: "Mengeksekusi renovasi fisik dan mencairkan termin bertahap via smart contract.",
    icon: "construction",
  },
  {
    id: "INSPECTOR",
    title: "Inspektur Lapangan",
    badge: "2-of-3 Multisig",
    desc: "Memvalidasi bukti fisik progres ruko sebelum termin dana dapat dicairkan.",
    icon: "verified",
  },
];

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelect: (role: RoleType) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-600 font-medium">
        Pilih peran utama Anda di ekosistem:
      </div>
      <div className="grid gap-2">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className={`p-2.5 rounded-lg border text-left transition-all duration-150 flex items-start gap-2.5 ${
                isSelected
                  ? "bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-2xs"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                <MaterialIcon name={role.icon} size={15} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 truncate">
                    {role.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      isSelected
                        ? "bg-slate-900 border-slate-900 text-white font-medium"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    {role.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {role.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
