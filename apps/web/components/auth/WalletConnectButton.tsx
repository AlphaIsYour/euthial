"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { SIWEModal } from "./SIWEModal";
import { MaterialIcon } from "../ui/MaterialIcon";

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
                      className="h-8 px-3 rounded-lg text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                    >
                      <MaterialIcon name="account_balance_wallet" size={13} className="shrink-0 text-white" />
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="h-8 px-3 rounded-lg text-xs font-mono font-semibold bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <MaterialIcon name="warning" size={13} className="shrink-0 text-white" />
                      Pindah Jaringan
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={openChainModal}
                      className="h-8 px-2.5 rounded-lg text-xs font-mono border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-all flex items-center gap-1.5 shrink-0"
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
                      <span className="hidden sm:inline">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="h-8 px-2.5 rounded-lg text-xs font-mono font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-100 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{account.displayName}</span>
                    </button>

                    {/* SIWE Status Badge / Trigger */}
                    {isSiweVerified ? (
                      <span
                        className="h-8 px-2 rounded-lg text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0"
                        title="Terverifikasi SIWE (EIP-4361)"
                      >
                        <MaterialIcon name="verified" size={12} className="shrink-0" />
                        <span className="hidden sm:inline">SIWE ✓</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowSiweModal(true)}
                        className="h-8 px-2.5 rounded-lg text-[11px] font-mono bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 shrink-0"
                        title="Verifikasi identitas via SIWE"
                      >
                        <MaterialIcon name="key" size={12} className="shrink-0" />
                        <span>SIWE</span>
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
