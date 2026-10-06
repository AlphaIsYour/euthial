"use client";

import React from "react";
import { useApp, UserRole } from "../../context/AppContext";
import { MaterialIcon } from "../ui/MaterialIcon";

const roleOptions: { key: UserRole; label: string; icon: string; color: string }[] = [
  { key: "INVESTOR", label: "Investor Senior", icon: "trending_up", color: "text-blue-400" },
  { key: "LANDLORD", label: "Pemilik Ruko", icon: "real_estate_agent", color: "text-purple-400" },
  { key: "TENANT", label: "Tenant Kedai", icon: "storefront", color: "text-emerald-400" },
  { key: "INSPECTOR", label: "Inspektur", icon: "engineering", color: "text-amber-400" },
];

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    address,
    theme,
    toggleTheme,
  } = useApp();

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Connect Wallet";

  return (
    <header className="h-12 bg-[#0A0A0A] border-b border-[rgba(207,207,207,0.10)] px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#71717A] capitalize">{activeTab}</span>
        <span className="text-[#3F3F46]">/</span>
        <span className="text-[#E4E4E7] font-medium font-mono">
          {roleOptions.find((r) => r.key === role)?.label}
        </span>
      </div>

      {/* Center: 4-Role Switcher Bar */}
      <div className="hidden md:flex items-center bg-[#141414] p-1 rounded-md border border-[rgba(207,207,207,0.10)] gap-1">
        {roleOptions.map((opt) => {
          const isSelected = role === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setRole(opt.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
                isSelected
                  ? "bg-[#27272A] text-white shadow-sm font-semibold"
                  : "text-[#8A8A8A] hover:text-[#D4D4D8] hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              <MaterialIcon
                name={opt.icon}
                size={14}
                className={isSelected ? opt.color : "text-[#71717A]"}
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Network, Wallet, Search, Theme */}
      <div className="flex items-center gap-2.5">
        {/* Network Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141414] border border-[rgba(207,207,207,0.08)] text-[11px] font-mono text-[#A1A1AA]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Sepolia</span>
        </div>

        {/* Search Modal Trigger (kbd) */}
        <button
          onClick={() => {}}
          className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-md bg-[#141414] border border-[rgba(207,207,207,0.08)] text-xs text-[#71717A] hover:text-[#A1A1AA] hover:border-[rgba(207,207,207,0.15)] transition-colors"
        >
          <MaterialIcon name="search" size={14} />
          <span className="text-[11px] font-mono">⌘K</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle light/dark theme"
          className="p-1.5 rounded-md text-[#8A8A8A] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={16} />
        </button>

        {/* Wallet Connect Pill */}
        <button
          onClick={isWalletConnected ? disconnectWallet : connectWallet}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono transition-colors border ${
            isWalletConnected
              ? "bg-[#141414] border-[rgba(207,207,207,0.15)] text-[#E4E4E7] hover:border-[rgba(207,207,207,0.3)]"
              : "bg-blue-600 hover:bg-blue-500 border-transparent text-white font-semibold"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isWalletConnected ? "bg-emerald-400" : "bg-zinc-400"
            }`}
          />
          <span>{isWalletConnected ? formattedAddress : "Connect"}</span>
        </button>
      </div>
    </header>
  );
};
