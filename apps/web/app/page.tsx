"use client";

import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
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

const DashboardContent: React.FC = () => {
  const { role, activeTab } = useApp();

  return (
    <div className="space-y-6">
      {/* 1. If tab is 'dashboard' */}
      {activeTab === "dashboard" && (
        <>
          {/* Top: 4-Role Perspective Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono text-[#8A8A8A] uppercase tracking-wider">
                PERSPEKTIF PERAN AKTIF ({role})
              </h2>
            </div>
            {role === "INVESTOR" && <InvestorView />}
            {role === "LANDLORD" && <LandlordView />}
            {role === "TENANT" && <TenantView />}
            {role === "INSPECTOR" && <InspectorView />}
          </section>

          {/* Middle: Interactive Waterfall Engine & Tranche Health */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono text-[#8A8A8A] uppercase tracking-wider">
              STRUKTUR MODAL & DISTRIBUSI WATERFALL
            </h2>
            <WaterfallVisualizer />
            <TrancheClaimCards />
          </section>

          {/* Bottom: Covenant Floor vs Actual Realization Chart */}
          <section className="space-y-3">
            <h2 className="text-xs font-mono text-[#8A8A8A] uppercase tracking-wider">
              PROTEKSI COVENANT & FLOOR ANALYSIS
            </h2>
            <CovenantChart />
          </section>
        </>
      )}

      {/* 2. If tab is 'scenarios' */}
      {activeTab === "scenarios" && (
        <section className="space-y-6">
          <ScenarioControllerPanel />
          <CovenantChart />
          <WaterfallVisualizer />
        </section>
      )}

      {/* 3. If tab is 'simulator' */}
      {activeTab === "simulator" && (
        <section className="space-y-6">
          <EconomicSimulatorView />
          <WaterfallVisualizer />
        </section>
      )}

      {/* 4. If tab is 'audit' */}
      {activeTab === "audit" && (
        <section className="space-y-6">
          <ScenarioControllerPanel />
        </section>
      )}

      {/* 5. If tab is 'contracts' */}
      {activeTab === "contracts" && (
        <section className="space-y-6">
          <ContractSpecsView />
        </section>
      )}
    </div>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <Shell>
        <DashboardContent />
      </Shell>
    </AppProvider>
  );
}
