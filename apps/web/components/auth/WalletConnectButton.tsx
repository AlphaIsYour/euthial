"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { SIWEModal } from "./SIWEModal";

export const WalletConnectButton: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isSiweVerified, setIsSiweVerified] = useState(false);
  const [showSiweModal, setShowSiweModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && address) {
      const verified = localStorage.getItem("euthial-siwe-verified");
      setIsSiweVerified(verified?.toLowerCase() === address.toLowerCase());
    } else {
      setIsSiweVerified(false);
    }
  }, [address]);

  return (
    <div className="flex items-center gap-2">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        account_balance_wallet
                      </span>
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        warning
                      </span>
                      Pindah Jaringan
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openChainModal}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-all flex items-center gap-1.5"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {account.displayName}
                    </button>

                    {/* SIWE Status Badge / Trigger */}
                    {isSiweVerified ? (
                      <span
                        className="px-2 py-1 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                        title="Terverifikasi SIWE (EIP-4361)"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          verified
                        </span>
                        SIWE ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowSiweModal(true)}
                        className="px-2.5 py-1 rounded text-[11px] font-mono bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
                        title="Verifikasi identitas via SIWE"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          key
                        </span>
                        Sign SIWE
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {/* SIWE Verification Modal */}
      <SIWEModal
        isOpen={showSiweModal}
        onClose={() => setShowSiweModal(false)}
        onSuccess={() => setIsSiweVerified(true)}
      />
    </div>
  );
};
