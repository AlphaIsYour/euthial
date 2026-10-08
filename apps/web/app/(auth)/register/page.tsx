import React from "react";
import Link from "next/link";
import { RegisterWizard } from "../../../components/auth/RegisterWizard";

export const metadata = {
  title: "Daftar Akun Baru · Euthial Protocol",
  description: "Daftarkan diri Anda sebagai Investor, Landlord, Tenant, Kontraktor, atau Inspektur di protokol Euthial.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Pendaftaran Partisipan Protokol
        </h2>
        <p className="text-xs text-zinc-400">
          Ikuti 3 tahapan mudah untuk menghubungkan identitas dan peran Anda ke smart contract.
        </p>
      </div>

      <RegisterWizard />

      <div className="p-4 rounded-[12px] bg-[#121212] border border-white/5 text-center text-xs text-zinc-400">
        Sudah memiliki akun terdaftar?{" "}
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-300 font-semibold font-mono underline ml-1"
        >
          Masuk ke Portal &rarr;
        </Link>
      </div>
    </div>
  );
}
