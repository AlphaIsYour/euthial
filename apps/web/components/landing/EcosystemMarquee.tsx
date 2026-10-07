"use client";

import React from "react";

interface Partner {
  name: string;
  category: string;
  svg: React.ReactNode;
}

// 18 Institutional Leaders matching the exact reference grid
export const INSTITUTIONAL_LEADERS: Partner[] = [
  {
    name: "Apollo Global",
    category: "Institutional Credit",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 115 32" fill="currentColor">
        <text x="4" y="22" fontFamily="serif" fontSize="16" fontWeight="600" letterSpacing="4px">
          APOLLO
        </text>
      </svg>
    ),
  },
  {
    name: "WisdomTree",
    category: "Asset Management",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 145 32" fill="currentColor">
        <path d="M12 21c-2-3-4-8-2-12 2-3 7-4 10-2 2-2 6-3 9-1 4 3 4 8 2 12-2 1-4 1-5 2v4h-2v-4c-2 0-3-1-4-2h-3v3h-2v-3c-1 0-2 0-3 1z" />
        <text x="36" y="21" fontFamily="serif" fontSize="13" fontWeight="600" letterSpacing="-0.2px">
          WisdomTree
        </text>
      </svg>
    ),
  },
  {
    name: "FalconX",
    category: "Prime Brokerage",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 120 32" fill="currentColor">
        <path d="M6 7h14l-5 8h-9zm3 10h11l-5 8H4z" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1px">
          FALCONX
        </text>
      </svg>
    ),
  },
  {
    name: "Solana",
    category: "High-Throughput L1",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 115 32" fill="currentColor">
        <path d="M5 9h12l3-3H8zm3 6h12l-3 3H5zm-3 6h12l3-3H8z" />
        <text x="27" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.8px">
          SOLANA
        </text>
      </svg>
    ),
  },
  {
    name: "Binance",
    category: "Global Exchange",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 120 32" fill="currentColor">
        <path d="M13 6l4 4-4 4-4-4zm-6 6l4 4-4 4-4-4zm12 0l4 4-4 4-4-4zm-6 6l4 4-4 4-4-4z" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.5px">
          BINANCE
        </text>
      </svg>
    ),
  },
  {
    name: "Bybit",
    category: "Liquidity Venue",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 100 32" fill="currentColor">
        <rect x="4" y="8" width="16" height="16" rx="3" />
        <path d="M9 12h6v2H9zm0 4h6v2H9z" fill="#FFFFFF" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="800" letterSpacing="0.2px">
          BYBIT
        </text>
      </svg>
    ),
  },
  {
    name: "DigiFT",
    category: "Compliant Exchange",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 110 32" fill="currentColor">
        <path d="M9 10l5-4 5 4v8l-5 4-5-4zm5-1l-3 2.5 3 2.5 3-2.5zm-3 4.5v3l3 2.5v-3zm6 0l-3 2.5v3l3-2.5z" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" letterSpacing="-0.3px">
          DigiFT
        </text>
      </svg>
    ),
  },
  {
    name: "Pendle",
    category: "Yield Tokenization",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 125 32" fill="currentColor">
        <circle cx="12" cy="16" r="8" />
        <path d="M12 11v10M8 16h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" letterSpacing="4px">
          PENDLE
        </text>
      </svg>
    ),
  },
  {
    name: "ether.fi",
    category: "Liquid Staking",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 110 32" fill="currentColor">
        <path d="M6 16l6-8 6 8-6 8z" />
        <circle cx="12" cy="16" r="2.5" fill="#FFFFFF" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" letterSpacing="-0.2px">
          ether.fi
        </text>
      </svg>
    ),
  },
  {
    name: "Perena",
    category: "Stablecoin Infrastructure",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 115 32" fill="currentColor">
        <circle cx="12" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 12c4 2 4 6 8 8M8 20c4-2 4-6 8-8" stroke="currentColor" strokeWidth="2" />
        <text x="27" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="1px">
          PERENA
        </text>
      </svg>
    ),
  },
  {
    name: "Superstate",
    category: "Tokenized Treasuries",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 130 32" fill="currentColor">
        <path d="M5 16a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zm8-2H9a2 2 0 1 0 0 4h4a2 2 0 1 0 0-4z" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" letterSpacing="-0.3px">
          Superstate
        </text>
      </svg>
    ),
  },
  {
    name: "Morpho",
    category: "Optimized Lending",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 115 32" fill="currentColor">
        <path d="M5 19c3-7 8-11 13-11-2 5-3 11-1 14-4-1-8-1-12-3z" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" letterSpacing="-0.3px">
          Morpho
        </text>
      </svg>
    ),
  },
  {
    name: "Grove",
    category: "Institutional Custody",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 100 32" fill="currentColor">
        <text x="4" y="22" fontFamily="serif" fontSize="16" fontWeight="800" letterSpacing="1px">
          GROVE
        </text>
      </svg>
    ),
  },
  {
    name: "Securitize",
    category: "Tokenized Securities",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 135 32" fill="currentColor">
        <path d="M6 10h12v3H6zm0 5h12v3H6zm0 5h12v3H6z" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.8px">
          SECURITIZE
        </text>
      </svg>
    ),
  },
  {
    name: "Selini",
    category: "Quantitative Liquidity",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 105 32" fill="currentColor">
        <path d="M8 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
        <text x="24" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="600" letterSpacing="-0.2px">
          Selini
        </text>
      </svg>
    ),
  },
  {
    name: "Haun",
    category: "Venture Capital",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 95 32" fill="currentColor">
        <text x="4" y="22" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="800" letterSpacing="2px">
          HAUN
        </text>
      </svg>
    ),
  },
  {
    name: "Centrifuge",
    category: "Real-World Assets",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 130 32" fill="currentColor">
        <circle cx="12" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="16" r="3" fill="currentColor" />
        <text x="27" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="600" letterSpacing="-0.2px">
          Centrifuge
        </text>
      </svg>
    ),
  },
  {
    name: "Sky",
    category: "Decentralized Stablecoin",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 95 32" fill="currentColor">
        <path d="M12 7l1.5 5.5L19 14l-5.5 1.5L12 21l-1.5-5.5L5 14l5.5-1.5z" />
        <text x="25" y="21" fontFamily="system-ui, sans-serif" fontSize="16" fontWeight="700" letterSpacing="-0.2px">
          Sky
        </text>
      </svg>
    ),
  },
];

