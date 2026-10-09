"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";

export default function AdminWhitelistPage() {
  const [whitelist, setWhitelist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWhitelist = () => {
    setLoading(true);
    fetch("/api/admin/whitelist")
      .then((res) => res.json())
      .then((data) => {
        setWhitelist(data.whitelist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch whitelist:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newAddress, name: newName, role: "INVESTOR" }),
      });
      if (res.ok) {
        setNewAddress("");
        setNewName("");
        fetchWhitelist();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add address");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED";
    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        setWhitelist((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address from whitelist?")) return;
    try {
      const res = await fetch(`/api/admin/whitelist?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWhitelist((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete whitelist entry:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Investor Whitelist & KYC Gate
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enforces transfer restriction and investor onboarding before ERC-4626 vault share deposit.
        </p>
      </div>

      {/* Add Address Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Add New KYC-Verified Wallet
        </h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <input
              type="text"
              placeholder="0x... Ethereum address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-slate-900"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Entity / Investor Legal Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {submitting ? "Adding..." : "+ Whitelist Address"}
            </button>
          </div>
        </form>
      </div>

      {/* Whitelist Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Investor Name</th>
                <th className="py-3 px-4">Wallet Address</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Added Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Loading whitelist...
                  </td>
                </tr>
              ) : whitelist.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No whitelisted addresses yet.
                  </td>
                </tr>
              ) : (
                whitelist.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {w.name || "Anonymous Investor"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                        {w.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {w.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleStatusToggle(w.id, w.status)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                          w.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {w.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(w.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium ml-2"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
