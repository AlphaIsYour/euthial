"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageMode = "technical" | "plain";

export const GLOSSARY: Record<string, { technical: string; plain: string; desc: string }> = {
  seniorTranche: {
    technical: "Senior Tranche",
    plain: "Dana Investor Utama",
    desc: "Hak klaim prioritas pengembalian modal investor dari pendapatan ruko.",
  },
  juniorTranche: {
    technical: "Junior Tranche",
    plain: "Dana Pemilik Ruko",
    desc: "Klaim subordinat milik pemilik ruko setelah investor terbayar penuh.",
  },
  covenantBreach: {
    technical: "Covenant Breach",
    plain: "⚠️ Pendapatan di Bawah Target",
    desc: "Omzet harian/bulanan di bawah batas minimum yang disepakati.",
  },
  erc4626Vault: {
    technical: "ERC-4626 Vault",
    plain: "Rekening Tabungan Hasil Usaha",
    desc: "Smart contract penyimpan kas dan pembagi imbal hasil terstandarisasi.",
  },
  bondDraw: {
    technical: "Bond Draw",
    plain: "Uang Jaminan Ditarik",
    desc: "Penarikan jaminan tenant otomatis untuk menutupi kekurangan target.",
  },
  stepInTriggered: {
    technical: "Step-In Triggered",
    plain: "🚨 Protokol Ambil Alih Ruko",
    desc: "Pengambilalihan operasional ruko secara terprogram karena gagal bayar berulang.",
  },
  waterfallDistribution: {
    technical: "Waterfall Distribution",
    plain: "Bagi Hasil Otomatis (80:15:5)",
    desc: "Pembagian pendapatan real-time: 80% Pengelola, 15% Investor, 5% Pemilik Ruko.",
  },
  settlement: {
    technical: "Settlement Harian",
    plain: "Pembayaran Harian QRIS",
    desc: "Rekonsiliasi omzet dan pemotongan bagi hasil harian.",
  },
  floorRatio: {
    technical: "Floor Ratio Target",
    plain: "Target Minimum Pendapatan",
    desc: "Ambang batas omzet minimal sebelum memicu masa penyelesaian (cure period).",
  },
  fitOutAgreement: {
    technical: "FitOutAgreement Contract",
    plain: "Kontrak Perjanjian Renovasi",
    desc: "Perjanjian on-chain antara pemilik ruko, penyewa, investor, dan inspektur.",
  },
};

interface LanguageContextType {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
  toggleMode: () => void;
  term: (key: keyof typeof GLOSSARY) => string;
  termDesc: (key: keyof typeof GLOSSARY) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<LanguageMode>("technical");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("euthial-lang-mode") as LanguageMode | null;
      if (saved === "technical" || saved === "plain") {
        setMode(saved);
      }
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "technical" ? "plain" : "technical";
      if (typeof window !== "undefined") {
        localStorage.setItem("euthial-lang-mode", next);
      }
      return next;
    });
  };

  const term = (key: keyof typeof GLOSSARY): string => {
    const item = GLOSSARY[key];
    if (!item) return String(key);
    return mode === "plain" ? item.plain : item.technical;
  };

  const termDesc = (key: keyof typeof GLOSSARY): string => {
    const item = GLOSSARY[key];
    return item ? item.desc : "";
  };

  return (
    <LanguageContext.Provider value={{ mode, setMode, toggleMode, term, termDesc }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageMode = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      mode: "technical" as LanguageMode,
      setMode: () => {},
      toggleMode: () => {},
      term: (key: keyof typeof GLOSSARY) => GLOSSARY[key]?.technical || String(key),
      termDesc: (key: keyof typeof GLOSSARY) => GLOSSARY[key]?.desc || "",
    };
  }
  return ctx;
};
