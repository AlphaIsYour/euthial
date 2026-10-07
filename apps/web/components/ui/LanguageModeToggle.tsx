"use client";

import React from "react";
import { useLanguageMode } from "../../hooks/useLanguageMode";

export const LanguageModeToggle: React.FC = () => {
  const { mode, toggleMode } = useLanguageMode();

  return (
    <button
      onClick={toggleMode}
      title={mode === "plain" ? "Beralih ke Istilah Teknis (Pro/Web3)" : "Beralih ke Bahasa Awam (Pemilik Usaha)"}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-zinc-800 border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-slate-700 dark:text-zinc-200 shadow-sm"
    >
      <span className="material-symbols-outlined text-[15px] text-amber-500">
        translate
      </span>
      <span className="font-semibold">
        {mode === "plain" ? "Mode: Awam" : "Mode: Teknis"}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 ml-0.5">
        ({mode === "plain" ? "ID" : "WEB3"})
      </span>
    </button>
  );
};
