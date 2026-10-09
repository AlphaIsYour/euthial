"use client";

import React, { useState } from "react";
import { DEFAULT_CONFIG } from "../../contracts/addresses";

export interface TxLinkProps {
  txHash?: string;
  hash?: string;
  type?: "tx" | "address";
  chainId?: number;
  label?: string;
  className?: string;
  showCopy?: boolean;
}

export const TxLink: React.FC<TxLinkProps> = ({
  txHash,
  hash,
  type = "tx",
  chainId,
  label,
  className = "",
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const effectiveHash = hash || txHash || "";

  const explorerPath = type === "address" ? "address" : "tx";
  const explorerUrl =
    chainId === 31337
      ? `http://localhost:8545/${explorerPath}/${effectiveHash}`
      : `${DEFAULT_CONFIG.blockExplorer}/${explorerPath}/${effectiveHash}`;

  const truncated =
    effectiveHash.length > 12
      ? `${effectiveHash.slice(0, 6)}...${effectiveHash.slice(-4)}`
      : effectiveHash;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(effectiveHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!effectiveHash) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 group"
        title={`Lihat ${type === "address" ? "alamat" : "transaksi"} di Etherscan`}
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
          title={copied ? "Tersalin!" : "Salin ke Clipboard"}
        >
          <span className="material-symbols-outlined text-[13px]">
            {copied ? "check" : "content_copy"}
          </span>
        </button>
      )}
    </div>
  );
};
