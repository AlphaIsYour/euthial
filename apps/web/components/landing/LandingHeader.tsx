"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "../ui/MaterialIcon";
import { LanguageModeToggle } from "../ui/LanguageModeToggle";
import { WalletConnectButton } from "../auth/WalletConnectButton";

interface RoleLink {
  label: string;
  sub: string;
  href: string;
  icon: string;
  badge: string;
}

const ROLE_PORTALS: RoleLink[] = [
  {
    label: "Penyewa Kedai",
    sub: "Operator F&B & POS QRIS",
    href: "/tenant",
    icon: "storefront",
    badge: "Kasir 80%",
  },
  {
    label: "Investor Senior",
    sub: "Pengembalian Pokok & Cap 1.25x",
    href: "/investor",
    icon: "trending_up",
    badge: "Prioritas #1",
  },
  {
    label: "Pemilik Ruko",
    sub: "Sewa Variabel 5% & Subordinasi",
    href: "/landlord",
    icon: "domain",
    badge: "Junior 20%",
  },
  {
    label: "Inspektur Fisik",
    sub: "Verifikasi Renovasi 2-of-3",
    href: "/inspector",
    icon: "verified",
    badge: "Milestone",
  },
  {
    label: "Pelaksana Kontraktor",
    sub: "Penerima Termin Renovasi",
    href: "/contractor",
    icon: "construction",
    badge: "Pencairan",
  },
  {
    label: "Jury Demo Console",
    sub: "Simulasi 24 Bulan & Stres Test",
    href: "/demo",
    icon: "tune",
    badge: "Interactive",
  },
];

export const LandingHeader: React.FC = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover handlers with safe mouse leave delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setRoleMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setRoleMenuOpen(false);
    }, 150);
  };

  // Close role dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* 1. SLENDER ANNOUNCEMENT TOP BAR (WARM YELLOW WITH UNDERLINED CTA & DISMISS BUTTON) */}
      {bannerVisible && (
        <div className="w-full bg-[#FEFCE8] border-b border-[#FEF08A] text-xs text-[#713F12] py-2 px-6 sm:px-8 lg:px-12 relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="truncate font-normal text-amber-950">
                Pilot Perdana Ruko Gajah Mada Jember kini aktif di Base Sepolia Testnet.
              </span>
              <Link
                href="/demo"
                className="font-medium text-amber-950 underline underline-offset-4 decoration-amber-500/70 hover:decoration-amber-950 transition-colors shrink-0 hidden sm:inline-flex items-center gap-0.5 ml-1"
              >
                <span>Buka Demo Console</span>
                <span className="text-[11px]">→</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/demo"
                className="font-medium text-amber-950 underline underline-offset-4 decoration-amber-500/70 hover:decoration-amber-950 transition-colors inline-flex sm:hidden items-center gap-0.5"
              >
                <span>Demo Console →</span>
              </Link>

              <button
                type="button"
                onClick={() => setBannerVisible(false)}
                className="p-1 -mr-1 rounded-md text-amber-800/70 hover:text-amber-950 hover:bg-amber-200/60 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Tutup pengumuman"
                title="Tutup pengumuman"
              >
                <MaterialIcon name="close" size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLUME-STYLE MINIMALIST NAVBAR (EXACT WIDTH MATCH WITH PAGE CONTENT) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/90 px-6 sm:px-8 lg:px-12 py-3.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand & Monogram */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shrink-0">
                <img
                  src="/euthial.png"
                  alt="Euthial Protocol"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-[-0.02em] text-slate-950">
                  Euthial
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600">
                  RBF Protocol
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Main Institutional Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-normal text-slate-600">
            <a
              href="#katalog-ruko"
              className="hover:text-slate-950 transition-colors duration-150"
            >
              Katalog Ruko
            </a>
            <a
              href="#kalkulator-keekonomian"
              className="hover:text-slate-950 transition-colors duration-150"
            >
              Simulasi & Model
            </a>
            <a
              href="#cara-kerja"
              className="hover:text-slate-950 transition-colors duration-150"
            >
              Cara Kerja
            </a>
            <a
              href="#portal-sistem"
              className="hover:text-slate-950 transition-colors duration-150"
            >
              Arsitektur
            </a>
          </nav>

          {/* Right: Streamlined Actions with Hover Popover */}
          <div className="flex items-center gap-2.5">
            {/* Streamlined Role Selector Dropdown with HOVER TRIGGER */}
            <div
              className="relative"
              ref={roleDropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${roleMenuOpen
                  ? "border-slate-300 bg-slate-100 text-slate-950 shadow-sm"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 hover:text-slate-950"
                  }`}
                aria-expanded={roleMenuOpen}
              >
                <MaterialIcon name="account_tree" size={13} className="text-slate-500" />
                <span>Portal Peran</span>
                <MaterialIcon
                  name="expand_more"
                  size={12}
                  className={`text-slate-500 transition-transform duration-200 ${roleMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Role Dropdown Popover */}
              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Pilih Antarmuka Stakeholder
                    </p>
                  </div>
                  <div className="space-y-1">
                    {ROLE_PORTALS.map((portal) => (
                      <Link
                        key={portal.href}
                        href={portal.href}
                        onClick={() => setRoleMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition group text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 group-hover:border-emerald-300 group-hover:bg-emerald-50 transition">
                            <MaterialIcon name={portal.icon} size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800 group-hover:text-slate-950 leading-tight">
                              {portal.label}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-tight">
                              {portal.sub}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">
                          {portal.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Plain Language Mode Toggle */}
            <div className="hidden sm:flex items-center">
              <LanguageModeToggle />
            </div>

            {/* Wallet Connect Button */}
            <div className="hidden sm:flex items-center">
              <WalletConnectButton />
            </div>

            {/* Solid Institutional Black Launch Console Button */}
            <Link
              href="/demo"
              className="py-2 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm shadow-sm transition active:scale-[0.98] flex items-center gap-1.5"
            >
              <MaterialIcon name="terminal" size={13} />
              <span>Launch Console</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
              aria-label="Toggle mobile menu"
            >
              <MaterialIcon name={mobileMenuOpen ? "close" : "menu"} size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-slate-200 mt-3 space-y-3">
            <div className="flex flex-col space-y-1 text-sm text-slate-700">
              <a
                href="#katalog-ruko"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-950"
              >
                Katalog Ruko
              </a>
              <a
                href="#kalkulator-keekonomian"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-950"
              >
                Simulasi & Model
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-950"
              >
                Cara Kerja
              </a>
              <a
                href="#portal-sistem"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-950"
              >
                Arsitektur & Role
              </a>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="px-3 py-1 text-[11px] font-mono uppercase text-slate-500">
                Pintu Masuk Stakeholder
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {ROLE_PORTALS.map((portal) => (
                  <Link
                    key={portal.href}
                    href={portal.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <MaterialIcon name={portal.icon} size={13} className="text-emerald-600" />
                    <span className="truncate">{portal.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