// Complete ecosystem list for infinite marquee
export const ALL_PARTNERS: Partner[] = [
  {
    name: "Ethereum",
    category: "L1 Settlement",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 120 32" fill="currentColor">
        <path d="M14 2L6 15.2l8 4.7 8-4.7L14 2zm0 19.9L6 17.2l8 11.8 8-11.8-8 4.7z" />
        <text x="32" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="600" letterSpacing="-0.3px">
          Ethereum
        </text>
      </svg>
    ),
  },
  {
    name: "Base",
    category: "L2 Execution",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 100 32" fill="currentColor">
        <circle cx="14" cy="16" r="10" />
        <circle cx="14" cy="16" r="5" fill="#FFFFFF" />
        <text x="30" y="21" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" letterSpacing="-0.5px">
          BASE
        </text>
      </svg>
    ),
  },
  {
    name: "Plume Network",
    category: "RWA Modular L2",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 130 32" fill="currentColor">
        <path d="M7 23c4-4 9-15 13-15-2 5-3 10-2 15-3-1-7-1-11 0z" />
        <text x="26" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="600" letterSpacing="-0.2px">
          Plume
        </text>
        <text x="70" y="21" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="400" fill="#94A3B8">
          Network
        </text>
      </svg>
    ),
  },
  ...INSTITUTIONAL_LEADERS,
  {
    name: "QRIS / ASPI",
    category: "National POS Rail",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 115 32" fill="currentColor">
        <rect x="5" y="7" width="16" height="18" rx="3" />
        <path d="M8 10h4v4H8zm6 0h3v3h-3zm-6 6h3v3H8zm6 3h3v3h-3z" fill="#FFFFFF" />
        <text x="28" y="21" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="800" letterSpacing="0.5px">
          QRIS
        </text>
      </svg>
    ),
  },
  {
    name: "Bank Indonesia",
    category: "Regulatory Sandbox",
    svg: (
      <svg className="h-8 sm:h-9 md:h-10 w-auto" viewBox="0 0 150 32" fill="currentColor">
        <circle cx="14" cy="16" r="9" />
        <path d="M10 11h4a2.5 2.5 0 0 1 0 5H10zm0 5h4.5a2.5 2.5 0 0 1 0 5H10z" fill="#FFFFFF" />
        <text x="29" y="21" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" letterSpacing="0.2px">
          BI SANDBOX
        </text>
      </svg>
    ),
  },
];

