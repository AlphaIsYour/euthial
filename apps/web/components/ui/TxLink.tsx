"use client";

import React, { useState } from "react";
import { DEFAULT_CONFIG } from "../../contracts/addresses";

interface TxLinkProps {
  txHash: string;
  chainId?: number;
  label?: string;
  className?: string;
  showCopy?: boolean;
}

export const TxLink: React.FC<TxLinkProps> = ({
  txHash,
  chainId,
  label,
  className = "",
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const explorerUrl = chainId === 31337
    ? `http://localhost:8545/tx/${txHash}`
    : `${DEFAULT_CONFIG.blockExplorer}/tx/${txHash}`;

  const truncated = `${txHash.slice(0, 6)}...${txHash.slice(-4)}`;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group"
        title="Lihat transaksi di Sepolia Etherscan"
      >
        <span>{label || truncated}</span>
        <span className="material-symbols-outlined text-[13px] opacity-70 group-hover:opacity-100 transition-opacity">
          open_in_new
        </span>
      </a>

      {showCopy && (
        <button
          onClick={copyToClipboard}
          className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          title={copied ? "Tersalin!" : "Salin TX Hash"}
        >
          <span className="material-symbols-outlined text-[13px]">
            {copied ? "check" : "content_copy"}
          </span>
        </button>
      )}
    </div>
  );
};
