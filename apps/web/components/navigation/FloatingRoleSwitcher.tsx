"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";

const portals = [
  { href: "/", label: "Hub", icon: "hub", color: "text-zinc-400" },
  { href: "/tenant", label: "Tenant", icon: "storefront", color: "text-emerald-400" },
  { href: "/investor", label: "Investor", icon: "trending_up", color: "text-blue-400" },
  { href: "/landlord", label: "Landlord", icon: "real_estate_agent", color: "text-purple-400" },
  { href: "/contractor", label: "Kontraktor", icon: "construction", color: "text-orange-400" },
  { href: "/inspector", label: "Inspektur", icon: "engineering", color: "text-amber-400" },
  { href: "/demo", label: "Jury Demo", icon: "play_circle", color: "text-red-400" },
];

export const FloatingRoleSwitcher: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { currentMonth, activeScenario } = useProtocol();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center shadow-2xl select-none font-mono">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="h-9 px-3 bg-[#18181B] hover:bg-[#27272A] border border-[rgba(207,207,207,0.18)] text-xs text-white rounded-full flex items-center gap-2 transition-all shadow-lg backdrop-blur-md"
          title="Buka Menu Cepat Demo"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px]">Bln {currentMonth} ({activeScenario})</span>
          <MaterialIcon name="open_in_full" size={14} className="text-[#A1A1AA]" />
        </button>
      ) : (
        <div className="bg-[#141414]/95 border border-[rgba(207,207,207,0.15)] rounded-card p-1.5 flex items-center gap-1 backdrop-blur-md shadow-2xl">
          {/* Status Capsule */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#1E1E22] rounded text-[10px] text-[#A1A1AA] border border-[rgba(207,207,207,0.06)] mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>M{currentMonth}</span>
            <span className="text-[#52525B]">·</span>
            <span className="text-white font-bold">{activeScenario}</span>
          </div>

          {/* Portal Switch Buttons */}
          {portals.map((p) => {
            const isActive = pathname === p.href;
            return (
              <Link
                key={p.href}
                href={p.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-all ${
                  isActive
                    ? "bg-[#27272A] text-white font-semibold shadow-sm border border-[rgba(207,207,207,0.2)]"
                    : "text-[#8A8A8A] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                <MaterialIcon name={p.icon} size={14} className={isActive ? p.color : "text-[#71717A]"} />
                <span className="text-[11px]">{p.label}</span>
              </Link>
            );
          })}

          {/* Minimize Button */}
          <button
            onClick={() => setCollapsed(true)}
            title="Ciutkan"
            className="p-1 rounded text-[#71717A] hover:text-white hover:bg-[rgba(255,255,255,0.06)] ml-1 transition-colors"
          >
            <MaterialIcon name="close_fullscreen" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
