"use client";

import React, { useState, useEffect } from "react";
import { AppProvider, useApp, UserRole, NavTab } from "../context/AppContext";
import { Shell } from "../components/layout/Shell";
import { WaterfallVisualizer } from "../components/waterfall/WaterfallVisualizer";
import { TrancheClaimCards } from "../components/waterfall/TrancheClaimCards";
import { InvestorView } from "../components/roles/InvestorView";
import { LandlordView } from "../components/roles/LandlordView";
import { TenantView } from "../components/roles/TenantView";
import { InspectorView } from "../components/roles/InspectorView";
import { CovenantChart } from "../components/charts/CovenantChart";
import { ScenarioControllerPanel } from "../components/scenario/ScenarioControllerPanel";
import { EconomicSimulatorView } from "../components/simulator/EconomicSimulatorView";
import { ContractSpecsView } from "../components/contracts/ContractSpecsView";
import { MaterialIcon } from "../components/ui/MaterialIcon";

// 4 Active Roles
const roleItems: { role: UserRole; label: string; icon: string; desc: string; badge: string }[] = [
  {
    role: "INVESTOR",
    label: "Senior Investor",
    icon: "trending_up",
    desc: "Capital recovery & 1.25x cap target",
    badge: "Senior (80%)",
  },
  {
    role: "LANDLORD",
    label: "Pemilik Ruko",
    icon: "real_estate_agent",
    desc: "5% turnover rent & 1.40x first-loss buffer",
    badge: "Junior (20%)",
  },
  {
    role: "TENANT",
    label: "Tenant Kedai",
    icon: "storefront",
    desc: "Retains 80% daily QRIS & escrow bond safety",
    badge: "Kedai Kopi Melati",
  },
  {
    role: "INSPECTOR",
    label: "Inspektur Lapangan",
    icon: "engineering",
    desc: "Physical fit-out milestone approval & co-sign",
    badge: "Multi-Sig Milestone",
  },
];

interface ToolCardItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  badge: string;
  badgeType: "popular" | "new";
  tab?: NavTab;
  scrollId?: string;
}

// Section: Recently Used Tools
const recentlyUsedTools: ToolCardItem[] = [
  {
    id: "tool-deck",
    title: "Jury Scenario Controller Deck",
    desc: "Interactive stress-test deck for evaluating S1 Normal, S4 Cash Skimming 30%, and S6 Early Default.",
    icon: "play_circle",
    badge: "New",
    badgeType: "new",
    scrollId: "scenarios-section",
  },
  {
    id: "tool-waterfall",
    title: "Waterfall Settlement Engine",
    desc: "Automated split of gross sales: 80% tenant retain, 15% investor pool (senior-first), 5% landlord.",
    icon: "account_tree",
    badge: "New",
    badgeType: "new",
    scrollId: "waterfall-section",
  },
  {
    id: "tool-covenant",
    title: "Payment Floor & Escrow Bond",
    desc: "Cumulative payment floor curve with 7-day cure window and automated bond draw preventing early eviction.",
    icon: "verified_user",
    badge: "Popular",
    badgeType: "popular",
    scrollId: "covenant-section",
  },
];

// Section: Popular Protocols & Tools
const popularTools: ToolCardItem[] = [
  {
    id: "tool-vaults",
    title: "Dual-Tranche Vaults (ERC-4626)",
    desc: "Internal cash accounting preventing donation attacks. Senior 1.25x cap and Junior 1.40x first-loss buffer.",
    icon: "account_balance_wallet",
    badge: "Popular",
    badgeType: "popular",
    tab: "contracts",
  },
  {
    id: "tool-simulator",
    title: "Monte Carlo Economic Simulator",
    desc: "Run 100+ revenue Monte Carlo simulations under varied footfall, churn, and macroeconomic stress.",
    icon: "candlestick_chart",
    badge: "Popular",
    badgeType: "popular",
    tab: "simulator",
  },
  {
    id: "tool-milestone",
    title: "Contractor Milestone Escrow",
    desc: "Tranche disbursement gated by 2-of-3 multi-signature approvals (Tenant, Landlord, Independent Inspector).",
    icon: "construction",
    badge: "Popular",
    badgeType: "popular",
    tab: "contracts",
  },
];

// Section: Category Quick Access Cards
const categories = [
  { title: "Senior Tranche Vault", subtitle: "Rp 120M Pokok (80%)", role: "INVESTOR" as UserRole },
  { title: "Junior Tranche Vault", subtitle: "Rp 30M First-Loss (20%)", role: "LANDLORD" as UserRole },
  { title: "Tenant Escrow Bond", subtitle: "Rp 15M Jaminan (10%)", role: "TENANT" as UserRole },
  { title: "Daily QRIS Velocity", subtitle: "~Rp 2.370.000 / hari", role: "INVESTOR" as UserRole },
];

