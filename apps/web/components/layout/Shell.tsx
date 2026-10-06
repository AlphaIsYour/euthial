"use client";

import React from "react";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* 1. Permanent Top Disclaimer Banner (NN-09) */}
      <DisclaimerBanner />

      {/* 2. Main Viewport (Sidebar + Main Panel) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <Sidebar />

        {/* Right Main Panel with Top-Left Radius 14px & Dotted Grid */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] border-l border-[rgba(207,207,207,0.10)] rounded-tl-[14px] overflow-hidden">
          {/* Sticky 48px Header */}
          <Header />

          {/* Scrollable Content Container with Dotted Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 dotted-bg relative">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
