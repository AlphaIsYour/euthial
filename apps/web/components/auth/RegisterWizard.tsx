"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAccount } from "wagmi";
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
      setError(err?.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            1
          </span>
          <span className={step >= 1 ? "text-white font-medium" : "text-zinc-500"}>
            Pilih Peran
          </span>
        </div>

        <div className="h-[1px] w-8 bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            2
          </span>
          <span className={step >= 2 ? "text-white font-medium" : "text-zinc-500"}>
            Identitas
          </span>
        </div>

        <div className="h-[1px] w-8 bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            3
          </span>
          <span className={step >= 3 ? "text-white font-medium" : "text-zinc-500"}>
            Konfirmasi
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fadeIn">
          <span className="material-symbols-outlined text-base shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: PILIH PERAN */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <RoleSelector selectedRole={role} onSelect={setRole} />
          <button
            type="button"
            onClick={handleStep1Next}
            className="w-full py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
          >
            Lanjutkan ke Identitas &rarr;
          </button>
        </div>
      )}

      {/* STEP 2: ISI IDENTITAS */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Nama Lengkap / Nama Entitas Usaha</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso / PT Kopi Nusantara"
              required
              className="w-full h-10 px-3 rounded-[12px] bg-[#151515] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Email Resmi</label>
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
            <label className="text-xs font-mono text-zinc-300">Kata Sandi Akun</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              minLength={6}
              className="w-full h-10 px-3 rounded-[12px] bg-[#151515] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Connected Wallet Link info */}
          <div className="p-3.5 rounded-[12px] bg-[#151515] border border-white/10 space-y-1 text-xs">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-400 text-sm">account_balance_wallet</span>
              Tautan Wallet Web3 (Opsional)
            </div>
            {isConnected && address ? (
              <div className="font-mono text-[11px] text-emerald-400 truncate">
                Terhubung: {address}
              </div>
            ) : (
              <div className="text-zinc-500 text-[11px]">
                Wallet belum terhubung. Anda dapat menghubungkan wallet nanti di profil pengguna.
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-all"
            >
              &larr; Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono transition-all shadow-md flex items-center justify-center gap-2"
            >
              Tinjau Pendaftaran &rarr;
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: KONFIRMASI */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 rounded-[12px] bg-[#151515] border border-white/10 space-y-3 text-xs font-mono">
            <div className="text-zinc-400 font-bold border-b border-white/10 pb-2">
              RINGKASAN AKUN PROTOKOL
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Peran Terpilih:</span>
              <span className="text-blue-400 font-bold">{role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Nama Lengkap:</span>
              <span className="text-white">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Email:</span>
              <span className="text-white">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Wallet Terhubung:</span>
              <span className="text-emerald-400 truncate max-w-[180px]">
                {isConnected && address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "Belum terhubung"}
              </span>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-[12px] bg-[#151515] border border-white/10 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded accent-blue-600"
            />
            <span className="text-xs text-zinc-400 leading-relaxed">
              Saya memahami bahwa protokol Euthial beroperasi dengan smart contract terotomatisasi (aturan waterfall, pemotongan uang jaminan, dan audit on-chain) dan menyetujui seluruh ketentuan partisipasi.
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-[12px] bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-all"
            >
              &larr; Kembali
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading || !agreedToTerms}
              className="flex-1 py-2.5 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Mendaftarkan Akun...
                </>
              ) : (
                <>
                  <span>Selesaikan Pendaftaran</span>
                  <span>✓</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