const DashboardMainContent: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab } = useApp();
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleToolClick = (tool: ToolCardItem) => {
    if (tool.tab) {
      setActiveTab(tool.tab);
    } else if (tool.scrollId) {
      if (activeTab !== "dashboard") {
        setActiveTab("dashboard");
      }
      setTimeout(() => {
        const el = document.getElementById(tool.scrollId!);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  // If user selected Simulator tab
  if (activeTab === "simulator") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="p-1.5 rounded-lg border border-[var(--border-soft)] hover:bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Back to Dashboard"
            >
              <MaterialIcon name="arrow_back" size={18} />
            </button>
            <h1 className="text-[20px] font-bold text-[var(--text-main)]">
              Monte Carlo Economic Simulator
            </h1>
          </div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            ← Back to Overview
          </button>
        </div>
        <EconomicSimulatorView />
      </div>
    );
  }

  // If user selected Contracts tab
  if (activeTab === "contracts") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-soft)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="p-1.5 rounded-lg border border-[var(--border-soft)] hover:bg-[var(--hover-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Back to Dashboard"
            >
              <MaterialIcon name="arrow_back" size={18} />
            </button>
            <h1 className="text-[20px] font-bold text-[var(--text-main)]">
              Dual-Tranche Smart Contracts & On-Chain Deployments
            </h1>
          </div>
          <button
            onClick={() => setActiveTab("dashboard")}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            ← Back to Overview
          </button>
        </div>
        <ContractSpecsView />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Top Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--border-soft)]">
        <div className="space-y-2">
          <h1 className="text-[24px] font-bold tracking-tight text-[var(--text-main)] leading-tight">
            {greeting} 👋
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] font-sans">
            Verifiable Revenue-Based Financing Workspace · Jember Commercial Ruko Fit-Out Pilot #01
          </p>

          {/* Quick Stats: icon 14px + label 12px muted, minimal accent */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[12px] text-[var(--text-muted)] font-mono">
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="domain" size={14} className="text-blue-400" />
              <span>Pilot: <strong className="text-[var(--text-main)] font-medium">AGR-JBR-001</strong></span>
            </div>
            <div className="opacity-40">·</div>
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="account_balance_wallet" size={14} className="text-emerald-400" />
              <span>Vault AUM: <strong className="text-[var(--text-main)] font-medium">Rp 150M</strong></span>
            </div>
            <div className="opacity-40">·</div>
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="verified_user" size={14} className="text-cyan-400" />
              <span>Covenant: <strong className="text-emerald-400 font-medium">HEALTHY</strong></span>
            </div>
            <div className="opacity-40">·</div>
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="qr_code_2" size={14} className="text-purple-400" />
              <span>Rail: <strong className="text-[var(--text-main)] font-medium">QRIS EIP-712</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Stacked Avatar Circles 32x32 */}
        <div className="hidden sm:flex items-center gap-3 self-start md:self-center bg-[var(--card-bg)] border border-[var(--border-soft)] px-3 py-2 rounded-[12px]">
          <div className="text-right">
            <div className="text-[12px] font-medium text-[var(--text-main)]">4 Ecosystem Actors</div>
            <div className="text-[10px] font-mono text-[var(--text-muted)]">Active Agreement Co-Signers</div>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            <div
              title="Senior Investor (80% Capital)"
              className="w-[32px] h-[32px] rounded-full bg-blue-600 ring-2 ring-[var(--panel-bg)] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm"
            >
              IN
            </div>
            <div
              title="Landlord / Ruko Owner (20% First-Loss)"
              className="w-[32px] h-[32px] rounded-full bg-purple-600 ring-2 ring-[var(--panel-bg)] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm"
            >
              LL
            </div>
            <div
              title="Tenant (Kedai Kopi Melati)"
              className="w-[32px] h-[32px] rounded-full bg-emerald-600 ring-2 ring-[var(--panel-bg)] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm"
            >
              TN
            </div>
            <div
              title="Independent Inspector"
              className="w-[32px] h-[32px] rounded-full bg-amber-600 ring-2 ring-[var(--panel-bg)] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-sm"
            >
              IS
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section: Recently Used Tools */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MaterialIcon name="history" size={16} className="text-[var(--text-muted)]" />
          <h2 className="text-[14px] font-semibold text-[var(--text-main)]">Recently Used</h2>
        </div>

        {/* Grid Tool Cards: 1 col mobile, 2 tablet, 3 desktop, gap 12px */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
          {recentlyUsedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="rounded-[12px] border border-[var(--border-soft)] bg-[var(--card-bg-soft)] p-[20px] transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg)] cursor-pointer group flex items-start gap-[16px]"
            >
              {/* Icon box 36x36 rounded 8px */}
              <div className="w-[36px] h-[36px] rounded-[8px] bg-[var(--hover-bg)] group-hover:bg-[var(--active-bg)] flex items-center justify-center shrink-0 transition-colors">
                <MaterialIcon name={tool.icon} size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[14px] font-medium text-[var(--text-main)] truncate group-hover:text-blue-500 transition-colors">
                    {tool.title}
                  </h3>
                  {/* Badge */}
                  <span
                    className={`rounded-[6px] border px-[6px] py-[2px] text-[11px] font-medium shrink-0 ${
                      tool.badgeType === "new"
                        ? "text-[#10B981] bg-[rgba(16,185,129,0.10)] border-emerald-500/20 font-semibold"
                        : "bg-[var(--hover-bg)] text-[var(--text-muted)] border-[var(--border-soft)]"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--text-muted)] mt-[6px] leading-relaxed line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Section: Popular Protocols & Tools */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MaterialIcon name="star" size={16} className="text-[var(--text-muted)]" />
          <h2 className="text-[14px] font-semibold text-[var(--text-main)]">Popular</h2>
        </div>

        {/* Grid Tool Cards: 1 col mobile, 2 tablet, 3 desktop, gap 12px */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
          {popularTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="rounded-[12px] border border-[var(--border-soft)] bg-[var(--card-bg-soft)] p-[20px] transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg)] cursor-pointer group flex items-start gap-[16px]"
            >
              {/* Icon box 36x36 rounded 8px */}
              <div className="w-[36px] h-[36px] rounded-[8px] bg-[var(--hover-bg)] group-hover:bg-[var(--active-bg)] flex items-center justify-center shrink-0 transition-colors">
                <MaterialIcon name={tool.icon} size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[14px] font-medium text-[var(--text-main)] truncate group-hover:text-blue-500 transition-colors">
                    {tool.title}
                  </h3>
                  <span
                    className={`rounded-[6px] border px-[6px] py-[2px] text-[11px] font-medium shrink-0 ${
                      tool.badgeType === "new"
                        ? "text-[#10B981] bg-[rgba(16,185,129,0.10)] border-emerald-500/20 font-semibold"
                        : "bg-[var(--hover-bg)] text-[var(--text-muted)] border-[var(--border-soft)]"
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--text-muted)] mt-[6px] leading-relaxed line-clamp-2">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: Categories */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MaterialIcon name="folder_open" size={16} className="text-[var(--text-muted)]" />
          <h2 className="text-[14px] font-semibold text-[var(--text-main)]">Categories</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px]">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setRole(cat.role);
                const el = document.getElementById("workbench-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-[12px] rounded-[8px] border border-[var(--border-soft)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] transition-colors flex items-center justify-between text-[14px] text-[var(--text-muted)] cursor-pointer group"
            >
              <span className="truncate group-hover:text-[var(--text-main)] transition-colors">{cat.title}</span>
              <span className="text-[11px] font-mono text-[var(--text-muted)] opacity-80 ml-2 shrink-0">{cat.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section: All Tools & Interactive Workbench */}
      <section id="workbench-section" className="space-y-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="grid_view" size={16} className="text-[var(--text-muted)]" />
            <h2 className="text-[14px] font-semibold text-[var(--text-main)]">All Tools & Interactive Workbench</h2>
          </div>
          <span className="text-[12px] font-mono text-[var(--text-muted)]">
            Active Role: <span className="text-[var(--text-main)] font-medium">{role}</span>
          </span>
        </div>

        {/* Active Role Perspective Switcher Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {roleItems.map((item) => {
            const isSelected = role === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => setRole(item.role)}
                className={`p-3 rounded-[8px] border text-left transition-all flex flex-col justify-between h-[88px] ${
                  isSelected
                    ? "bg-[var(--active-bg)] border-blue-500/40 shadow-sm"
                    : "bg-[var(--card-bg)] border-[var(--border-soft)] hover:bg-[var(--hover-bg)] hover:border-[var(--border-hover)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MaterialIcon
                      name={item.icon}
                      size={16}
                      className={isSelected ? "text-blue-500" : "text-[var(--text-muted)]"}
                    />
                    <span className={`text-[12px] font-medium ${isSelected ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                      {item.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                  {item.desc}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] opacity-70 truncate">
                  {item.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role View Card */}
        <div className="pt-1">
          {role === "INVESTOR" && <InvestorView />}
          {role === "LANDLORD" && <LandlordView />}
          {role === "TENANT" && <TenantView />}
          {role === "INSPECTOR" && <InspectorView />}
        </div>

        {/* Interactive Waterfall Section */}
        <div id="waterfall-section" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="waterfall_chart" size={16} className="text-[var(--text-muted)]" />
            <h3 className="text-[14px] font-semibold text-[var(--text-main)]">
              Visualisasi Pipeline Waterfall (QRIS Revenue Split)
            </h3>
          </div>
          <WaterfallVisualizer />
          <TrancheClaimCards />
        </div>

        {/* Covenant Protection Curve Section */}
        <div id="covenant-section" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="show_chart" size={16} className="text-[var(--text-muted)]" />
            <h3 className="text-[14px] font-semibold text-[var(--text-main)]">
              Covenant Floor vs Realisasi Pembayaran Kumulatif
            </h3>
          </div>
          <CovenantChart />
        </div>

        {/* Jury Control Deck Section */}
        <div id="scenarios-section" className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="smart_display" size={16} className="text-[var(--text-muted)]" />
            <h3 className="text-[14px] font-semibold text-[var(--text-main)]">
              Jury Scenario Controller Deck (Skenario Stress-Test S1, S4, S6)
            </h3>
          </div>
          <ScenarioControllerPanel />
        </div>
      </section>
    </div>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <Shell>
        <DashboardMainContent />
      </Shell>
    </AppProvider>
  );
}
