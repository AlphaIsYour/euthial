"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useApp } from "../../context/AppContext";
import { useWeb3 } from "../../context/Web3Context";
import { MaterialIcon } from "../ui/MaterialIcon";
import { WalletConnectButton } from "../auth/WalletConnectButton";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { AuthModal } from "../auth/AuthModal";

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

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
    <header className="absolute top-0 left-0 right-0 h-[52px] py-2 px-3 sm:px-4 bg-[var(--panel-header-bg)] border-b border-[var(--border-soft)] flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* Sisi Kiri: Sidebar Toggle & Search Input */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isSidebarCollapsed ? "menu_open" : "menu"} size={17} />
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="w-[140px] sm:w-[180px] md:w-[220px] h-[32px] rounded-lg border border-[var(--border-soft)] bg-[var(--input-bg)] px-2.5 flex items-center justify-between text-left text-xs text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)] transition-all group shrink-0"
        >
          <div className="flex items-center gap-2 truncate">
            <MaterialIcon name="search" size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)]" />
            <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-main)] truncate">Search tools...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--hover-bg)] border border-[var(--border-soft)] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Sisi Kanan: Utilitas, Autentikasi, dan Wallet */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">

        {/* GitHub Link */}
        <a
          href="https://github.com/AlphaIsYour/euthial"
          target="_blank"
          rel="noreferrer"
          title="Repositori GitHub"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>

        {/* Notifikasi In-App */}
        <NotificationCenter />

        {/* Maximize / Layar Penuh */}
        <button
          type="button"
          onClick={handleMaximize}
          title={isFullscreen ? "Keluar dari Layar Penuh" : "Layar Penuh"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={isFullscreen ? "fullscreen_exit" : "fullscreen"} size={16} />
        </button>

        {/* Toggle Tema (Terang / Gelap) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors shrink-0"
        >
          <MaterialIcon name={theme === "dark" ? "light_mode" : "dark_mode"} size={16} />
        </button>

        <div className="h-4 w-px bg-[var(--border-soft)] mx-0.5" />

        {/* Area Autentikasi Pengguna: Kondisional Login / Sesi */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            {/* Pill Profil User Aktif */}
            <Link
              href="/profile"
              title="Profil Pengguna & Status Akun"
              className="h-8 px-2.5 rounded-lg border border-[var(--border-soft)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-xs font-mono text-[var(--text-main)] flex items-center gap-2 transition-colors shrink-0"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[110px] truncate text-xs font-medium">
                {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                {session.user?.role || "USER"}
              </span>
            </Link>

            {/* Tombol Keluar (Logout) */}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Keluar dari Akun"
              className="h-8 px-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-xs font-medium text-rose-400 flex items-center gap-1 transition-all shrink-0"
            >
              <MaterialIcon name="logout" size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          /* Tombol Masuk ketika Belum Login */
          <Link
            href="/login"
            title="Masuk ke Akun"
            className="h-8 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
          >
            <MaterialIcon name="login" size={15} />
            <span className="hidden sm:inline">Masuk</span>
          </Link>
        )}

        {/* RainbowKit + SIWE Connect Button */}
        <div className="ml-0.5 shrink-0">
          <WalletConnectButton />
        </div>

        {/* Auth Modal Fallback */}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </header>
  );
};
