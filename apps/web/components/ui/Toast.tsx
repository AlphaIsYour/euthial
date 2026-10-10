"use client";

import React, { useState, useEffect } from "react";
import { MaterialIcon } from "./MaterialIcon";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;

class ToastManager {
  private listeners: ToastListener[] = [];

  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(item: Omit<ToastItem, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const toastItem: ToastItem = { ...item, id };
    this.listeners.forEach((listener) => listener(toastItem));
  }

  success(title: string, description?: string, duration = 4000) {
    this.show({ type: "success", title, description, duration });
  }

  error(title: string, description?: string, duration = 5000) {
    this.show({ type: "error", title, description, duration });
  }

  info(title: string, description?: string, duration = 4000) {
    this.show({ type: "info", title, description, duration });
  }
}

export const toast = new ToastManager();

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 4000);

      return () => clearTimeout(timer);
    });
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          onClick={() => removeToast(t.id)}
          className="pointer-events-auto cursor-pointer flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl backdrop-blur-md animate-fadeIn transition-all hover:scale-[1.01]"
        >
          <div className="p-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 shrink-0 mt-0.5">
            {t.type === "success" && <MaterialIcon name="check_circle" size={16} className="text-emerald-500" />}
            {t.type === "error" && <MaterialIcon name="error" size={16} className="text-rose-500" />}
            {t.type === "info" && <MaterialIcon name="info" size={16} className="text-slate-600 dark:text-zinc-300" />}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white font-mono leading-tight">
              {t.title}
            </h4>
            {t.description && (
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-sans leading-relaxed">
                {t.description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeToast(t.id);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-0.5 rounded shrink-0"
            aria-label="Tutup notifikasi"
          >
            <MaterialIcon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
