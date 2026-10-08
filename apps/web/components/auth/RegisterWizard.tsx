"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAccount } from "wagmi";
import { MaterialIcon } from "../ui/MaterialIcon";
import { RoleSelector, type RoleType } from "./RoleSelector";

export const RegisterWizard: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<RoleType>("INVESTOR");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Semua field identitas wajib diisi.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      setError("Harap setujui syarat dan ketentuan protokol.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          walletAddress: isConnected && address ? address : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Gagal melakukan pendaftaran akun.");
      }

      // Auto sign in after registration
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.ok) {
        router.push("/demo");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kendala saat pendaftaran akun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Indicators */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step >= 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            1
          </span>
          <span className={step >= 1 ? "text-slate-900 font-semibold" : "text-slate-400"}>
            Pilih Peran
          </span>
        </div>

        <div className="h-[1px] w-8 bg-slate-200" />

        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step >= 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            2
          </span>
          <span className={step >= 2 ? "text-slate-900 font-semibold" : "text-slate-400"}>
            Identitas
          </span>
        </div>

        <div className="h-[1px] w-8 bg-slate-200" />

        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              step >= 3 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            3
          </span>
          <span className={step >= 3 ? "text-slate-900 font-semibold" : "text-slate-400"}>
            Konfirmasi
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <MaterialIcon name="error" size={15} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PILIH PERAN */}
      {step === 1 && (
        <div className="space-y-4">
          <RoleSelector selectedRole={role} onSelect={setRole} />
          <button
            type="button"
            onClick={handleStep1Next}
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <span>Lanjutkan ke Identitas</span>
            <MaterialIcon name="arrow_forward" size={14} />
          </button>
        </div>
      )}

      {/* STEP 2: ISI IDENTITAS */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Nama Lengkap / Entitas</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso / PT Kopi Nusantara"
              required
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Email Resmi</label>
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
              minLength={6}
              className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
            />
          </div>

          {/* Connected Wallet Link info */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5 text-xs">
            <div className="font-medium text-slate-800 flex items-center gap-1.5 text-[11px]">
              <MaterialIcon name="account_balance_wallet" size={13} className="text-slate-600" />
              <span>Wallet Web3 (Opsional)</span>
            </div>
            {isConnected && address ? (
              <div className="font-mono text-[10px] text-slate-700 truncate">
                Terkoneksi: {address}
              </div>
            ) : (
              <div className="text-slate-500 text-[10px]">
                Wallet belum terhubung. Anda dapat menghubungkan wallet di dashboard nanti.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Lanjut ke Ringkasan</span>
              <MaterialIcon name="arrow_forward" size={14} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: KONFIRMASI */}
      {step === 3 && (
        <div className="space-y-3.5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="text-slate-700 font-semibold border-b border-slate-200 pb-1 text-[11px] uppercase tracking-wider">
              Ringkasan Data Akun
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peran:</span>
              <span className="text-slate-900 font-semibold">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nama:</span>
              <span className="text-slate-900 font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-900 font-medium">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wallet:</span>
              <span className="text-slate-700 font-mono text-[11px] truncate max-w-[160px]">
                {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Belum terhubung"}
              </span>
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded accent-slate-900"
            />
            <span className="text-[11px] text-slate-600 leading-relaxed">
              Saya menyetujui ketentuan partisipasi protokol Euthial (aturan waterfall, escrow jaminan, dan audit on-chain).
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading || !agreedToTerms}
              className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <MaterialIcon name="sync" size={14} className="animate-spin" />
                  <span>Memproses Pendaftaran...</span>
                </>
              ) : (
                <>
                  <span>Selesaikan Pendaftaran</span>
                  <MaterialIcon name="check" size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
