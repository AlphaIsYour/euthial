import React from "react";
import { BaseEmailLayout } from "./BaseEmailLayout";

export interface MilestoneReadyEmailProps {
  recipientName: string;
  propertyName: string;
  milestoneIdx: number;
  milestoneTitle: string;
  allocationIdr: number;
  evidenceCid?: string;
}

export function MilestoneReadyEmail({
  recipientName,
  propertyName,
  milestoneIdx,
  milestoneTitle,
  allocationIdr,
  evidenceCid,
}: MilestoneReadyEmailProps) {
  const terminNumber = milestoneIdx + 1;
  const formattedAllocation = `Rp ${allocationIdr.toLocaleString("id-ID")}`;

  return (
    <BaseEmailLayout
      previewText={`Termin #${terminNumber} (${milestoneTitle}) siap untuk otorisasi`}
      heading={`Milestone #${terminNumber} Siap untuk Disetujui`}
    >
      <p style={{ marginTop: 0 }}>
        Halo <strong>{recipientName}</strong>,
      </p>
      <p>
        Kontraktor telah menyelesaikan pekerjaan fisik untuk{" "}
        <strong>Termin #{terminNumber} — {milestoneTitle}</strong> pada proyek{" "}
        <strong>{propertyName}</strong>. Dokumen inspeksi fisik telah diunggah dan siap untuk diverifikasi melalui konsensus MultiSig 2-of-3.
      </p>

      {/* Milestone Details Box */}
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "16px 20px",
          margin: "20px 0",
          fontSize: "13px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Tahapan Renovasi:</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#0f172a", textAlign: "right" }}>
              Termin #{terminNumber} ({milestoneTitle})
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Nilai Pencairan Escrow:</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#059669", textAlign: "right" }}>
              {formattedAllocation}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Aturan Konsensus:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#4f46e5", textAlign: "right" }}>
              Minimal 2 dari 3 Pihak (Inspektur, Landlord, Tenant)
            </td>
          </tr>
          {evidenceCid && (
            <tr>
              <td style={{ padding: "6px 0", color: "#64748b" }}>Bukti IPFS CID:</td>
              <td style={{ padding: "6px 0", fontFamily: "monospace", fontSize: "11px", color: "#6366f1", textAlign: "right" }}>
                <a
                  href={`https://ipfs.io/ipfs/${evidenceCid}`}
                  style={{ color: "#4f46e5", textDecoration: "underline" }}
                >
                  {evidenceCid.slice(0, 14)}...{evidenceCid.slice(-6)} ↗
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ fontSize: "13px", color: "#475569" }}>
        Dana termin kontraktor hanya akan dicairkan dari vault apabila minimal 2 pihak yang berwenang telah memberikan tanda tangan digital on-chain.
      </p>

      <div style={{ textAlign: "center", margin: "28px 0 10px 0" }}>
        <a
          href="https://euthial.id/inspector"
          style={{
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "13px",
            display: "inline-block",
          }}
        >
          Buka Konsol Otorisasi MultiSig →
        </a>
      </div>
    </BaseEmailLayout>
  );
}
