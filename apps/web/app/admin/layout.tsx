"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sessionResult = useSession?.();
  const session = sessionResult?.data;

  const navItems = [
    { label: "Overview", href: "/admin", exact: true },
    { label: "User Management", href: "/admin/users" },
    { label: "Deals & Contracts", href: "/admin/deals" },
    { label: "Investor Whitelist", href: "/admin/whitelist" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-sm tracking-tight leading-none">
                Euthial Protocol
              </span>
              <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
          <div className="h-4 w-px bg-slate-200 hidden md:block" />
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            ← Public App
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-medium text-slate-900 leading-tight">
                {session?.user?.name || "Admin Operator"}
              </span>
              <span className="text-[10px] text-slate-500">
                {session?.user?.email || "admin@euthial.id"}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
              ADMIN
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
