"use client";

import React from "react";
import { useApp, NavTab } from "../../context/AppContext";
import { MaterialIcon } from "../ui/MaterialIcon";

interface NavItem {
  id: NavTab;
  label: string;
  icon: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "scenarios", label: "Jury Scenario Deck", icon: "play_circle", badge: "Demo" },
  { id: "simulator", label: "Economic Sim", icon: "candlestick_chart" },
  { id: "audit", label: "Audit & Event Log", icon: "receipt_long" },
  { id: "contracts", label: "Smart Contracts", icon: "terminal" },
];

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useApp();

  return (
    <aside
      className={`h-[calc(100vh-32px)] bg-[#141414] border-r border-[rgba(207,207,207,0.10)] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] z-40 select-none ${
        isSidebarCollapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-12 border-b border-[rgba(207,207,207,0.10)] flex items-center justify-between px-3.5">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm">
                E
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm tracking-tight text-white leading-tight">
                  Euthial
                </span>
                <span className="text-[10px] text-[#8A8A8A] font-mono leading-none">
                  FitOut Protocol
                </span>
              </div>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 rounded-md bg-blue-600 mx-auto flex items-center justify-center font-mono font-bold text-sm text-white">
              E
            </div>
          )}
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-[#8A8A8A] hover:text-white p-1 rounded hover:bg-[rgba(255,255,255,0.06)] transition-colors"
          >
            <MaterialIcon
              name={isSidebarCollapsed ? "chevron_right" : "chevron_left"}
              size={18}
            />
          </button>
        </div>

        {/* Project Context Box (when expanded) */}
        {!isSidebarCollapsed && (
          <div className="p-3 mx-2 my-2.5 rounded-md bg-[#1A1A1A] border border-[rgba(207,207,207,0.08)]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A]">
              <span>ID: AGR-JBR-001</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">
                OPERATING
              </span>
            </div>
            <div className="text-xs font-medium text-[#E4E4E7] mt-1 truncate">
              Ruko Jl. Kalimantan, Jember
            </div>
            <div className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">
              Kedai Kopi Melati · 24 Bln
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors group relative ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-white font-semibold"
                    : "text-[#8A8A8A] hover:text-[#E4E4E7] hover:bg-[rgba(255,255,255,0.04)]"
                } ${isSidebarCollapsed ? "justify-center" : ""}`}
              >
                <MaterialIcon
                  name={item.icon}
                  size={18}
                  className={isActive ? "text-blue-400" : "text-[#8A8A8A] group-hover:text-white"}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-semibold">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on collapsed hover */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#27272A] text-white text-[11px] rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / System Meta */}
      <div className="p-3 border-t border-[rgba(207,207,207,0.10)]">
        {!isSidebarCollapsed ? (
          <div className="text-[11px] font-mono text-[#71717A] space-y-1">
            <div className="flex items-center justify-between">
              <span>Dual-Tranche</span>
              <span className="text-[#A1A1AA]">ERC-4626</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Attestation</span>
              <span className="text-[#A1A1AA]">EIP-712</span>
            </div>
            <div className="flex items-center justify-between text-[10px] pt-1 text-[#52525B]">
              <span>Sepolia v0.1.0</span>
              <span className="text-emerald-500 font-semibold">Synced</span>
            </div>
          </div>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto" title="Network Synced" />
        )}
      </div>
    </aside>
  );
};
