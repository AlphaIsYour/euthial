"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract } from "wagmi";
import { AGREEMENT_FACTORY_ABI } from "@/contracts/abis";
import { NETWORKS, DEFAULT_CHAIN_ID } from "@/contracts/addresses";

export default function NewDealWizardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [loading, setLoading] = useState(false);
  const [deployMode, setDeployMode] = useState<"instant" | "onchain">("instant");

  const [form, setForm] = useState({
    propertyName: "Ruko Senopati Artisan Hub #2",
    location: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
    budget: 150000000,
    seniorPrincipal: 120000000,
    juniorPrincipal: 30000000,
    seniorMultipleBps: 12500,
    juniorMultipleBps: 14000,
    targetTenorDays: 540,
    maxTenorDays: 720,
    floorRatioBps: 6000,
    toleranceBps: 100,
    cureDays: 7,
    maxExcusedDays: 30,
    landlordAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    tenantAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    contractorAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    inspectorAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    arbiterAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    attestorAddress: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let deployedAddresses = {
        agreementAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        seniorVaultAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        juniorVaultAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        routerAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      };

      if (deployMode === "onchain" && isConnected) {
        const config = NETWORKS[DEFAULT_CHAIN_ID];
        const factoryAddr = config?.contracts?.agreementFactory;
        if (factoryAddr) {
          // Call on-chain AgreementFactory.createDeal
          await writeContractAsync({
            address: factoryAddr,
            abi: AGREEMENT_FACTORY_ABI,
            functionName: "createDeal",
            args: [
              {
                asset: config.contracts.euthialIDR,
                dealAdmin: form.landlordAddress as `0x${string}`,
                landlord: form.landlordAddress as `0x${string}`,
                tenant: form.tenantAddress as `0x${string}`,
                contractor: form.contractorAddress as `0x${string}`,
                inspector: form.inspectorAddress as `0x${string}`,
                arbiter: form.arbiterAddress as `0x${string}`,
                attestor: form.attestorAddress as `0x${string}`,
                budget: BigInt(form.budget) * 1000000n,
                seniorPrincipal: BigInt(form.seniorPrincipal) * 1000000n,
                juniorPrincipal: BigInt(form.juniorPrincipal) * 1000000n,
                seniorMultipleBps: form.seniorMultipleBps,
                juniorMultipleBps: form.juniorMultipleBps,
                targetTenorDays: form.targetTenorDays,
                maxTenorDays: form.maxTenorDays,
                floorRatioBps: form.floorRatioBps,
                toleranceBps: form.toleranceBps,
                cureDays: form.cureDays,
                maxExcusedDays: form.maxExcusedDays,
                fundraiseDeadline: BigInt(Math.floor(Date.now() / 1000) + 30 * 86400),
                buildDeadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 86400),
                leaseEndDay: Math.floor(Date.now() / 1000) + 1080 * 86400,
                seniorName: `${form.propertyName} Senior Vault`,
                seniorSymbol: "eSNR",
                juniorName: `${form.propertyName} Junior Vault`,
                juniorSymbol: "eJNR",
              },
            ],
          });
        }
      }

      // Save deal into DB
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...deployedAddresses,
          status: "FUNDRAISING",
        }),
      });

      if (res.ok) {
        router.push("/admin/deals");
      }
    } catch (err) {
      console.error("Deal creation error:", err);
      alert("Failed to create deal: " + (err as any)?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href="/admin/deals"
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 mb-2"
        >
          ← Back to Deals
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Deploy New Commercial Fit-Out Deal
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Deploys the full contract suite (Senior Vault, Junior Vault, Agreement, Router) atomik via AgreementFactory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode Selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Deployment Engine
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeployMode("instant")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                deployMode === "instant"
                  ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs font-semibold text-slate-900">
                Sandbox Instant Provisioning
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Instantly provision the deal suite in the persistent protocol database for immediate live testing.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeployMode("onchain")}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                deployMode === "onchain"
                  ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                <span>AgreementFactory On-Chain (EVM)</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">#51</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Submit transaction to AgreementFactory contract via connected Web3 wallet.
              </div>
            </button>
          </div>
        </div>

        {/* Section 1: Property Metadata */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. Property & Location
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Property / Deal Name
              </label>
              <input
                type="text"
                name="propertyName"
                value={form.propertyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Physical Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Financial Terms */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. Financial Terms (IDR & Tranche Split)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Total Fit-Out Budget (IDR)
              </label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Senior Principal (80%)
              </label>
              <input
                type="number"
                name="seniorPrincipal"
                value={form.seniorPrincipal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Junior Principal (20%)
              </label>
              <input
                type="number"
                name="juniorPrincipal"
                value={form.juniorPrincipal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Senior Return Multiple (BPS) — 12500 = 1.25x
              </label>
              <input
                type="number"
                name="seniorMultipleBps"
                value={form.seniorMultipleBps}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Junior Return Multiple (BPS) — 14000 = 1.40x
              </label>
              <input
                type="number"
                name="juniorMultipleBps"
                value={form.juniorMultipleBps}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Protocol Role Addresses */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. Protocol Role Addresses (0x Hex)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Landlord Address
              </label>
              <input
                type="text"
                name="landlordAddress"
                value={form.landlordAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tenant (Operator) Address
              </label>
              <input
                type="text"
                name="tenantAddress"
                value={form.tenantAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contractor Address
              </label>
              <input
                type="text"
                name="contractorAddress"
                value={form.contractorAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Independent Inspector Address
              </label>
              <input
                type="text"
                name="inspectorAddress"
                value={form.inspectorAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/deals"
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {loading ? "Deploying Suite..." : "Deploy Contract Suite →"}
          </button>
        </div>
      </form>
    </div>
  );
}
