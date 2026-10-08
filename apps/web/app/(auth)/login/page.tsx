import React from "react";
import Link from "next/link";
import { LoginForm } from "../../../components/auth/LoginForm";

export const metadata = {
  title: "Masuk Akun · Euthial Protocol",
  description: "Masuk ke ekosistem pembiayaan ruko Euthial dengan Web3 Wallet SIWE atau kredensial akun.",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Selamat Datang Kembali
        </h2>
        <p className="text-xs text-zinc-400">
          Masuk ke portal protokol untuk mengelola permodalan, ruko, atau verifikasi fisik termin.
        </p>
      </div>

      <LoginForm />

      <div className="p-4 rounded-[12px] bg-[#121212] border border-white/5 text-center text-xs text-zinc-400">
        Belum memiliki akun terdaftar?{" "}
        <Link
          href="/register"
          className="text-blue-400 hover:text-blue-300 font-semibold font-mono underline ml-1"
        >
          Daftar Akun Baru &rarr;
        </Link>
      </div>
    </div>
  );
}
