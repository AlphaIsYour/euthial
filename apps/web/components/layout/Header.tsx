"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useWeb3 } from "../../context/Web3Context";
import { MaterialIcon } from "../ui/MaterialIcon";

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
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    address,
    isSepolia,
    networkConfig,
  } = useWeb3();

  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const formattedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Connect";

  return (
    <header className="absolute top-0 left-0 right-0 h-12 bg-[var(--panel-header-bg)] border-b border-[var(--border-soft)] px-4 flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* Left: Sidebar Toggle (32x32) + Search Button (320x32) */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {/* Sidebar Toggle 32x32 rounded-8px */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isSidebarCollapsed ? "menu_open" : "menu"} size={16} />
        </button>

        {/* Search Input Button: 320x32 rounded 8px */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-[320px] h-[32px] rounded-[8px] border border-[var(--border-soft)] bg-[var(--input-bg)] px-[10px] flex items-center justify-between text-left text-xs text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)] transition-all group shrink-0"
        >
          <div className="flex items-center gap-2 truncate">
            <MaterialIcon name="search" size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
            <span className="text-[13px] text-[var(--text-muted)] group-hover:text-[var(--text-main)] truncate">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--hover-bg)] border border-[var(--border-soft)] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Testnet Status, GitHub, Minimize, Maximize, Theme Toggle, Wallet */}
      <div className="flex items-center gap-1.5">
        {/* Network & Prototype Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--card-bg)] border border-[var(--border-soft)] text-[11px] font-mono text-[var(--text-muted)]">
          <span className="flex h-1.5 w-1.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isSepolia ? "bg-emerald-400" : "bg-amber-400"
              } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                isSepolia ? "bg-emerald-500" : "bg-amber-500"
              }`}
            ></span>
          </span>
          <span className="text-[var(--text-main)] font-medium">{networkConfig.name}</span>
          <span className="text-[var(--text-muted)] opacity-60">·</span>
          <span>Pilot #01</span>
        </div>

        {/* GitHub Button 32x32 rounded 8px */}
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

        {/* Maximize Button 32x32 (Fullscreen / Window expand) */}
        <button
          type="button"
          onClick={handleMaximize}
          title={isFullscreen ? "Exit Fullscreen" : "Maximize / Fullscreen"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} size={16} />
        </button>

        {/* Theme Toggle Button 32x32 rounded 8px */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={16} />
        </button>

        {/* Wallet Pill */}
        <button
          type="button"
          onClick={isWalletConnected ? disconnectWallet : connectWallet}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-mono transition-colors border bg-[var(--card-bg)] border-[var(--border-soft)] text-[var(--text-main)] hover:border-[var(--border-hover)] hover:bg-[var(--hover-bg)] ml-1"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isWalletConnected ? "bg-emerald-400" : "bg-zinc-500"
            }`}
          />
          <span className="hidden sm:inline">{isWalletConnected ? formattedAddress : "Connect"}</span>
        </button>
      </div>
    </header>
  );
};
