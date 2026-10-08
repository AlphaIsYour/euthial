"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SearchModal } from "./SearchModal";
import { FloatingRoleSwitcher } from "../navigation/FloatingRoleSwitcher";
import { DataModeBanner } from "../ui/DataModeToggle";
import { OnboardingWizard } from "../onboarding/OnboardingWizard";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { useApp } from "../../context/AppContext";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isSidebarCollapsed } = useApp();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-row bg-[var(--sidebar-bg)] text-[var(--text-main)] font-sans select-none">
      {/* 1. Left Sidebar: normal 240px, collapsed 64px, bg var(--sidebar-bg) */}
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Main Area: padding-top: 16px, background same as sidebar */}
      <div className="flex-1 min-w-0 pt-4 bg-[var(--sidebar-bg)] overflow-hidden flex flex-col">
        {/* Main Panel: height calc(100vh - 16px), overflow hidden, border-l border-t only, rounded-tl-[12px] ONLY */}
        <div className="relative flex-1 h-[calc(100vh-16px)] bg-[var(--panel-bg)] border-l border-t border-[var(--border-soft)] rounded-tl-[12px] rounded-tr-none rounded-br-none rounded-bl-none overflow-hidden flex flex-col">
          {/* Panel Header: Absolute top, h-12 (48px), z-30, solid panel header, border-b, px-4 (16px) */}
          <Header onOpenSearch={() => setIsSearchOpen(true)} />

          {/* Scrollable Content Container: height 100%, overflow-y auto, px-6 (24px), pt-16 (64px), pb-16 for mobile / pb-6 desktop */}
          <main className="h-full overflow-y-auto px-4 sm:px-6 pt-[64px] pb-20 sm:pb-6 dotted-bg relative">
            <div
              className={`mx-auto space-y-6 transition-[max-width] duration-300 ease-out ${
                isSidebarCollapsed ? "max-w-[1440px]" : "max-w-7xl"
              }`}
            >
              <DataModeBanner />
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Global Search Command Palette (Ctrl+K / ⌘K) */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Onboarding Wizard Modal (#66) */}
      <OnboardingWizard />

      {/* Floating Demo Navigation Pill (Desktop) */}
      <div className="hidden sm:block">
        <FloatingRoleSwitcher />
      </div>

      {/* Mobile Bottom Navigation Bar (#74) */}
      <MobileBottomNav />
    </div>
  );
};
