import React from "react";
import Link from "next/link";
import { LoginForm } from "../../../components/auth/LoginForm";

export const metadata = {
  title: "Masuk Akun · Euthial Protocol",
  description: "Masuk ke ekosistem pembiayaan ruko Euthial dengan Web3 Wallet SIWE atau kredensial akun.",
};

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
          Selamat Datang Kembali
        </h2>
        <p className="text-xs text-slate-300 drop-shadow-sm">
          Masuk untuk mengakses portal pembiayaan, monitoring kasir POS, atau milestone renovasi.
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 shadow-2xl shadow-black/40">
        <React.Suspense fallback={<div className="h-48 flex items-center justify-center text-xs text-slate-400 font-mono">Memuat formulir autentikasi...</div>}>
          <LoginForm />
        </React.Suspense>
      </div>

      <div className="text-center text-xs text-slate-300 drop-shadow-sm">
        Belum memiliki akun terdaftar?{" "}
        <Link
          href="/register"
          className="text-emerald-400 hover:underline font-bold ml-0.5"
        >
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}
