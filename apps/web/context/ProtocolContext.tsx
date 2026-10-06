"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ScenarioPreset = "S1" | "S4" | "S6";
export type CovenantStatus = "HEALTHY" | "WARNING" | "CURE" | "BOND_DRAWN" | "STEP_IN";

export interface Milestone {
  id: number;
  title: string;
  amount: number;
  evidenceHash: string;
  approvals: {
    landlord: boolean;
    inspector: boolean;
    tenant: boolean;
  };
  status: "PENDING" | "IN_REVIEW" | "RELEASED";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  month: number;
  dayId: number;
  eventName: string;
  details: string;
  type: "success" | "warning" | "danger" | "info";
}

interface ProtocolContextType {
  // Time and Scenario
  currentMonth: number;
  activeScenario: ScenarioPreset;
  setMonth: (m: number) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  setScenario: (s: ScenarioPreset) => void;
  isPlaying: boolean;
  toggleAutoPlay: () => void;
  resetSimulation: () => void;

  // Real-time financial calculations
  grossMonthly: number;
  tenantCash: number;
  seniorRepaid: number;
  juniorRepaid: number;
  landlordRent: number;
  idleCashSenior: number;
  bondBalance: number;
  covenantStatus: CovenantStatus;
  seniorClaimCap: number;
  juniorClaimCap: number;

  // Actions
  withdrawSeniorCash: () => void;
  hasWithdrawn: boolean;
  cureTopUp: (amount: number) => void;
  depositBond: (amount: number) => void;
  simulateDailySale: (amount: number) => void;

  // Milestones
  milestones: Milestone[];
  approveLandlordMilestone: (id: number) => void;
  signInspectorMilestone: (id: number, hash?: string) => void;

  // Logs
  auditLogs: AuditEvent[];
}

const ProtocolContext = createContext<ProtocolContextType | undefined>(undefined);

// Initial Milestones for Capex Rp 150M
const defaultMilestones: Milestone[] = [
  {
    id: 1,
    title: "Pembongkaran Struktur & Partisi Dinding",
    amount: 45000000,
    evidenceHash: "0x8f43c19e...3a21",
    approvals: { landlord: true, inspector: true, tenant: true },
    status: "RELEASED",
  },
  {
    id: 2,
    title: "Instalasi Listrik Daya Tinggi & Plumbing Bar",
    amount: 60000000,
    evidenceHash: "0x3e17b84a...9f8c",
    approvals: { landlord: true, inspector: true, tenant: true },
    status: "RELEASED",
  },
  {
    id: 3,
    title: "Finishing Interior, Bar Counter & Mesin Espresso",
    amount: 45000000,
    evidenceHash: "0xa21df7e5...1b44",
    approvals: { landlord: false, inspector: false, tenant: true },
    status: "IN_REVIEW",
  },
];

