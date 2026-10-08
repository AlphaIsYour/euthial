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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
          Selamat Datang Kembali
        </h2>
        <p className="text-xs text-slate-500">
          Masuk untuk mengakses portal pembiayaan, monitoring kasir POS, atau milestone renovasi.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <LoginForm />
      </div>

      <div className="text-center text-xs text-slate-600">
        Belum memiliki akun terdaftar?{" "}
        <Link
          href="/register"
          className="text-slate-950 hover:underline font-semibold ml-0.5"
        >
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}
