"use client";

import React, { useState, useEffect } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export type ScenarioPreset = "S1" | "S4" | "S6";

interface AuditEvent {
  id: string;
  timestamp: string;
  dayId: number;
  eventName: string;
  details: string;
  type: "success" | "warning" | "danger" | "info";
}

export const ScenarioControllerPanel: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>("S1");
  const [currentDay, setCurrentDay] = useState(360);
  const [isPlaying, setIsPlaying] = useState(false);
  const [covenantStatus, setCovenantStatus] = useState<"HEALTHY" | "WARNING" | "CURE" | "STEP_IN">("HEALTHY");

  const [eventLogs, setEventLogs] = useState<AuditEvent[]>([
    {
      id: "ev-1",
      timestamp: "10:14:02",
      dayId: 360,
      eventName: "SettlementRecorded",
      details: "Settlement M12: G=Rp 71.111.100, Investor=Rp 10.666.665, Landlord=Rp 3.555.555",
      type: "success",
    },
    {
      id: "ev-2",
      timestamp: "10:14:03",
      dayId: 360,
      eventName: "FloorTested",
      details: "Kumulatif Rp 115.2M >= Floor Rp 60.0M. Status: HEALTHY.",
      type: "info",
    },
    {
      id: "ev-3",
      timestamp: "09:30:15",
      dayId: 330,
      eventName: "SettlementRecorded",
      details: "Settlement M11: G=Rp 71.111.100 via QRIS Rail EIP-712 Attestation",
      type: "success",
    },
  ]);

  // Handle Preset Switching
  const handleSelectScenario = (preset: ScenarioPreset) => {
    setSelectedScenario(preset);
    setIsPlaying(false);
    if (preset === "S1") {
      setCovenantStatus("HEALTHY");
      addLog("ScenarioSwitched", "Memuat S1: Operasional Normal (100% Target)", "info", currentDay);
    } else if (preset === "S4") {
      setCovenantStatus("CURE");
      addLog("ScenarioSwitched", "Memuat S4: Kebocoran Tunai 30% (Omzet QRIS Anjlok)", "warning", currentDay);
      setTimeout(() => {
        addLog("CureStarted", "Realisasi di bawah Floor(d). Masa Cure 7 hari logis dimulai.", "warning", currentDay);
      }, 400);
      setTimeout(() => {
        addLog("BondDrawn", "Shortfall Rp 3.200.000 ditarik dari Saldo Jaminan (Bond).", "danger", currentDay);
      }, 800);
    } else if (preset === "S6") {
      setCovenantStatus("STEP_IN");
      addLog("ScenarioSwitched", "Memuat S6: Default Dini (Bulan ke-6 Macet Total)", "danger", currentDay);
      setTimeout(() => {
        addLog("StepInTriggered", "Covenant Breach: Hak kendali ruko dialihkan ke Kurator/Step-In.", "danger", currentDay);
      }, 500);
    }
  };

  const addLog = (eventName: string, details: string, type: AuditEvent["type"], day: number) => {
    const newLog: AuditEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toLocaleTimeString("id-ID"),
      dayId: day,
      eventName,
      details,
      type,
    };
    setEventLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const advancePeriod = () => {
    const nextDay = Math.min(720, currentDay + 30);
    setCurrentDay(nextDay);
    const month = Math.floor(nextDay / 30);
    addLog(
      "SettlementRecorded",
      `Maju Periode: Bulan ke-${month} (Hari ${nextDay}). Settle agregat 30 hari tercatat.`,
      "success",
      nextDay
    );
  };

  const resetSimulation = () => {
    setCurrentDay(30);
    setIsPlaying(false);
    setCovenantStatus("HEALTHY");
    addLog("SimulatorReset", "State protokol direset ke Bulan ke-1 (Hari 30).", "info", 30);
  };

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= 720) {
            setIsPlaying(false);
            return 720;
          }
          const next = prev + 30;
          addLog("SettlementRecorded", `Auto-Play: Settlement Bulan ke-${Math.floor(next / 30)} diproses.`, "success", next);
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5 space-y-5">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(207,207,207,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="tune" size={18} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Jury Control Deck (Scenario Controller)
            </h3>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Kontrol simulasi interaktif untuk mendemonstrasikan protokol dalam berbagai kondisi ekstrem
          </p>
        </div>

        {/* Current State & Status Badge */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-[10px] text-[#71717A] uppercase font-mono block leading-none">
              Waktu Logis
            </span>
            <span className="text-xs font-mono font-bold text-white">
              Hari {currentDay} (Bln {Math.floor(currentDay / 30)})
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border flex items-center gap-1.5 ${
              covenantStatus === "HEALTHY"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : covenantStatus === "WARNING"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : covenantStatus === "CURE"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                covenantStatus === "HEALTHY" ? "bg-emerald-400" : "bg-red-400 animate-ping"
              }`}
            />
            <span>{covenantStatus}</span>
          </div>
        </div>
      </div>

      {/* Preset Selector Buttons */}
      <div>
        <span className="text-xs text-[#A1A1AA] font-mono block mb-2">
          PILIH SKENARIO PENGUJIAN JURI:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => handleSelectScenario("S1")}
            className={`p-3 rounded-card border text-left transition-all ${
              selectedScenario === "S1"
                ? "bg-[#27272A] border-blue-500/60 shadow-md"
                : "bg-[#141414] border-[rgba(207,207,207,0.08)] hover:border-[rgba(207,207,207,0.18)]"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>S1: Normal (100%)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Baseline</span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed">
              Omzet stabil Rp71,1jt/bulan. Senior lunas di bulan 14, Junior di bulan 18.
            </p>
          </button>

          <button
            onClick={() => handleSelectScenario("S4")}
            className={`p-3 rounded-card border text-left transition-all ${
              selectedScenario === "S4"
                ? "bg-[#27272A] border-amber-500/60 shadow-md"
                : "bg-[#141414] border-[rgba(207,207,207,0.08)] hover:border-[rgba(207,207,207,0.18)]"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>S4: Kebocoran Kas 30%</span>
              <span className="text-[10px] text-amber-400 font-mono">Stress Test</span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed">
              Transaksi tunai tidak disetor QRIS. Shortfall menutup via uang jaminan (bond).
            </p>
          </button>

          <button
            onClick={() => handleSelectScenario("S6")}
            className={`p-3 rounded-card border text-left transition-all ${
              selectedScenario === "S6"
                ? "bg-[#27272A] border-red-500/60 shadow-md"
                : "bg-[#141414] border-[rgba(207,207,207,0.08)] hover:border-[rgba(207,207,207,0.18)]"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>S6: Default Dini (Bln 6)</span>
              <span className="text-[10px] text-red-400 font-mono">Breach Event</span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed">
              Tenant gulung tikar dini. Bond terserap penuh, hak ruko beralih ke Step-In.
            </p>
          </button>
        </div>
      </div>

      {/* Playback & Time Navigation Controls */}
      <div className="p-3 bg-[#141414] rounded-card border border-[rgba(207,207,207,0.08)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-card flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            <MaterialIcon name={isPlaying ? "pause" : "play_arrow"} size={16} />
            <span>{isPlaying ? "Pause Auto-Play" : "▶ Auto-Play (Per 30 Hari)"}</span>
          </button>

          <button
            onClick={advancePeriod}
            className="px-3 py-1.5 bg-[#27272A] hover:bg-[#323238] text-white text-xs font-medium rounded-card border border-[rgba(207,207,207,0.10)] flex items-center gap-1.5 transition-colors"
          >
            <MaterialIcon name="fast_forward" size={16} />
            <span>Maju 1 Bulan (+30 Hari)</span>
          </button>
        </div>

        <button
          onClick={resetSimulation}
          className="px-2.5 py-1.5 text-xs text-[#8A8A8A] hover:text-white rounded-card hover:bg-[rgba(255,255,255,0.05)] flex items-center gap-1 transition-colors"
        >
          <MaterialIcon name="restart_alt" size={15} />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Real-time Audit Event Feed */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] mb-2">
          <span className="flex items-center gap-1.5">
            <MaterialIcon name="receipt_long" size={14} className="text-blue-400" />
            LIVE CONTRACT AUDIT FEED (EIP-712 / ON-CHAIN EVENTS)
          </span>
          <span>{eventLogs.length} Events</span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {eventLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded bg-[#141414] border border-[rgba(207,207,207,0.06)] flex items-start justify-between gap-3 text-[11px]"
            >
              <div className="flex items-start gap-2 overflow-hidden">
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold shrink-0 ${
                    log.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : log.type === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : log.type === "danger"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {log.eventName}
                </span>
                <span className="text-[#D4D4D8] truncate">{log.details}</span>
              </div>
              <div className="text-[10px] text-[#71717A] shrink-0">
                <span>D{log.dayId}</span> · <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
