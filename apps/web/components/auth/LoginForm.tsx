"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { SIWEModal } from "./SIWEModal";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [authMethod, setAuthMethod] = useState<"wallet" | "credentials">("wallet");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSiweModal, setShowSiweModal] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Silakan masukkan email dan password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
        return;
      }

      router.push("/demo");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan saat masuk.");
    } finally {
      setLoading(false);
    }
  };

  const handleSiweSuccess = async (verifiedAddress: string) => {
    try {
      setLoading(true);
      const res = await signIn("siwe", {
        address: verifiedAddress,
        redirect: false,
      });

      if (res?.error) {
        setError("Gagal membuat sesi wallet.");
        return;
      }

      router.push("/demo");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Otorisasi wallet gagal.");
    } finally {
      setLoading(false);
    }
  };

  // One-click demo profiles for quick testing/jury demo
  const handleQuickDemoLogin = async (demoEmail: string, redirectPath: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await signIn("credentials", {
        email: demoEmail,
        password: "password123",
        redirect: false,
      });
      if (res?.ok) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setError("Gagal login profil demo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Method Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-[12px] bg-[#151515] border border-white/10 text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("wallet");
            setError(null);
          }}
          className={`py-2 rounded-[10px] transition-all flex items-center justify-center gap-2 ${
            authMethod === "wallet"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
          Web3 Wallet (SIWE)
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("credentials");
            setError(null);
          }}
          className={`py-2 rounded-[10px] transition-all flex items-center justify-center gap-2 ${
            authMethod === "credentials"
              ? "bg-blue-600 text-white font-bold shadow-md"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          Email & Password
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-base shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* WALLET / SIWE SECTION */}
      {authMethod === "wallet" && (
        <div className="p-5 rounded-[12px] bg-[#151515] border border-white/10 space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">verified_user</span>
              Sign-In with Ethereum (EIP-4361)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Verifikasi kepemilikan wallet secara kriptografis tanpa biaya gas. Sesi aman akan dibuat langsung di jaringan.
            </p>
          </div>

          {isConnected && address ? (
            <div className="space-y-3">
              <div className="p-3 rounded-[10px] bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 flex items-center justify-between">
                <span className="truncate">{address}</span>
                <span className="material-symbols-outlined text-sm">link</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSiweModal(true)}
                disabled={loading}
                className="w-full py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">draw</span>
                Tandatangani Signature SIWE &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                ⚠️ Wallet belum terhubung. Gunakan tombol koneksi di pojok kanan atas atau klik tombol berikut.
              </div>
              <button
                type="button"
                onClick={() => setShowSiweModal(true)}
                className="w-full py-2.5 rounded-[12px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Hubungkan Wallet & SIWE
              </button>
            </div>
          )}
        </div>
      )}

      {/* CREDENTIALS SECTION */}
      {authMethod === "credentials" && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Email Perusahaan / Pribadi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.id"
              required
              className="w-full h-10 px-3 rounded-[12px] bg-[#151515] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 rounded-[12px] bg-[#151515] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Memverifikasi...
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <span>&rarr;</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* QUICK DEMO ROLES (FOR JURY / TESTING CONVENIENCE) */}
      <div className="pt-2 border-t border-white/10 space-y-2.5">
        <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>Akses Cepat Demo Persona:</span>
          <span className="text-[10px] text-zinc-600">Password default: password123</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("landlord@euthial.id", "/landlord")}
            className="p-2.5 rounded-[10px] bg-[#151515] hover:bg-purple-950/20 border border-white/10 hover:border-purple-500/40 text-purple-300 text-left transition-all"
          >
            🏢 Landlord (Pemilik)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("investor@euthial.id", "/investor")}
            className="p-2.5 rounded-[10px] bg-[#151515] hover:bg-blue-950/20 border border-white/10 hover:border-blue-500/40 text-blue-300 text-left transition-all"
          >
            📈 Investor (Senior)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("tenant@euthial.id", "/tenant")}
            className="p-2.5 rounded-[10px] bg-[#151515] hover:bg-emerald-950/20 border border-white/10 hover:border-emerald-500/40 text-emerald-300 text-left transition-all"
          >
            ☕ Tenant (Pengelola)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("inspector@euthial.id", "/inspector")}
            className="p-2.5 rounded-[10px] bg-[#151515] hover:bg-amber-950/20 border border-white/10 hover:border-amber-500/40 text-amber-300 text-left transition-all"
          >
            🔍 Inspektur (Fisik)
          </button>
        </div>
      </div>

      <SIWEModal
        isOpen={showSiweModal}
        onClose={() => setShowSiweModal(false)}
        onSuccess={handleSiweSuccess}
      />
    </div>
  );
};
