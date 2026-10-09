"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "../ui/MaterialIcon";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/demo", label: "Demo", icon: "tune" },
    { href: "/investor", label: "Investor", icon: "trending_up" },
    { href: "/landlord", label: "Landlord", icon: "real_estate_agent" },
    { href: "/tenant", label: "Tenant", icon: "storefront" },
    { href: "/profile", label: "Profil", icon: "account_circle" },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 dark:bg-[#0E0E12]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 z-40 flex items-center justify-around px-2 select-none">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
              isActive
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-[#888] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MaterialIcon name={item.icon} size={20} />
            <span className="text-[10px] font-mono tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
