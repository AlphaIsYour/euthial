import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* LEFT PANEL: BRANDING & PROTOCOL HIGHLIGHTS (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 bg-gradient-to-br from-[#121212] via-[#0D0D0D] to-[#080808] border-r border-white/10 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Logo & Title */}
        <div className="space-y-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[12px] bg-blue-600 flex items-center justify-center text-white font-black font-mono shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight">EUTHIAL</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Protocol Architecture
              </div>
            </div>
          </Link>

          <div className="pt-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Verifiable Revenue-Based Financing (RBF)
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Infrastruktur Pembiayaan Ruko Berbasis Omzet Terverifikasi.
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Smart contract wasit digital yang menyelaraskan kepentingan Pemilik Aset, Pengelola Ritel UMKM, Kontraktor, dan Investor Modal dengan kepastian hukum dan audit on-chain instan.
            </p>
          </div>
        </div>

        {/* Middle: Key Guarantees Carousel/Cards */}
        <div className="grid grid-cols-2 gap-3 relative z-10 my-8">
          <div className="p-4 rounded-[12px] bg-[#151515] border border-white/10 space-y-1">
            <span className="text-xs font-mono text-blue-400 font-bold">WATERFALL 80:15:5</span>
            <div className="text-xs text-zinc-300">
              Setoran harian QRIS dipotong otomatis tanpa manipulasi pembukuan.
            </div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#151515] border border-white/10 space-y-1">
            <span className="text-xs font-mono text-emerald-400 font-bold">10% BOND ESCROW</span>
            <div className="text-xs text-zinc-300">
              Uang jaminan penyewa melindungi investor dari risiko penurunan omzet.
            </div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#151515] border border-white/10 space-y-1">
            <span className="text-xs font-mono text-purple-400 font-bold">2-OF-3 MULTISIG</span>
            <div className="text-xs text-zinc-300">
              Pencairan termin renovasi mensyaratkan verifikasi fisik inspektur independen.
            </div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#151515] border border-white/10 space-y-1">
            <span className="text-xs font-mono text-amber-400 font-bold">STEP-IN PROTOCOL</span>
            <div className="text-xs text-zinc-300">
              Hak ambil alih fisik ruko otomatis jika terjadi default dua bulan berurutan.
            </div>
          </div>
        </div>

        {/* Bottom: Pilot Metrics & Live Testnet Tag */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500 relative z-10">
          <div>Sepolia Testnet · Pilot Ruko Pasar Baru #01</div>
          <div className="text-zinc-400">Ethereum Hackathon Jakarta 2026</div>
        </div>
      </div>

      {/* RIGHT PANEL: INTERACTIVE AUTH CONTAINER */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 min-h-screen relative">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header Logo */}
          <div className="flex lg:hidden items-center justify-between pb-4 border-b border-white/10">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-blue-600 flex items-center justify-center text-white font-bold font-mono">
                E
              </div>
              <span className="font-bold text-white tracking-tight">EUTHIAL</span>
            </Link>
            <span className="text-[11px] font-mono text-zinc-400">Pilot #01</span>
          </div>

          {children}

          {/* Global Back Link */}
          <div className="pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Kembali ke Beranda Protokol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
