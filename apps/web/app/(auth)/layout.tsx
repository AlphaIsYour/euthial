import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen max-h-screen w-full bg-slate-50 text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-slate-900 selection:text-white overflow-hidden">
      {/* SISI KIRI: BRANDING PROTOKOL & INFORMASI PILOT (CLEAN LIGHT THEME) */}
      <div className="hidden lg:flex lg:w-1/2 p-10 xl:p-14 bg-white border-r border-slate-200/80 flex-col justify-between relative overflow-hidden">
        {/* Top: Logo Asli Euthial & Judul */}
        <div className="space-y-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 ">
              <img
                src="/euthial.png"
                alt="Euthial Protocol"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-base text-slate-950 tracking-tight leading-none">
                EUTHIAL
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Verifiable RBF Protocol
              </div>
            </div>
          </Link>

          <div className="pt-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Pilot Komersial #01
            </div>
            <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
              Infrastruktur Pembiayaan Ruko Berbasis Omzet Terverifikasi.
            </h1>
            <p className="text-xs xl:text-sm text-slate-600 leading-relaxed max-w-lg">
              Smart contract wasit digital yang menyelaraskan kepentingan Pemilik Aset, Pengelola Ritel UMKM, Kontraktor, dan Investor Modal dengan audit on-chain instan.
            </p>
          </div>
        </div>

        {/* Middle: Key Protocol Guarantees (Clean Subtle Cards) */}
        <div className="grid grid-cols-2 gap-3 relative z-10 my-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-mono font-bold text-slate-900">
              WATERFALL 80:15:5
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Setoran kasir POS QRIS dipotong otomatis harian tanpa rekayasa pembukuan.
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-mono font-bold text-slate-900">
              10% BOND ESCROW
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Jaminan komitmen penyewa melindungi investor dari risiko penurunan omzet.
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-mono font-bold text-slate-900">
              2-OF-3 MULTISIG
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Termin renovasi dicairkan hanya setelah verifikasi inspektur independen.
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="text-[11px] font-mono font-bold text-slate-900">
              STEP-IN PROTOCOL
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed">
              Hak kelola ruko beralih otomatis jika terjadi default dua periode beruntun.
            </div>
          </div>
        </div>

        {/* Bottom: Protocol Info */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500 relative z-10">
          <div>Verifiable Smart Contract</div>
          <div>Euthial Protocol</div>
        </div>
      </div>

      {/* SISI KANAN: FORM CONTAINER DENGAN BACKGROUND /bg-auth.jpg */}
      <div
        className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-8 xl:p-12 overflow-y-auto lg:overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-auth.jpg')" }}
      >
        {/* Dark/Blur Overlay untuk kontras dan estetika */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-0 pointer-events-none" />

        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center justify-between pb-3 mb-2 border-b border-white/10 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <img
                src="/euthial.png"
                alt="Euthial Protocol"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">EUTHIAL</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-300">Pilot #01</span>
        </div>

        {/* Center Content Card */}
        <div className="w-full max-w-md mx-auto my-auto py-2 relative z-10">
          {children}
        </div>

        {/* Global Back Link */}
        <div className="pt-2 text-center shrink-0 relative z-10">
          <Link
            href="/"
            className="text-xs font-mono text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5 drop-shadow-sm"
          >
            &larr; Kembali ke Beranda Protokol
          </Link>
        </div>
      </div>
    </div>
  );
}
