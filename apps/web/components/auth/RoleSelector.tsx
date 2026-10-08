"use client";

import React from "react";

export type RoleType = "INVESTOR" | "LANDLORD" | "TENANT" | "CONTRACTOR" | "INSPECTOR";

interface RoleOption {
  id: RoleType;
  title: string;
  badge: string;
  desc: string;
  icon: string;
  color: string;
  accent: string;
}

const ROLES: RoleOption[] = [
  {
    id: "INVESTOR",
    title: "Investor Modal (Senior)",
    badge: "Klaim Prioritas 1.25x",
    desc: "Menyalurkan modal renovasi ruko dan menerima bagi hasil harian otomatis via Waterfall.",
    icon: "trending_up",
    color: "from-blue-600/20 to-blue-900/10 border-blue-500/40 text-blue-400",
    accent: "bg-blue-500",
  },
  {
    id: "LANDLORD",
    title: "Pemilik Aset (Landlord)",
    badge: "Sewa 5% + Junior",
    desc: "Menyediakan ruko kosong, menyerap risiko junior tranche, dan menerima sewa pokok.",
    icon: "real_estate_agent",
    color: "from-purple-600/20 to-purple-900/10 border-purple-500/40 text-purple-400",
    accent: "bg-purple-500",
  },
  {
    id: "TENANT",
    title: "Pengelola Toko (Tenant)",
    badge: "Omzet 80% + Bond",
    desc: "Menyetor jaminan komitmen 10%, menjalankan bisnis kafe/ritel, dan setor harian via QRIS.",
    icon: "storefront",
    color: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/40 text-emerald-400",
    accent: "bg-emerald-500",
  },
  {
    id: "CONTRACTOR",
    title: "Mitra Kontraktor",
    badge: "2-of-3 Multisig",
    desc: "Mengeksekusi renovasi fisik dan mencairkan termin bertahap langsung ke wallet usaha.",
    icon: "construction",
    color: "from-orange-600/20 to-orange-900/10 border-orange-500/40 text-orange-400",
    accent: "bg-orange-500",
  },
  {
    id: "INSPECTOR",
    title: "Inspektur Lapangan",
    badge: "Verifikator Fisik",
    desc: "Memeriksa bukti fisik progres konstruksi dan memberikan approval on-chain netral.",
    icon: "engineering",
    color: "from-amber-600/20 to-amber-900/10 border-amber-500/40 text-amber-400",
    accent: "bg-amber-500",
  },
];

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelect: (role: RoleType) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="text-xs font-mono text-zinc-400">
        Pilih peran utama Anda dalam ekosistem pembiayaan ruko:
      </div>
      <div className="grid gap-2.5">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelect(role.id)}
              className={`p-3.5 rounded-[12px] border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                isSelected
                  ? `bg-gradient-to-r ${role.color} shadow-lg ring-1 ring-white/20`
                  : "bg-[#151515] border-white/10 hover:border-white/20 hover:bg-[#1A1A1A]"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border transition-all ${
                  isSelected
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-zinc-900 border-white/5 text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{role.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-zinc-100 truncate">
                    {role.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                      isSelected
                        ? "bg-white/20 border-white/30 text-white font-bold"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {role.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {role.desc}
                </p>
              </div>

              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-4 right-4 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
