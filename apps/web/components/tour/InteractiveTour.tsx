"use client";

import React, { useState, useEffect } from "react";
import { Joyride, STATUS, type Step } from "react-joyride";
import { HelpCircle } from "lucide-react";

interface InteractiveTourProps {
  steps: Step[];
  tourKey: string;
}

export function InteractiveTour({ steps, tourKey }: InteractiveTourProps) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(`seen_${tourKey}`);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  useEffect(() => {
    const handleStartEvent = (e: any) => {
      if (!e.detail?.tourKey || e.detail.tourKey === tourKey) {
        setRunTour(true);
      }
    };
    window.addEventListener("start-interactive-tour", handleStartEvent);
    return () => window.removeEventListener("start-interactive-tour", handleStartEvent);
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
        scrollToFirstStep
        scrollOffset={130}
        disableScrolling={false}
        disableScrollParentFix={true}
        floaterProps={{
          disableAnimation: true,
        }}
        onEvent={handleJoyrideCallback}
        options={{
          showProgress: true,
          arrowColor: "#18181B",
          backgroundColor: "#18181B",
          overlayColor: "rgba(0, 0, 0, 0.70)",
          primaryColor: "#FFFFFF",
          textColor: "#F4F4F5",
          zIndex: 10000,
        }}
        styles={{
          tooltip: {
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
            padding: "20px",
            backgroundColor: "#18181B",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: "15px",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: "8px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          },
          tooltipContent: {
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#A1A1AA",
          },
          buttonPrimary: {
            backgroundColor: "#FFFFFF",
            borderRadius: "6px",
            color: "#000000",
            fontWeight: 600,
            padding: "7px 14px",
            fontSize: "12px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          },
          buttonBack: {
            color: "#71717A",
            marginRight: "8px",
            fontSize: "12px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
          },
          buttonSkip: {
            color: "#52525B",
            fontSize: "12px",
            fontFamily: "var(--font-jetbrains-mono), monospace",
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

      {/* Floating trigger button in neutral monochrome design */}
      <button
        onClick={handleManualRestart}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 dark:bg-white/90 border border-slate-700 dark:border-white/20 text-white dark:text-black text-xs font-mono font-medium shadow-lg backdrop-blur-md transition-all hover:opacity-90 active:scale-95"
        title="Buka Panduan Tur Interaktif"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Panduan Fitur</span>
      </button>
    </>
  );
}
