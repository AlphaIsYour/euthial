import React from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#18181B] border-b border-[rgba(207,207,207,0.08)] py-1.5 px-4 text-xs font-mono text-[#A1A1AA] flex items-center justify-between select-none z-50">
      <div className="flex items-center gap-2 truncate">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-semibold text-[#E4E4E7]">TESTNET PROTOTYPE</span>
        <span className="text-[#52525B]">·</span>
        <span className="truncate">Mock Token (MockIDR) & Mock Attestor (EIP-712)</span>
        <span className="text-[#52525B]">·</span>
        <span className="text-amber-300/90 font-medium">Bukan Penawaran Investasi Publik</span>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#71717A]">
        <span>Jember Pilot Context</span>
        <span>·</span>
        <span className="text-[#A1A1AA]">Ethereum Sepolia</span>
      </div>
    </div>
  );
};
