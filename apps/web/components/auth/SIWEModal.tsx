"use client";

import React, { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";

interface SIWEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: string) => void;
}

export const SIWEModal: React.FC<SIWEModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !address) return null;

  const handleSignInWithEthereum = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) throw new Error("Gagal mengambil nonce keamanan.");
      const { nonce } = await nonceRes.json();

      // 2. Prepare SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = "Masuk ke Euthial Protocol untuk memverifikasi kepemilikan wallet dan hak akses peran.";

      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: "1",
        chainId: chainId || 11155111,
        nonce,
      });

      const preparedMessage = message.prepareMessage();

      // 3. User signs message with wallet
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // 4. Verify signature on backend /api/auth/verify
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: preparedMessage, signature }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.ok) {
        throw new Error(verifyData.error || "Verifikasi tanda tangan gagal.");
      }

      // Store in localStorage for persistent client session
      if (typeof window !== "undefined") {
        localStorage.setItem("euthial-siwe-verified", address);
      }

      onSuccess(address);
      onClose();
    } catch (err: any) {
      console.error("SIWE Error:", err);
      setError(err?.message || "Otorisasi wallet dibatalkan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
              verified_user
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Sign-In with Ethereum (EIP-4361)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
          Tandatangani pesan kriptografis 1x pakai (tanpa biaya gas) untuk memvalidasi bahwa Anda adalah pemilik sah dari wallet berikut:
        </p>

        <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 break-all border border-slate-200 dark:border-zinc-700">
          {address}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSignInWithEthereum}
            disabled={loading}
            className="px-5 py-2 text-xs font-mono font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 flex items-center gap-1.5 transition-all"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  sync
                </span>
                Menunggu Signature...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  draw
                </span>
                Tandatangani Pesan (SIWE)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
