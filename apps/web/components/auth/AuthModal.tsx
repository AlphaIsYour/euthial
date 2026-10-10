"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useAccount, useSignMessage } from "wagmi";
import { X, ShieldCheck, Wallet, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"web2" | "web3">("web2");
  const [selectedRole, setSelectedRole] = useState<"INVESTOR" | "LANDLORD" | "TENANT">("INVESTOR");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  if (!isOpen) return null;

  // Handle Web2 Google OAuth
  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signIn("google", { callbackUrl: window.location.href });
    } catch (err: any) {
      setAuthError(err?.message || "Gagal menghubungi Google OAuth");
      setIsSigningIn(false);
    }
  };

  // Handle Web3 SIWE (Sign-In with Ethereum)
  const handleWalletLogin = async () => {
    if (!isConnected || !address) {
      setAuthError("Silakan hubungkan dompet (MetaMask/RainbowKit) terlebih dahulu.");
      return;
    }

    setIsSigningIn(true);
    setAuthError(null);

    try {
      // 1. Fetch Nonce from API
      const nonceRes = await fetch("/api/auth/nonce");
      const { nonce } = await nonceRes.json();

      // 2. Prepare SIWE Message
      const message = `Euthial Protocol Authentication\n\nLogin dengan dompet: ${address}\nRole: ${selectedRole}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;

      // 3. Request Signature from Wallet
      const signature = await signMessageAsync({ message });

      // 4. Verify on Backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          message,
          role: selectedRole,
        }),
      });

      if (verifyRes.ok) {
        window.location.reload();
      } else {
        const errorData = await verifyRes.json();
        setAuthError(errorData?.message || "Verifikasi tanda tangan dompet gagal.");
      }
    } catch (err: any) {
      setAuthError(err?.message || "User menolak tanda tangan di dompet.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/30">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Masuk ke Euthial Protocol</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih metode login Web2 (Google) atau Web3 (Dompet Kripto SIWE)
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 mb-6 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("web2")}
            className={`py-2 rounded-lg transition-all ${
              activeTab === "web2"
                ? "bg-slate-800 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Google OAuth (Web2)
          </button>
          <button
            onClick={() => setActiveTab("web3")}
            className={`py-2 rounded-lg transition-all ${
              activeTab === "web3"
                ? "bg-emerald-600/90 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Web3 Wallet (SIWE)
          </button>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Peran Akun Anda:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["INVESTOR", "LANDLORD", "TENANT"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`py-2 px-1 text-center text-xs font-medium rounded-xl border transition-all ${
                  selectedRole === role
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                {role === "INVESTOR" ? "Investor" : role === "LANDLORD" ? "Pemilik Ruko" : "Penyewa"}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
            {authError}
          </div>
        )}

        {/* Tab 1: Web2 Content */}
        {activeTab === "web2" && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow hover:shadow-md active:scale-98 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isSigningIn ? "Menghubungkan..." : "Lanjutkan dengan Google"}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Akses cepat tanpa perlu instalasi dompet kripto di awal.
            </p>
          </div>
        )}

        {/* Tab 2: Web3 Content */}
        {activeTab === "web3" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status Dompet:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Belum Terhubung"}
              </span>
            </div>

            <button
              onClick={handleWalletLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isSigningIn
                  ? "Menunggu Tanda Tangan..."
                  : isConnected
                  ? "Tanda Tangan & Masuk (SIWE)"
                  : "Sambungkan Dompet Kripto"}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Tanda tangan digital aman tanpa mengirim password atau gas fee.
            </p>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-around text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Escrow Aman</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bagi Hasil Otomatis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tanpa Biaya Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
