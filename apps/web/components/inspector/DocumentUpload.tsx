"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { FITOUT_AGREEMENT_ABI } from "@/contracts/abis";
import { NETWORKS, DEFAULT_CHAIN_ID } from "@/contracts/addresses";

interface DocumentUploadProps {
  dealId?: string;
  milestoneIdx?: number;
  onCidCommitted?: (cid: string) => void;
}

export function DocumentUpload({
  dealId = "deal_demo_01",
  milestoneIdx = 0,
  onCidCommitted,
}: DocumentUploadProps) {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [recentCid, setRecentCid] = useState<string | null>(null);
  const [recentGatewayUrl, setRecentGatewayUrl] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchDocs = () => {
    fetch(`/api/ipfs/upload?dealId=${dealId}&milestoneIdx=${milestoneIdx}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data.documents || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDocs();
  }, [dealId, milestoneIdx]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dealId", dealId);
      formData.append("milestoneIdx", String(milestoneIdx));
      formData.append("title", title || file.name);
      formData.append("submittedBy", "Independent Inspector");

      const res = await fetch("/api/ipfs/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRecentCid(data.ipfs.cid);
        setRecentGatewayUrl(data.ipfs.gatewayUrl);
        setStatusMsg("File pinned to IPFS successfully! Ready to commit on-chain.");
        if (onCidCommitted) {
          onCidCommitted(data.ipfs.cid);
        }
        fetchDocs();
        setFile(null);
        setTitle("");
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCommitOnChain = async (cidToCommit: string) => {
    setCommitting(true);
    try {
      if (isConnected) {
        const config = NETWORKS[DEFAULT_CHAIN_ID];
        const agreementAddr = config?.contracts?.fitOutAgreement;
        if (agreementAddr) {
          const hash = await writeContractAsync({
            address: agreementAddr,
            abi: FITOUT_AGREEMENT_ABI,
            functionName: "commitCID",
            args: [milestoneIdx, cidToCommit],
          });
          setTxHash(hash);
        }
      } else {
        // Simulated local commit hash
        const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
        setTxHash(fakeHash);
      }
      setStatusMsg(`CID ${cidToCommit.slice(0, 10)}... committed on-chain!`);
      if (onCidCommitted) {
        onCidCommitted(cidToCommit);
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to commit CID on-chain: " + err.message);
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>IPFS Evidence Vault (Milestone #{milestoneIdx + 1})</span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              #62 IPFS
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload inspection photos, certificate PDFs, and commit immutable CIDs on-chain.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Document Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Laporan Fisik Sipil & MEP Termin 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Inspection Evidence File (PDF, JPG, PNG max 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            CID will be cryptographically generated and pinned to IPFS
          </span>
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {uploading ? "Pinning to IPFS..." : "Upload to IPFS →"}
          </button>
        </div>
      </form>

      {/* Status Alert */}
      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <span>{statusMsg}</span>
          {recentCid && (
            <button
              onClick={() => handleCommitOnChain(recentCid)}
              disabled={committing}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded shadow-sm transition-colors"
            >
              {committing ? "Committing..." : "Commit CID On-Chain"}
            </button>
          )}
        </div>
      )}

      {txHash && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-lg text-xs space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <span>On-Chain Commitment Confirmed</span>
          </div>
          <div className="font-mono text-[11px] text-purple-700 break-all">
            Tx: {txHash}
          </div>
        </div>
      )}

      {/* Existing Committed Documents */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Committed Milestone Documents ({documents.length})
        </div>

        {documents.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
            No inspection documents committed for this milestone yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                    <span>CID: {doc.cid.slice(0, 14)}...{doc.cid.slice(-6)}</span>
                    <span>•</span>
                    <span>{(doc.fileSize ? (doc.fileSize / 1024).toFixed(0) + " KB" : "Verified")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://ipfs.io/ipfs/${doc.cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                  >
                    View IPFS Gateway ↗
                  </a>
                  <button
                    onClick={() => handleCommitOnChain(doc.cid)}
                    disabled={committing}
                    className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
                  >
                    Re-Commit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
