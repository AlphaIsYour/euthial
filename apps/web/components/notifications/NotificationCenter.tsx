"use client";

import React, { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useProtocol } from "../../context/ProtocolContext";
import { TxLink } from "../ui/TxLink";

export interface AppNotification {
  id: string;
  category: "URGENT" | "PENDING" | "INFO";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  txHash?: string;
}

export const NotificationCenter: React.FC = () => {
  const { currentMonth, covenantStatus } = useProtocol();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      category: covenantStatus === "CURE" ? "URGENT" : "INFO",
      title: covenantStatus === "CURE" ? "⚠️ Masa Remediasi (Cure Period) Aktif" : "Covenant Operasional Sehat",
      message:
        covenantStatus === "CURE"
          ? "Pendapatan toko bulan ini di bawah floor target Rp 12.500.000. Tersisa 21 hari untuk melunasi shortfall."
          : "Toko mempertahankan kepatuhan di atas floor covenant Rp 12.500.000/bln.",
      timestamp: "10 menit lalu",
      isRead: false,
      link: "/tenant",
    },
    {
      id: "notif-2",
      category: "PENDING",
      title: "Verifikasi Termin Fisik #3 Menunggu Tanda Tangan",
      message: "Inspektur telah mengunggah bukti fisik IPFS untuk Termin #3 (Instalasi Interior & MEP).",
      timestamp: "1 jam lalu",
      isRead: false,
      link: "/inspector",
      txHash: "0x89ab12cd34ef56ab78cd901234567890abcdef12",
    },
    {
      id: "notif-3",
      category: "INFO",
      title: "Settlement Harian QRIS Terkonfirmasi",
      message: "Otomasi smart contract membagi Rp 4.250.000 ke Senior Vault dan Rp 850.000 ke Junior Vault.",
      timestamp: "3 jam lalu",
      isRead: true,
      link: "/investor",
      txHash: "0xa1b2c3d4e5f60718293a4b5c6d7e8f9012345678",
    },
    {
      id: "notif-4",
      category: "INFO",
      title: "Uang Jaminan (Bond) Tersimpan di Escrow",
      message: "Rp 37.500.000 tersimpan aman dalam kontrak FitOutAgreement.",
      timestamp: "1 hari lalu",
      isRead: true,
      link: "/landlord",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Pusat Notifikasi Protokol"
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover-bg)] transition-colors relative shrink-0"
      >
        <MaterialIcon name="notifications" size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-[var(--panel-header-bg)]" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0E0E10] border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Notifikasi Protokol</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  {unreadCount} baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-mono text-blue-500 hover:text-blue-600 underline"
              >
                Tandai dibaca
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                Tidak ada notifikasi baru
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors flex items-start gap-3 relative group ${
                    !n.isRead ? "bg-blue-50/20 dark:bg-blue-950/10" : ""
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {n.category === "URGENT" ? (
                      <span className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
                        <MaterialIcon name="warning" size={14} />
                      </span>
                    ) : n.category === "PENDING" ? (
                      <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                        <MaterialIcon name="hourglass_top" size={14} />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                        <MaterialIcon name="check_circle" size={14} />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                        {n.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-[#999] leading-snug">
                      {n.message}
                    </p>

                    {n.txHash && (
                      <div className="pt-0.5">
                        <TxLink hash={n.txHash} type="tx" />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeNotification(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-opacity"
                    title="Hapus"
                  >
                    <MaterialIcon name="close" size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-[#070709] border-t border-slate-100 dark:border-white/5 text-center">
            <a
              href="/audit"
              className="text-[11px] font-mono text-slate-500 hover:text-blue-500 flex items-center justify-center gap-1"
            >
              <span>Lihat Semua Riwayat Audit Trail</span>
              <MaterialIcon name="arrow_forward" size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
