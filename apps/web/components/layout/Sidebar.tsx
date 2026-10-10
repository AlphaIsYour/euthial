"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { MaterialIcon } from "../ui/MaterialIcon";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

interface SidebarSection {
  title?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ onOpenSearch?: () => void }> = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, setRole } = useApp();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const sections: SidebarSection[] = [
    {
      title: "Utama",
      items: [
        {
          label: "Jury Demo Console",
          href: "/demo",
          icon: "tune",
          badge: "Live",
          badgeColor: "bg-emerald-500/10 text-[#10B981] border-emerald-500/20",
        },
        {
          label: "Marketplace Deals",
          href: "/deals",
          icon: "storefront",
          badge: "Katalog",
        },
      ],
    },
    {
      title: "Portal Peran",
      items: [
        {
          label: "Investor Senior",
          href: "/investor",
          icon: "trending_up",
          badge: "80%",
        },
        {
          label: "Pemilik Ruko",
          href: "/landlord",
          icon: "domain",
          badge: "20%",
        },
        {
          label: "Penyewa Kedai",
          href: "/tenant",
          icon: "point_of_sale",
          badge: "QRIS",
        },
        {
          label: "Pelaksana Kontraktor",
          href: "/contractor",
          icon: "construction",
          badge: "Termin",
        },
        {
          label: "Inspektur Fisik",
          href: "/inspector",
          icon: "verified",
          badge: "2-of-3",
        },
      ],
    },
    {
      title: "Audit & Sistem",
      items: [
        {
          label: "Log Audit On-Chain",
          href: "/audit",
          icon: "receipt_long",
          badge: "EAS",
        },
        {
          label: "Profil & Dompet",
          href: "/profile",
          icon: "account_balance_wallet",
        },
        {
          label: "Landing Page",
          href: "/",
          icon: "home",
        },
      ],
    },
  ];

  const handleItemClick = (href: string) => {
    if (href === "/investor") setRole("INVESTOR");
    else if (href === "/landlord") setRole("LANDLORD");
    else if (href === "/tenant") setRole("TENANT");
    else if (href === "/contractor") setRole("CONTRACTOR");
    else if (href === "/inspector") setRole("INSPECTOR");
  };

  return (
    <aside
      className={`h-screen bg-[var(--sidebar-bg)] flex flex-col justify-between shrink-0 select-none z-40 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pt-4 ${
        isSidebarCollapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      {/* Top: Logo row */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-12 flex items-center px-4 shrink-0">
          {!isSidebarCollapsed ? (
            <Link
              href="/demo"
              className="flex items-center gap-2.5 overflow-hidden w-full group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/euthial.png"
                  alt="Euthial Protocol"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-[13px] tracking-tight text-[var(--text-main)] leading-tight truncate group-hover:text-blue-500 transition-colors">
                  Euthial Protocol
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono leading-none truncate">
                  Verifiable RBF Vault
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              title="Perlebar Sidebar"
              className="w-9 h-9 rounded-lg mx-auto flex items-center justify-center hover:bg-[var(--hover-bg)] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                <img
                  src="/euthial.png"
                  alt="Euthial Protocol"
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto py-2 px-0 space-y-2">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-0.5">
              {!isSidebarCollapsed && sec.title && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {sec.title}
                </div>
              )}
              {isSidebarCollapsed && sec.title && (
                <div className="my-1.5 border-t border-[var(--border-soft)] mx-3" />
              )}

              {sec.items.map((item, itemIdx) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const uniqueKey = `${secIdx}-${itemIdx}`;

                return (
                  <div key={uniqueKey} className="relative group">
                    <Link
                      href={item.href}
                      onClick={() => handleItemClick(item.href)}
                      onMouseEnter={() => setHoveredKey(uniqueKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      className={`h-9 text-[13px] rounded-lg transition-colors flex items-center ${
                        isSidebarCollapsed
                          ? "w-9 h-9 mx-auto justify-center"
                          : "mx-2 px-2.5 gap-2.5 w-[calc(100%-16px)]"
                      } ${
                        isActive
                          ? "bg-[var(--active-bg)] text-[var(--text-main)] font-semibold shadow-xs"
                          : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <MaterialIcon
                        name={item.icon}
                        size={16}
                        className={`shrink-0 ${
                          isActive
                            ? "text-blue-500"
                            : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                        }`}
                      />

                      {!isSidebarCollapsed && (
                        <span className="truncate flex-1 text-left">
                          {item.label}
                        </span>
                      )}

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded border font-mono font-medium ${
                            item.badgeColor ||
                            "bg-[var(--input-bg)] border-[var(--border-soft)] text-[var(--text-muted)]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip on Collapsed Mode */}
                    {isSidebarCollapsed && hoveredKey === uniqueKey && (
                      <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[var(--card-bg)] border border-[var(--border-soft)] text-[var(--text-main)] text-[12px] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-1.5">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono text-blue-400">
                              ({item.badge})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Context Box */}
      <div className="p-3 border-t border-[var(--border-soft)] shrink-0">
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>PILOT #01</span>
              <span className="text-[#10B981] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-xs font-medium text-[var(--text-main)] truncate">
              Ruko Sentra #01
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono truncate">
              Verifiable RBF Vault
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Perlebar Sidebar"
            className="w-8 h-8 rounded-lg bg-[var(--card-bg)] border border-[var(--border-soft)] mx-auto flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          </button>
        )}
      </div>
    </aside>
  );
};