export const ProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState<number>(1);
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>("S1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasWithdrawn, setHasWithdrawn] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);

  // Constants based on docs/02_ECONOMIC_MODEL.md
  const baseMonthlyGross = 71111100; // Rp 71,111,100 / month (~ Rp 2,370,370 / day)
  const seniorClaimCap = 150000000;  // 1.25x on Rp 120M
  const juniorClaimCap = 42000000;   // 1.40x on Rp 30M
  const initialBond = 15000000;      // 10% on Rp 150M

  // Calculate dynamic data based on currentMonth and activeScenario
  let grossFactor = 1.0;
  if (activeScenario === "S4") {
    grossFactor = 0.70; // 30% cash leakage
  } else if (activeScenario === "S6") {
    grossFactor = currentMonth <= 5 ? 0.95 : 0.20; // Default at month 6
  }

  const grossMonthly = Math.round(baseMonthlyGross * grossFactor);

  // Cumulative math
  let seniorRepaid = 0;
  let juniorRepaid = 0;
  let landlordRent = 0;
  let tenantCash = 0;
  let bondDrawn = 0;
  let covenantStatus: CovenantStatus = "HEALTHY";

  for (let m = 1; m <= currentMonth; m++) {
    let mFactor = 1.0;
    if (activeScenario === "S4") mFactor = 0.70;
    if (activeScenario === "S6") mFactor = m <= 5 ? 0.95 : 0.20;

    const mGross = Math.round(baseMonthlyGross * mFactor);
    const mTenant = Math.round(mGross * 0.80);
    const mLandlordRent = Math.round(mGross * 0.05);
    const mInvestor = Math.round(mGross * 0.15);

    tenantCash += mTenant;
    landlordRent += mLandlordRent;

    if (seniorRepaid < seniorClaimCap) {
      const needed = seniorClaimCap - seniorRepaid;
      if (mInvestor <= needed) {
        seniorRepaid += mInvestor;
      } else {
        seniorRepaid = seniorClaimCap;
        juniorRepaid += mInvestor - needed;
      }
    } else {
      juniorRepaid = Math.min(juniorClaimCap, juniorRepaid + mInvestor);
    }

    // Floor calculation at month m
    let floorAtM = 0;
    if (m <= 18) {
      floorAtM = Math.round((90000000 / 18) * m);
    } else {
      floorAtM = Math.round(90000000 + ((60000000 / 6) * (m - 18)));
    }

    // Covenant check
    if (activeScenario === "S4" && m >= 6) {
      const shortfall = floorAtM - seniorRepaid;
      if (shortfall > 0) {
        covenantStatus = "CURE";
        if (m >= 8) {
          bondDrawn = Math.min(initialBond, bondDrawn + 3200000);
          covenantStatus = "BOND_DRAWN";
        }
      }
    } else if (activeScenario === "S6" && m >= 6) {
      covenantStatus = "STEP_IN";
      bondDrawn = initialBond; // Fully drawn
    }
  }

  const bondBalance = Math.max(0, initialBond - bondDrawn);
  const idleCashSenior = hasWithdrawn ? 0 : Math.round(seniorRepaid * 0.12);

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    {
      id: "log-init-1",
      timestamp: "10:00:00",
      month: 1,
      dayId: 30,
      eventName: "ProtocolInitialized",
      details: "Agreement AGR-JBR-001 active: Senior Vault Rp120M, Junior Vault Rp30M, Bond Rp15M.",
      type: "info",
    },
  ]);

  const addLog = (
    eventName: string,
    details: string,
    type: AuditEvent["type"] = "info",
    month: number = currentMonth
  ) => {
    const newLog: AuditEvent = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString("id-ID"),
      month,
      dayId: month * 30,
      eventName,
      details,
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 24)]);
  };

  const nextMonth = () => {
    if (currentMonth < 24) {
      const nextM = currentMonth + 1;
      setCurrentMonth(nextM);
      addLog(
        "SettlementRecorded",
        `Settlement Bulan ke-${nextM} tercatat: Omzet Rp ${grossMonthly.toLocaleString("id-ID")}`,
        "success",
        nextM
      );
    }
  };

  const prevMonth = () => {
    if (currentMonth > 1) {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const setMonth = (m: number) => {
    setCurrentMonth(Math.max(1, Math.min(24, m)));
  };

  const setScenario = (s: ScenarioPreset) => {
    setActiveScenario(s);
    setIsPlaying(false);
    if (s === "S1") {
      addLog("ScenarioSwitched", "Skenario dialihkan ke S1: Operasional Normal (100% Target Omzet)", "info");
    } else if (s === "S4") {
      addLog("ScenarioSwitched", "Skenario dialihkan ke S4: Kebocoran Kas 30% (Stress Test Covenant & Bond)", "warning");
    } else if (s === "S6") {
      addLog("ScenarioSwitched", "Skenario dialihkan ke S6: Default Dini di Bulan ke-6 (Step-In Trigger)", "danger");
    }
  };

  const withdrawSeniorCash = () => {
    setHasWithdrawn(true);
    addLog(
      "CashWithdrawn",
      `Investor menarik kas dividen sebesar Rp ${idleCashSenior.toLocaleString("id-ID")} dari Senior Vault`,
      "success"
    );
  };

  const cureTopUp = (amount: number) => {
    addLog(
      "CureTopUpDeposited",
      `Tenant menyetor pelunasan cure shortfall sebesar Rp ${amount.toLocaleString("id-ID")}`,
      "success"
    );
  };

  const depositBond = (amount: number) => {
    addLog(
      "BondDeposited",
      `Tenant menambah saldo uang jaminan escrow sebesar Rp ${amount.toLocaleString("id-ID")}`,
      "success"
    );
  };

  const simulateDailySale = (amount: number) => {
    addLog(
      "DailyQRISReceived",
      `Transaksi kasir QRIS diterima: Rp ${amount.toLocaleString("id-ID")} (80% Tenant, 15% Senior, 5% Landlord)`,
      "success"
    );
  };

  const resetSimulation = () => {
    setCurrentMonth(1);
    setActiveScenario("S1");
    setIsPlaying(false);
    setHasWithdrawn(false);
    setMilestones(defaultMilestones);
    addLog("ProtocolReset", "State protokol direset ke konfigurasi awal Bulan ke-1.", "info", 1);
  };

  const toggleAutoPlay = () => setIsPlaying(!isPlaying);

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMonth((prev) => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 24;
          }
          const next = prev + 1;
          addLog("SettlementRecorded", `Auto-Play: Settlement Bulan ke-${next} diproses.`, "success", next);
          return next;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Milestone Actions
  const approveLandlordMilestone = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updatedApprovals = { ...m.approvals, landlord: true };
          const count = Object.values(updatedApprovals).filter(Boolean).length;
          const status = count >= 2 ? "RELEASED" : "IN_REVIEW";
          return { ...m, approvals: updatedApprovals, status };
        }
        return m;
      })
    );
    addLog("MilestoneApproved", `Pemilik Ruko (Landlord) menandatangani termin renovasi #${id}`, "info");
  };

  const signInspectorMilestone = (id: number, hash: string = "0xa21df7e5...1b44") => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updatedApprovals = { ...m.approvals, inspector: true };
          const count = Object.values(updatedApprovals).filter(Boolean).length;
          const status = count >= 2 ? "RELEASED" : "IN_REVIEW";
          return { ...m, approvals: updatedApprovals, status, evidenceHash: hash };
        }
        return m;
      })
    );
    addLog("MilestoneSigned", `Inspektur independen memverifikasi bukti & menandatangani termin #${id} (Dana Cair!)`, "success");
  };

  return (
    <ProtocolContext.Provider
      value={{
        currentMonth,
        activeScenario,
        setMonth,
        nextMonth,
        prevMonth,
        setScenario,
        isPlaying,
        toggleAutoPlay,
        resetSimulation,
        grossMonthly,
        tenantCash,
        seniorRepaid,
        juniorRepaid,
        landlordRent,
        idleCashSenior,
        bondBalance,
        covenantStatus,
        seniorClaimCap,
        juniorClaimCap,
        withdrawSeniorCash,
        hasWithdrawn,
        cureTopUp,
        depositBond,
        simulateDailySale,
        milestones,
        approveLandlordMilestone,
        signInspectorMilestone,
        auditLogs,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocol = () => {
  const ctx = useContext(ProtocolContext);
  if (!ctx) throw new Error("useProtocol must be used within a ProtocolProvider");
  return ctx;
};
