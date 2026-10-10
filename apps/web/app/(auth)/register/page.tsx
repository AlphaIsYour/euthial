import React from "react";
import Link from "next/link";
import { RegisterWizard } from "../../../components/auth/RegisterWizard";

export const metadata = {
  title: "Daftar Akun Baru · Euthial Protocol",
  description: "Daftarkan diri Anda sebagai Investor, Landlord, Tenant, Kontraktor, atau Inspektur di protokol Euthial.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
          Pendaftaran Partisipan
        </h2>
        <p className="text-xs text-slate-300 drop-shadow-sm">
          Ikuti 3 tahapan mudah untuk menghubungkan profil dan peran Anda ke ekosistem protokol.
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 p-5 sm:p-6 shadow-2xl shadow-black/40">
        <RegisterWizard />
      </div>

      <div className="text-center text-xs text-slate-300 drop-shadow-sm">
        Sudah memiliki akun terdaftar?{" "}
        <Link
          href="/login"
          className="text-emerald-400 hover:underline font-bold ml-0.5"
        >
          Masuk ke Akun
        </Link>
      </div>
    </div>
  );
}
