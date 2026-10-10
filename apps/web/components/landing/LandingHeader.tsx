"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "../ui/MaterialIcon";
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
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById("katalog-ruko");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none">
      {/* ========================================================= */}
      {/* LAPIS 1 (BARIS UTAMA): LOGO, SEARCH BAR LEBAR, NOTIF & LOGIN/REGISTER CTA */}
      {/* ========================================================= */}
      <div className="border-b border-slate-100 px-4 sm:px-6 lg:px-10 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* SISI KIRI: LOGO RESMI EUTHIAL */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <img
                src="/euthial.png"
                alt="Euthial Protocol"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold tracking-tight text-slate-950 leading-none">
                Euthial
              </span>
              <span className="text-[10px] font-mono tracking-tight text-slate-500 leading-tight">
                Verifiable RBF
              </span>
            </div>
          </Link>

          {/* SISI TENGAH: SEARCH BAR FINTECH ELEGANT (SEPERTI REFERENSI USER) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl mx-2 sm:mx-6 hidden md:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ruko, pool investasi, milestone kontraktor, atau dokumen legal..."
                className="w-full h-10 pl-4 pr-11 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
              />
              <button
                type="submit"
                title="Cari"
                className="absolute right-1.5 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
              >
                <MaterialIcon name="search" size={17} />
              </button>
            </div>
          </form>

          {/* SISI KANAN: NOTIFIKASI, PORTFOLIO, TOMBOL MASUK & DAFTAR, WALLET */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Icon Keranjang / Portofolio dengan Badge */}
            <Link
              href="#katalog-ruko"
              title="Portofolio Aset Ruko"
              className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
            >
              <MaterialIcon name="storefront" size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Icon Notifikasi dengan Dot Badge */}
            <div className="relative">
              <button
                type="button"
                title="Pemberitahuan Protokol"
                className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors"
              >
                <MaterialIcon name="notifications" size={16} />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  2
                </span>
              </button>
            </div>

            <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            {/* TOMBOL MASUK (LOGIN) - PROMINENT GHOST/OUTLINE */}
            <Link
              href="/login"
              className="h-8 px-3.5 rounded-lg border border-slate-300 hover:border-slate-400 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <MaterialIcon name="login" size={14} className="text-slate-500" />
              <span>Masuk</span>
            </Link>

            {/* TOMBOL DAFTAR (REGISTER) - SOLID BLACK/SLATE-900 */}
            <Link
              href="/register"
              className="h-8 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-2xs transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <MaterialIcon name="person_add" size={14} />
              <span>Daftar</span>
            </Link>

            {/* Web3 Wallet Compact Connect */}
            <div className="hidden xl:block ml-1">
              <WalletConnectButton />
            </div>

            {/* Tombol Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-950"
              aria-label="Menu"
            >
              <MaterialIcon name={mobileMenuOpen ? "close" : "menu"} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LAPIS 2 (SUB-NAVIGASI): KATEGORI/PERAN, MENU DENGAN DIVIDER, PILIH LOKASI */}
      {/* ========================================================= */}
      <div className="px-4 sm:px-6 lg:px-10 py-1.5 bg-slate-50/60 hidden md:block text-xs font-medium text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* SISI KIRI: DROPDOWN KATEGORI & PORTAL PERAN */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="px-2.5 py-1 rounded-md hover:bg-slate-200/60 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MaterialIcon name="grid_view" size={14} className="text-slate-600" />
              <span>Kategori & Portal</span>
              <MaterialIcon
                name="expand_more"
                size={14}
                className={`text-slate-500 transition-transform duration-200 ${roleMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu Portal */}
            {roleMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Akses Dashboard Peran
                  </span>
                </div>
                <div className="space-y-0.5">
                  {ROLE_PORTALS.map((portal) => (
                    <Link
                      key={portal.href}
                      href={portal.href}
                      onClick={() => setRoleMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <MaterialIcon
                          name={portal.icon}
                          size={15}
                          className="text-slate-500 group-hover:text-slate-900"
                        />
                        <div>
                          <div className="text-xs font-medium text-slate-800 group-hover:text-slate-950 leading-tight">
                            {portal.label}
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight">
                            {portal.sub}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-200 bg-slate-50 text-slate-600">
                        {portal.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SISI TENGAH: MENU HORIZONTAL DENGAN DIVIDER (SEPERTI GAMBAR CONTOH) */}
          <nav className="flex items-center gap-2.5 text-xs text-slate-600 font-normal">
            <a
              href="#katalog-ruko"
              className="hover:text-slate-950 transition-colors"
            >
              Katalog Ruko
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="#kalkulator-keekonomian"
              className="hover:text-slate-950 transition-colors"
            >
              Simulasi RBF
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="#cara-kerja"
              className="hover:text-slate-950 transition-colors"
            >
              Cara Kerja
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="#portal-sistem"
              className="hover:text-slate-950 transition-colors"
            >
              Arsitektur Smart Contract
            </a>
            <span className="text-slate-300">|</span>
            <Link
              href="/contractor"
              className="hover:text-slate-950 transition-colors"
            >
              Mitra Kontraktor
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/demo"
              className="hover:text-slate-950 transition-colors text-slate-900 font-medium"
            >
              Jury Console
            </Link>
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ruko, pool, atau milestone..."
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs bg-slate-50"
            />
          </form>
          <div className="flex flex-col space-y-2 text-xs text-slate-700 pt-1">
            <a
              href="#katalog-ruko"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              Katalog Ruko
            </a>
            <a
              href="#kalkulator-keekonomian"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              Simulasi RBF
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              Cara Kerja
            </a>
            <Link
              href="/contractor"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              Portal Kontraktor
            </Link>
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 rounded-lg hover:bg-slate-100 font-semibold text-slate-950"
            >
              Launch Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
