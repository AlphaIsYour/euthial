"use client";

import React, { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useApp, NavTab, UserRole } from "../../context/AppContext";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Role Perspective" | "Scenario Preset" | "Protocols & Contracts";
  icon: string;
  action: () => void;
  badge?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setRole } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: SearchItem[] = [
    {
      id: "nav-dash",
      title: "Dashboard Overview",
      subtitle: "Main control panel with 4-role view & active stats",
      category: "Navigation",
      icon: "dashboard",
      action: () => {
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "nav-scenarios",
      title: "Jury Scenario Controller Deck",
      subtitle: "Simulate S1 Normal, S4 Cash Leakage, and S6 Default",
      category: "Navigation",
      icon: "play_circle",
      badge: "Demo",
      action: () => {
        setActiveTab("scenarios");
        onClose();
        setTimeout(() => {
          const el = document.getElementById("scenarios-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
    },
    {
      id: "nav-simulator",
      title: "Economic Waterfall Simulator",
      subtitle: "Pure deterministic financial engine view",
      category: "Navigation",
      icon: "candlestick_chart",
      action: () => {
        setActiveTab("simulator");
        onClose();
      },
    },
    {
      id: "nav-contracts",
      title: "Smart Contracts & Specs",
      subtitle: "MockIDR, TrancheVault, WaterfallRouter, FitOutAgreement",
      category: "Navigation",
      icon: "terminal",
      action: () => {
        setActiveTab("contracts");
        onClose();
      },
    },
    {
      id: "role-investor",
      title: "Switch to Senior Investor Perspective",
      subtitle: "View capital recovery, vault liquidity, and senior claim progress",
      category: "Role Perspective",
      icon: "trending_up",
      badge: "Senior",
      action: () => {
        setRole("INVESTOR");
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "role-landlord",
      title: "Switch to Landlord Perspective",
      subtitle: "View 5% turnover rent, junior first-loss protection, lease covenants",
      category: "Role Perspective",
      icon: "real_estate_agent",
      badge: "Landlord",
      action: () => {
        setRole("LANDLORD");
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "role-tenant",
      title: "Switch to Tenant (Kedai) Perspective",
      subtitle: "View QRIS net revenue, remaining bond balance, cure window alerts",
      category: "Role Perspective",
      icon: "storefront",
      badge: "Tenant",
      action: () => {
        setRole("TENANT");
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "role-inspector",
      title: "Switch to Inspector Perspective",
      subtitle: "Inspect physical fit-out milestones and co-sign tranche disbursements",
      category: "Role Perspective",
      icon: "engineering",
      badge: "Inspector",
      action: () => {
        setRole("INSPECTOR");
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "role-contractor",
      title: "Switch to Contractor Perspective",
      subtitle: "Monitor fit-out milestone stages and milestone escrow disbursements",
      category: "Role Perspective",
      icon: "construction",
      badge: "Contractor",
      action: () => {
        setRole("CONTRACTOR");
        setActiveTab("dashboard");
        onClose();
      },
    },
    {
      id: "scen-s1",
      title: "S1: Normal Baseline (100% Revenue)",
      subtitle: "Full revenue, Senior tranche repaid M14, Junior M18, enters Residual",
      category: "Scenario Preset",
      icon: "check_circle",
      badge: "S1",
      action: () => {
        setActiveTab("dashboard");
        onClose();
        setTimeout(() => {
          const el = document.getElementById("scenarios-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
    },
    {
      id: "scen-s4",
      title: "S4: Tenant Cash Leakage (30% Skimming)",
      subtitle: "Payment floor shortfall triggered, bond partially drawn, no eviction",
      category: "Scenario Preset",
      icon: "warning",
      badge: "S4",
      action: () => {
        setActiveTab("dashboard");
        onClose();
        setTimeout(() => {
          const el = document.getElementById("scenarios-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
    },
    {
      id: "scen-s6",
      title: "S6: Early Tenant Default (Month 6)",
      subtitle: "Floor breached consecutively, bond drawn fully, step-in recovery",
      category: "Scenario Preset",
      icon: "cancel",
      badge: "S6",
      action: () => {
        setActiveTab("dashboard");
        onClose();
        setTimeout(() => {
          const el = document.getElementById("scenarios-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
    },
    {
      id: "proto-waterfall",
      title: "Waterfall Split Protocol",
      subtitle: "5% Landlord, 15% Investor Pool (Senior first), 80% Tenant",
      category: "Protocols & Contracts",
      icon: "account_tree",
      action: () => {
        setActiveTab("dashboard");
        onClose();
        setTimeout(() => {
          const el = document.getElementById("waterfall-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev - 1 < 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-[12vh] px-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[512px] bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-soft)]">
          <MaterialIcon name="search" size={18} className="text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search tools, roles, scenarios, contracts..."
            className="flex-1 bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--hover-bg)] border border-[var(--border-soft)] text-[var(--text-muted)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] font-mono">
              No matching tools or actions found
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[var(--active-bg)] text-[var(--text-main)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-[var(--hover-bg)] text-[var(--text-muted)]"
                      }`}
                    >
                      <MaterialIcon name={item.icon} size={16} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-[var(--text-main)] truncate flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-500">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-70 ml-2 shrink-0">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Hints */}
        <div className="px-3 py-2 border-t border-[var(--border-soft)] bg-[var(--panel-bg)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-[var(--hover-bg)] border border-[var(--border-soft)]">↑</kbd>
              <kbd className="px-1 rounded bg-[var(--hover-bg)] border border-[var(--border-soft)]">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-[var(--hover-bg)] border border-[var(--border-soft)]">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <div>Euthial Protocol</div>
        </div>
      </div>
    </div>
  );
};
