"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useWeb3 } from "../../context/Web3Context";
import { MaterialIcon } from "../ui/MaterialIcon";
import { WalletConnectButton } from "../auth/WalletConnectButton";
import { DataModeToggle } from "../ui/DataModeToggle";
import { LanguageModeToggle } from "../ui/LanguageModeToggle";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { AuthModal } from "../auth/AuthModal";

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
  } = useApp();

  const {
    isSepolia,
    networkConfig,
  } = useWeb3();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMaximize = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen toggle failed, falling back to sidebar collapse:", e);
      toggleSidebar();
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 h-12 bg-[var(--panel-header-bg)] border-b border-[var(--border-soft)] px-4 flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* Left: Sidebar Toggle (32x32) + Search Button (320x32) + Dual Mode Toggle */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        {/* Sidebar Toggle 32x32 rounded-8px */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isSidebarCollapsed ? "menu_open" : "menu"} size={16} />
        </button>

        {/* Search Input Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-[240px] sm:w-[280px] h-[32px] rounded-[8px] border border-[var(--border-soft)] bg-[var(--input-bg)] px-[10px] flex items-center justify-between text-left text-xs text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)] transition-all group shrink-0"
        >
          <div className="flex items-center gap-2 truncate">
            <MaterialIcon name="search" size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
            <span className="text-[13px] text-[var(--text-muted)] group-hover:text-[var(--text-main)] truncate">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--hover-bg)] border border-[var(--border-soft)] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>

        {/* Dual-Mode Toggle: Simulation ↔ On-Chain (#60) */}
        <div className="hidden md:flex items-center shrink-0">
          <DataModeToggle />
        </div>
      </div>

      {/* Right: Plain Language Mode, GitHub, Maximize, Theme, RainbowKit + SIWE Wallet */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Plain Language Mode Toggle (#67) */}
        <div className="hidden sm:flex items-center shrink-0">
          <LanguageModeToggle />
        </div>

        {/* Network & Prototype Badge */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--card-bg)] border border-[var(--border-soft)] text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex h-1.5 w-1.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isSepolia ? "bg-emerald-400" : "bg-amber-400"
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                isSepolia ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="text-[var(--text-main)] font-medium">{networkConfig.name}</span>
          <span className="text-[var(--text-muted)] opacity-60">·</span>
          <span>Pilot #01</span>
        </div>

        {/* GitHub Button */}
        <a
          href="https://github.com/AlphaIsYour/euthial"
          target="_blank"
          rel="noreferrer"
          title="View GitHub Repository"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* In-App Notification Center (#73) */}
        <NotificationCenter />

        {/* Maximize Button */}
        <button
          type="button"
          onClick={handleMaximize}
          title={isFullscreen ? "Exit Fullscreen" : "Maximize / Fullscreen"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} size={16} />
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={16} />
        </button>

        {/* User Profile & Wallet Management Link (#44) */}
        <a
          href="/profile"
          title="Profil Pengguna & Manajemen Dompet"
          className="h-8 px-2.5 rounded-[8px] border border-[var(--border-soft)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors shrink-0"
        >
          <MaterialIcon name="person" size={15} />
          <span className="hidden md:inline">Profil</span>
        </a>

        {/* Dual-Rail Auth Button (Google / SIWE) */}
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          title="Masuk / Daftar Akun (Google / Dompet)"
          className="h-8 px-3 rounded-[8px] border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <MaterialIcon name="login" size={15} />
          <span className="hidden sm:inline">Masuk</span>
        </button>

        {/* RainbowKit + SIWE Connect Button (#58, #87) */}
        <div className="ml-1">
          <WalletConnectButton />
        </div>

        {/* Auth Modal Dialog */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </header>
  );
};
