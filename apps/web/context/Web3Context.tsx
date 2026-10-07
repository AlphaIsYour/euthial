"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Address,
  type Hex,
  parseUnits,
} from "viem";
import { sepolia } from "viem/chains";
import { NETWORKS, DEFAULT_CHAIN_ID, type NetworkContracts } from "../contracts/addresses";
import {
  FITOUT_AGREEMENT_ABI,
  TRANCHE_VAULT_ABI,
  MOCK_IDR_ABI,
} from "../contracts/abis";
import { useProtocol } from "./ProtocolContext";

export type TxStatus = "idle" | "submitting" | "confirmed" | "simulated" | "error";

interface Web3ContextType {
  isWalletConnected: boolean;
  address: string | null;
  chainId: number | null;
  networkConfig: NetworkContracts;
  isSepolia: boolean;
  txStatus: TxStatus;
  lastTxHash: string | null;
  txMessage: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  // Dual-mode action handlers
  depositBond: (amount: number) => Promise<void>;
  cureTopUp: (amount: number) => Promise<void>;
  withdrawSeniorCash: (amount: number) => Promise<void>;
  approveMilestone: (id: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const protocol = useProtocol();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(DEFAULT_CHAIN_ID);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [txMessage, setTxMessage] = useState<string | null>(null);

  const networkConfig = NETWORKS[chainId || DEFAULT_CHAIN_ID] || NETWORKS[DEFAULT_CHAIN_ID];
  const isSepolia = chainId === 11155111;

  // Check existing wallet connection on mount
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsWalletConnected(true);
          }
        })
        .catch(() => {});

      eth
        .request({ method: "eth_chainId" })
        .then((hexChainId: string) => {
          const parsed = parseInt(hexChainId, 16);
          setChainId(parsed);
        })
        .catch(() => {});

      const handleAccountsChanged = (accs: string[]) => {
        if (accs.length > 0) {
          setAddress(accs[0]);
          setIsWalletConnected(true);
        } else {
          setAddress(null);
          setIsWalletConnected(false);
        }
      };

      const handleChainChanged = (hexChain: string) => {
        setChainId(parseInt(hexChain, 16));
      };

      eth.on("accountsChanged", handleAccountsChanged);
      eth.on("chainChanged", handleChainChanged);

      return () => {
        if (eth.removeListener) {
          eth.removeListener("accountsChanged", handleAccountsChanged);
          eth.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const eth = (window as any).ethereum;
        const accounts = await eth.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsWalletConnected(true);
          const currentChain = await eth.request({ method: "eth_chainId" });
          setChainId(parseInt(currentChain, 16));
        }
      } catch (err: any) {
        console.warn("User rejected wallet connection or error:", err);
      }
    } else {
      // Fallback mock wallet for seamless browser demo
      setAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      setIsWalletConnected(true);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setAddress(null);
  };

  const resetTxStateAfterDelay = () => {
    setTimeout(() => {
      setTxStatus("idle");
      setTxMessage(null);
    }, 4000);
  };

  // 1. Dual-mode Deposit Bond
  const depositBond = async (amount: number) => {
    setTxStatus("submitting");
    setTxMessage(`Menyetor uang jaminan Rp ${amount.toLocaleString("id-ID")}...`);

    if (isWalletConnected && (window as any).ethereum && address) {
      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom((window as any).ethereum),
        });

        // Convert to 6 decimals
        const tokenAmount = parseUnits(amount.toString(), 6);
        const hash = await walletClient.writeContract({
          address: networkConfig.contracts.fitOutAgreement,
          abi: FITOUT_AGREEMENT_ABI,
          functionName: "depositBond",
          args: [tokenAmount],
          account: address as Address,
        });

        setLastTxHash(hash);
        setTxStatus("confirmed");
        setTxMessage(`Transaksi On-Chain Terkonfirmasi! (${hash.slice(0, 10)}...)`);
        protocol.depositBond(amount);
        resetTxStateAfterDelay();
        return;
      } catch (err: any) {
        console.warn("On-chain execution failed, falling back to simulation:", err);
      }
    }

    // Fallback: Optimistic Simulation Mode
    protocol.depositBond(amount);
    setTxStatus("simulated");
    setTxMessage(`Mode Simulasi: Deposit Bond Rp ${amount.toLocaleString("id-ID")} berhasil disetor.`);
    resetTxStateAfterDelay();
  };

  // 2. Dual-mode Cure Top Up
  const cureTopUp = async (amount: number) => {
    setTxStatus("submitting");
    setTxMessage(`Menyetor pelunasan cure shortfall Rp ${amount.toLocaleString("id-ID")}...`);

    if (isWalletConnected && (window as any).ethereum && address) {
      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom((window as any).ethereum),
        });

        const tokenAmount = parseUnits(amount.toString(), 6);
        const hash = await walletClient.writeContract({
          address: networkConfig.contracts.fitOutAgreement,
          abi: FITOUT_AGREEMENT_ABI,
          functionName: "payShortfall",
          args: [tokenAmount],
          account: address as Address,
        });

        setLastTxHash(hash);
        setTxStatus("confirmed");
        setTxMessage(`Pelunasan Shortfall On-Chain Terkonfirmasi! (${hash.slice(0, 10)}...)`);
        protocol.cureTopUp(amount);
        resetTxStateAfterDelay();
        return;
      } catch (err: any) {
        console.warn("On-chain execution failed, falling back to simulation:", err);
      }
    }

    protocol.cureTopUp(amount);
    setTxStatus("simulated");
    setTxMessage(`Mode Simulasi: Pelunasan Cure Shortfall Rp ${amount.toLocaleString("id-ID")} berhasil.`);
    resetTxStateAfterDelay();
  };

  // 3. Dual-mode Withdraw Senior Cash
  const withdrawSeniorCash = async (amount: number) => {
    setTxStatus("submitting");
    setTxMessage(`Menarik kas dividen investor Rp ${amount.toLocaleString("id-ID")}...`);

    if (isWalletConnected && (window as any).ethereum && address) {
      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom((window as any).ethereum),
        });

        const tokenAmount = parseUnits(amount.toString(), 6);
        const hash = await walletClient.writeContract({
          address: networkConfig.contracts.seniorVault,
          abi: TRANCHE_VAULT_ABI,
          functionName: "withdraw",
          args: [tokenAmount, address as Address, address as Address],
          account: address as Address,
        });

        setLastTxHash(hash);
        setTxStatus("confirmed");
        setTxMessage(`Penarikan Kas On-Chain Berhasil! (${hash.slice(0, 10)}...)`);
        protocol.withdrawSeniorCash();
        resetTxStateAfterDelay();
        return;
      } catch (err: any) {
        console.warn("On-chain execution failed, falling back to simulation:", err);
      }
    }

    protocol.withdrawSeniorCash();
    setTxStatus("simulated");
    setTxMessage(`Mode Simulasi: Kas dividen Rp ${amount.toLocaleString("id-ID")} berhasil ditarik.`);
    resetTxStateAfterDelay();
  };

  // 4. Dual-mode Approve Milestone
  const approveMilestone = async (id: number) => {
    setTxStatus("submitting");
    setTxMessage(`Menandatangani persetujuan termin fisik #${id}...`);

    if (isWalletConnected && (window as any).ethereum && address) {
      try {
        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom((window as any).ethereum),
        });

        const hash = await walletClient.writeContract({
          address: networkConfig.contracts.fitOutAgreement,
          abi: FITOUT_AGREEMENT_ABI,
          functionName: "approveMilestone",
          args: [id - 1], // 0-indexed in Solidity
          account: address as Address,
        });

        setLastTxHash(hash);
        setTxStatus("confirmed");
        setTxMessage(`Persetujuan Termin #${id} On-Chain Berhasil! (${hash.slice(0, 10)}...)`);
        protocol.approveLandlordMilestone(id);
        resetTxStateAfterDelay();
        return;
      } catch (err: any) {
        console.warn("On-chain execution failed, falling back to simulation:", err);
      }
    }

    protocol.approveLandlordMilestone(id);
    setTxStatus("simulated");
    setTxMessage(`Mode Simulasi: Termin #${id} ditandatangani.`);
    resetTxStateAfterDelay();
  };

  return (
    <Web3Context.Provider
      value={{
        isWalletConnected,
        address,
        chainId,
        networkConfig,
        isSepolia,
        txStatus,
        lastTxHash,
        txMessage,
        connectWallet,
        disconnectWallet,
        depositBond,
        cureTopUp,
        withdrawSeniorCash,
        approveMilestone,
      }}
    >
      {children}

      {/* Global Web3 Transaction Toast Indicator */}
      {txStatus !== "idle" && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
          <div
            className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-mono max-w-md ${
              txStatus === "confirmed"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : txStatus === "submitting"
                ? "bg-blue-950/90 border-blue-500/40 text-blue-300"
                : txStatus === "simulated"
                ? "bg-[#18181b]/95 border-amber-500/40 text-amber-300"
                : "bg-red-950/90 border-red-500/40 text-red-300"
            }`}
          >
            <span
              className={`material-symbols-outlined text-base ${
                txStatus === "submitting" ? "animate-spin" : ""
              }`}
            >
              {txStatus === "confirmed"
                ? "check_circle"
                : txStatus === "submitting"
                ? "sync"
                : txStatus === "simulated"
                ? "model_training"
                : "error"}
            </span>

            <div className="flex-1 truncate">
              <div className="font-bold">
                {txStatus === "confirmed"
                  ? "TRANSAKSI ON-CHAIN TERKONFIRMASI"
                  : txStatus === "submitting"
                  ? "MENUNGGU SIGNATURE METAMASK..."
                  : txStatus === "simulated"
                  ? "MODE SIMULASI RESPONSIF"
                  : "TRANSAKSI GAGAL"}
              </div>
              <div className="text-[11px] opacity-80 truncate">{txMessage}</div>
            </div>

            {lastTxHash && (
              <a
                href={`${networkConfig.blockExplorer}/tx/${lastTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] underline hover:opacity-100 text-white shrink-0 ml-1"
              >
                Explorer &rarr;
              </a>
            )}
          </div>
        </div>
      )}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const ctx = useContext(Web3Context);
  if (!ctx) throw new Error("useWeb3 must be used within a Web3Provider");
  return ctx;
};
