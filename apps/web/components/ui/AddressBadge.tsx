"use client";

import React, { useState } from "react";
import { DEFAULT_CONFIG } from "../../contracts/addresses";

interface AddressBadgeProps {
  address: string;
  roleLabel?: string;
  chainId?: number;
  className?: string;
  showExplorer?: boolean;
}

export const AddressBadge: React.FC<AddressBadgeProps> = ({
  address,
  roleLabel,
  chainId,
  className = "",
  showExplorer = true,
}) => {
  const [copied, setCopied] = useState(false);
  const explorerUrl = chainId === 31337
    ? `http://localhost:8545/address/${address}`
    : `${DEFAULT_CONFIG.blockExplorer}/address/${address}`;

  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-mono text-slate-800 dark:text-zinc-200 ${className}`}>
      {roleLabel && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {roleLabel}
        </span>
      )}

      <span>{truncated}</span>

      <button
        onClick={copyToClipboard}
        className="p-0.5 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        title={copied ? "Tersalin!" : "Salin Address"}
      >
        <span className="material-symbols-outlined text-[13px]">
          {copied ? "check" : "content_copy"}
        </span>
      </button>

      {showExplorer && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-0.5 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
          title="Buka di Block Explorer"
        >
          <span className="material-symbols-outlined text-[13px]">
            open_in_new
          </span>
        </a>
      )}
    </div>
  );
};
