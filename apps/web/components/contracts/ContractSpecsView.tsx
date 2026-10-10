"use client";

import React from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

const contractsList = [
  {
    name: "FitOutAgreement",
    file: "FitOutAgreement.sol",
    address: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
    role: "State Machine, Milestone, Covenant Floor, Bond & Step-In",
    spec: "Solidity ^0.8.24",
  },
  {
    name: "WaterfallRouter",
    file: "WaterfallRouter.sol",
    address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    role: "EIP-712 Attestation Verifier, 80/15/5% Split, Tranche Routing",
    spec: "EIP-712 Typed Data",
  },
  {
    name: "SeniorTrancheVault",
    file: "TrancheVault.sol",
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    role: "ERC-4626 Vault (External Investors, 80% Capital, 1.25x Cap)",
    spec: "ERC-4626 / OpenZeppelin v5",
  },
  {
    name: "JuniorTrancheVault",
    file: "TrancheVault.sol",
    address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    role: "ERC-4626 Vault (Landlord Co-investment, 20% First-Loss, 1.40x Cap)",
    spec: "ERC-4626 / First-Loss Buffer",
  },
  {
    name: "MockIDR",
    file: "MockIDR.sol",
    address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    role: "IDR Stablecoin Mock (6 Decimals, 1 IDR = 1 Token)",
    spec: "ERC-20 (6 Decimals)",
  },
];

export const ContractSpecsView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-sm font-semibold text-white">Smart Contract Deployments (Sepolia Testnet)</h2>
          <p className="text-xs text-[#8A8A8A]">
            Daftar kontrak protokol Euthial yang telah diverifikasi dan siap berinteraksi on-chain.
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-md text-emerald-400">
          Chain ID: 11155111 (Sepolia)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contractsList.map((c) => (
          <div
            key={c.name}
            className="p-4 bg-[#1A1A1A] border border-[rgba(207,207,207,0.08)] rounded-card space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">{c.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                {c.spec}
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">{c.role}</p>
            <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#8A8A8A]">
              <span className="truncate max-w-[240px] text-white/90">{c.address}</span>
              <button
                onClick={() => navigator.clipboard?.writeText(c.address)}
                className="hover:text-white flex items-center gap-1 text-[11px]"
                title="Salin Address"
              >
                <MaterialIcon name="content_copy" size={14} />
                <span>Salin</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
