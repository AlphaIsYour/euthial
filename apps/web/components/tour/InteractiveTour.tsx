"use client";

import React, { useState, useEffect } from "react";
import { Joyride, STATUS, type Step } from "react-joyride";
import { HelpCircle, Sparkles } from "lucide-react";

interface InteractiveTourProps {
  steps: Step[];
  tourKey: string; // e.g. "investor_tour"
}

export function InteractiveTour({ steps, tourKey }: InteractiveTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Automatically trigger on first visit for guest/demo convenience
    const hasSeen = localStorage.getItem(`seen_${tourKey}`);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem(`seen_${tourKey}`, "true");
    }
  };

  const handleManualRestart = () => {
    setRunTour(true);
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        onEvent={handleJoyrideCallback}
        options={{
          showProgress: true,
          arrowColor: "#1E293B",
          backgroundColor: "#0F172A",
          overlayColor: "rgba(3, 7, 18, 0.75)",
          primaryColor: "#10B981",
          textColor: "#F8FAFC",
          zIndex: 10000,
        }}
        styles={{
          tooltip: {
            borderRadius: "2px",
            border: "1px solid #334155",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
            padding: "20px",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: "16px",
            fontWeight: 700,
            color: "#38BDF8",
            marginBottom: "8px",
          },
          tooltipContent: {
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#E2E8F0",
          },
          buttonPrimary: {
            backgroundColor: "#10B981",
            borderRadius: "8px",
            color: "#042F2E",
            fontWeight: 700,
            padding: "8px 16px",
            fontSize: "13px",
          },
          buttonBack: {
            color: "#94A3B8",
            marginRight: "10px",
            fontSize: "13px",
          },
          buttonSkip: {
            color: "#64748B",
            fontSize: "13px",
          },
        }}
        locale={{
          back: "Kembali",
          close: "Tutup",
          last: "Selesai",
          next: "Lanjut",
          skip: "Lewati Tur",
        }}
      />

      {/* Floating button so judges or guests can restart the tour anytime */}
      <button
        onClick={handleManualRestart}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-950/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        title="Mulai Tur Interaktif Panduan"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>Panduan Fitur</span>
        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </>
  );
}
