"use client";

import React, { useState } from "react";
import { useApp, NavTab } from "../../context/AppContext";
import { MaterialIcon } from "../ui/MaterialIcon";

interface NavItem {
  id: NavTab;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

interface SidebarSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ onOpenSearch?: () => void }> = () => {
  const { isSidebarCollapsed, toggleSidebar, activeTab, setActiveTab, setRole } = useApp();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const sections: SidebarSection[] = [
    {
      title: "Home",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      ],
    },
    {
      title: "All Tools",
      items: [
        { id: "dashboard", label: "Waterfall Engine", icon: "account_tree", badge: "Split" },
        { id: "simulator", label: "Economic Sim", icon: "candlestick_chart" },
        { id: "contracts", label: "Tranche Vaults", icon: "account_balance_wallet", badge: "ERC4626" },
        { id: "contracts", label: "Contractor Milestones", icon: "construction" },
      ],
    },
    {
      title: "Recent",
      items: [
        { id: "scenarios", label: "Jury Scenario Deck", icon: "play_circle", badge: "Live", badgeColor: "bg-emerald-500/10 text-[#10B981] border-emerald-500/20" },
        { id: "audit", label: "Attestation Event Log", icon: "receipt_long" },
      ],
    },
    {
      title: "Categories",
      items: [
        { id: "dashboard", label: "Senior Capital (80%)", icon: "trending_up" },
        { id: "dashboard", label: "Junior Buffer (20%)", icon: "security" },
        { id: "dashboard", label: "Tenant Escrow Bond", icon: "lock" },
      ],
    },
    {
      title: "Settings",
      items: [
        { id: "contracts", label: "Network & Deployments", icon: "lan", badge: "Sepolia" },
      ],
    },
  ];

  const handleNavClick = (item: NavItem) => {
    setActiveTab(item.id);

    if (item.label.includes("Senior Capital")) {
      setRole("INVESTOR");
    } else if (item.label.includes("Junior Buffer")) {
      setRole("LANDLORD");
    } else if (item.label.includes("Tenant Escrow")) {
      setRole("TENANT");
    }

    if (typeof window !== "undefined") {
      if (item.label === "Waterfall Engine") {
        setTimeout(() => {
          const el = document.getElementById("waterfall-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else if (item.label === "Jury Scenario Deck") {
        setTimeout(() => {
          const el = document.getElementById("scenarios-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
  };

  return (
    <aside
      className={`h-screen bg-[var(--sidebar-bg)] flex flex-col justify-between shrink-0 select-none z-40 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pt-4 ${
        isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      {/* Top: Logo row aligned with main panel height (pt-4) WITHOUT border-b */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo Profile Row: height 48px, perfectly level with main panel top (y = 16px to 64px), NO border-b */}
        <div className="h-12 flex items-center px-4 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden w-full">
              {/* 28x28 Logo / Profile Icon */}
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 shadow-sm">
                E
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-[13px] tracking-tight text-[var(--text-main)] leading-tight truncate">
                  Euthial Protocol
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono leading-none truncate">
                  Verifiable RBF Vault
                </span>
              </div>
            </div>
          ) : (
            /* Collapsed Mode Profile Button */
            <button
              type="button"
              onClick={toggleSidebar}
              title="Maximize Sidebar (Expand)"
              className="w-9 h-9 rounded-lg mx-auto flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                E
              </div>
            </button>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto py-2 px-0 space-y-2">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-0.5">
              {/* Section Header */}
              {!isSidebarCollapsed && sec.title && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {sec.title}
                </div>
              )}
              {isSidebarCollapsed && sec.title && (
                <div className="my-1.5 border-t border-[var(--border-soft)] mx-3" />
              )}

              {/* Nav Items */}
              {sec.items.map((item, itemIdx) => {
                const isActive = activeTab === item.id && secIdx === 0;
                const uniqueKey = `${secIdx}-${itemIdx}`;

                return (
                  <div key={uniqueKey} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      onMouseEnter={() => setHoveredKey(uniqueKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      className={`h-9 text-[13px] rounded-lg transition-colors flex items-center ${
                        isSidebarCollapsed
                          ? "w-9 h-9 mx-auto justify-center"
                          : "mx-2 px-2.5 gap-2.5 w-[calc(100%-16px)]"
                      } ${
                        isActive
                          ? "bg-[var(--active-bg)] text-[var(--text-main)] font-medium"
                          : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <MaterialIcon
                        name={item.icon}
                        size={16}
                        className={`shrink-0 ${
                          isActive ? "text-blue-500" : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                        }`}
                      />

                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border font-mono font-medium ${
                            item.badgeColor ||
                            "bg-[var(--input-bg)] border-[var(--border-soft)] text-[var(--text-muted)]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>

                    {/* Tooltip on Collapsed Mode */}
                    {isSidebarCollapsed && hoveredKey === uniqueKey && (
                      <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[var(--card-bg)] border border-[var(--border-soft)] text-[var(--text-main)] text-[12px] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono text-blue-400">
                              ({item.badge})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Context Box */}
      <div className="p-3 border-t border-[var(--border-soft)] shrink-0">
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>PILOT #01</span>
              <span className="text-[#10B981] font-semibold">ONLINE</span>
            </div>
            <div className="text-xs font-medium text-[var(--text-main)] truncate">
              Ruko Jl. Kalimantan
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">
              Jember Commercial Fit-Out
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand Sidebar"
            className="w-8 h-8 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] mx-auto flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </button>
        )}
      </div>
    </aside>
  );
};
