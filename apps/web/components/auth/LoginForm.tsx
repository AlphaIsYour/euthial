"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { MaterialIcon } from "../ui/MaterialIcon";
import { SIWEModal } from "./SIWEModal";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [authMethod, setAuthMethod] = useState<"wallet" | "credentials">("credentials");
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
        setError("Email atau kata sandi tidak sesuai. Silakan coba lagi.");
        return;
      }

      router.push("/demo");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Terjadi kendala saat proses autentikasi.");
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
        setError("Gagal mengonfirmasi sesi wallet.");
        return;
      }

      router.push("/demo");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Otorisasi wallet SIWE gagal.");
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Profiles (Pre-populated)
  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Switcher Tab: Email / Wallet (Clean Light Theme) */}
      <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("credentials");
            setError(null);
          }}
          className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
            authMethod === "credentials"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MaterialIcon name="mail" size={14} />
          <span>Email & Password</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("wallet");
            setError(null);
          }}
          className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 ${
            authMethod === "wallet"
              ? "bg-white text-slate-900 shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <MaterialIcon name="account_balance_wallet" size={14} />
          <span>Web3 SIWE</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <MaterialIcon name="error" size={15} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CREDENTIALS SECTION */}
      {authMethod === "credentials" && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Email Akun</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.id"
              required
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Kata Sandi</label>
              <span className="text-[11px] text-slate-400">Min. 6 karakter</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 active:scale-[0.99] mt-1"
          >
            {loading ? (
              <>
                <MaterialIcon name="sync" size={14} className="animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <MaterialIcon name="arrow_forward" size={14} />
              </>
            )}
          </button>
        </form>
      )}

      {/* WALLET / SIWE SECTION */}
      {authMethod === "wallet" && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <MaterialIcon name="verified_user" size={14} className="text-slate-700" />
              Sign-In with Ethereum (EIP-4361)
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Otentikasi kriptografis gasless langsung dari wallet Anda tanpa password terpusat.
            </p>
          </div>

          {isConnected && address ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                <span className="truncate">{address}</span>
                <MaterialIcon name="check_circle" size={14} className="text-emerald-600 shrink-0 ml-1" />
              </div>
              <button
                type="button"
                onClick={() => setShowSiweModal(true)}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <MaterialIcon name="edit_document" size={14} />
                <span>Tandatangani Signature SIWE</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <MaterialIcon name="info" size={15} className="text-amber-700 shrink-0 mt-0.5" />
                <span>Wallet Web3 belum terhubung. Silakan klik tombol di bawah untuk menghubungkan.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSiweModal(true)}
                className="w-full py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <MaterialIcon name="account_balance_wallet" size={14} />
                <span>Hubungkan Wallet & SIWE</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUICK DEMO PERSONAS (CLEAN 1-CLICK ACCESS) */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Akun Demo Cepat (1-Klik Isi Form):</span>
          <span className="font-mono text-[10px] text-slate-400">demo123</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("budi@landlord.id")}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs flex items-center gap-2 group"
          >
            <MaterialIcon name="domain" size={14} className="text-slate-500 group-hover:text-slate-900" />
            <div className="truncate">
              <div className="font-medium text-slate-800 group-hover:text-slate-950 truncate">Landlord</div>
              <div className="text-[10px] text-slate-500 truncate">budi@landlord.id</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("investor@yieldfund.id")}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs flex items-center gap-2 group"
          >
            <MaterialIcon name="trending_up" size={14} className="text-slate-500 group-hover:text-slate-950" />
            <div className="truncate">
              <div className="font-medium text-slate-800 group-hover:text-slate-950 truncate">Investor</div>
              <div className="text-[10px] text-slate-500 truncate">investor@yieldfund.id</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("kopi@kenangan-ruko.id")}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs flex items-center gap-2 group"
          >
            <MaterialIcon name="storefront" size={14} className="text-slate-500 group-hover:text-slate-950" />
            <div className="truncate">
              <div className="font-medium text-slate-800 group-hover:text-slate-950 truncate">Tenant</div>
              <div className="text-[10px] text-slate-500 truncate">kopi@kenangan-ruko.id</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("mandor@kontraktor.id")}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition text-xs flex items-center gap-2 group"
          >
            <MaterialIcon name="construction" size={14} className="text-slate-500 group-hover:text-slate-950" />
            <div className="truncate">
              <div className="font-medium text-slate-800 group-hover:text-slate-950 truncate">Kontraktor</div>
              <div className="text-[10px] text-slate-500 truncate">mandor@kontraktor.id</div>
            </div>
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