interface EcosystemMarqueeProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  reverse?: boolean;
  size?: "normal" | "large";
  mode?: "marquee" | "grid";
}

export const EcosystemMarquee: React.FC<EcosystemMarqueeProps> = ({
  title = "SUPPORTED BY & COMPOSABLE WITH INDUSTRY LEADERS",
  subtitle,
  buttonText,
  reverse = false,
  size = "normal",
  mode = "marquee",
}) => {
  // MODE 1: STATIONARY GRID (EXACT REFERENCE DESIGN)
  if (mode === "grid") {
    return (
      <div className="w-full py-12 md:py-16 space-y-6 text-center">
        {subtitle && (
          <p className="font-mono text-xs tracking-widest uppercase text-emerald-600 font-semibold">
            {subtitle}
          </p>
        )}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight max-w-4xl mx-auto px-4">
          {title}
        </h2>

        {buttonText && (
          <div className="pt-1">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200/90 bg-slate-50 text-slate-700 text-xs font-mono shadow-xs hover:bg-slate-100 transition cursor-default">
              {buttonText}
            </span>
          </div>
        )}

        {/* Static 6-column Institutional Logo Grid (Stationary / Tidak Bergerak) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-10 sm:gap-x-14 gap-y-12 sm:gap-y-16 items-center justify-items-center pt-8 max-w-6xl mx-auto px-4">
          {INSTITUTIONAL_LEADERS.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors duration-200 select-none hover:scale-110 transition-transform"
              title={`${p.name} · ${p.category}`}
            >
              {p.svg}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MODE 2: INFINITE CONTINUOUS MARQUEE (SCROLLING)
  const duplicatedPartners = [...ALL_PARTNERS, ...ALL_PARTNERS];
  const isLarge = size === "large";

  return (
    <div className={`w-full overflow-hidden ${isLarge ? "py-10 space-y-6" : "py-8 space-y-4"}`}>
      {title && (
        <p
          className={`text-center font-mono tracking-widest uppercase ${
            isLarge
              ? "text-xs sm:text-sm md:text-base text-slate-800 font-bold"
              : "text-[11px] text-slate-400 font-medium"
          }`}
        >
          {title}
        </p>
      )}

      {/* Marquee Track Container with Edge Gradients */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Gradient Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Scrolling Strip */}
        <div
          className={`flex items-center ${
            isLarge ? "gap-16 sm:gap-24" : "gap-10 sm:gap-14"
          } animate-marquee ${reverse ? "[animation-direction:reverse]" : ""}`}
        >
          {duplicatedPartners.map((p, idx) => (
            <div
              key={`${p.name}-${idx}`}
              className={`flex items-center gap-2 text-slate-600 hover:text-slate-950 transition-colors duration-200 select-none shrink-0 ${
                isLarge ? "scale-105 sm:scale-115 origin-center" : ""
              }`}
              title={`${p.name} · ${p.category}`}
            >
              {p.svg}
            </div>
          ))}
        </div>

        {/* Right Gradient Fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
      </div>
    </div>
  );
};
