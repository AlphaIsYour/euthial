import React from "react";
import { BaseEmailLayout } from "./BaseEmailLayout";

export interface DepositConfirmedEmailProps {
  investorName: string;
  propertyName: string;
  amountIdr: number;
  tranche: "SENIOR" | "JUNIOR";
  sharesIssued: string;
  txHash: string;
}

export function DepositConfirmedEmail({
  investorName,
  propertyName,
  amountIdr,
  tranche,
  sharesIssued,
  txHash,
}: DepositConfirmedEmailProps) {
  const formattedAmount = `Rp ${amountIdr.toLocaleString("id-ID")}`;
  const targetMultiple = tranche === "SENIOR" ? "1.25x (Senior Priority)" : "1.40x (Junior Equity)";

  return (
    <BaseEmailLayout
      previewText={`Konfirmasi Setoran Modal: ${formattedAmount} ke ${propertyName}`}
      heading="Dana Anda Telah Diterima di Vault"
    >
      <p style={{ marginTop: 0 }}>
        Halo <strong>{investorName}</strong>,
      </p>
      <p>
        Setoran modal Anda untuk pembiayaan renovasi komersial pada properti{" "}
        <strong>{propertyName}</strong> telah berhasil dikonfirmasi dan dicatat secara on-chain di
        smart contract ERC-4626 Vault Euthial.
      </p>

      {/* Transaction Details Box */}
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
            <td style={{ padding: "6px 0", color: "#64748b" }}>Jumlah Setoran:</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#0f172a", textAlign: "right" }}>
              {formattedAmount}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Tranche:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#059669", textAlign: "right" }}>
              {tranche} TRANCHE
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Target Imbal Hasil:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#0f172a", textAlign: "right" }}>
              {targetMultiple}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Share Vault Diterbitkan:</td>
            <td style={{ padding: "6px 0", fontFamily: "monospace", color: "#0f172a", textAlign: "right" }}>
              {sharesIssued}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#64748b" }}>Transaction Hash:</td>
            <td style={{ padding: "6px 0", fontFamily: "monospace", fontSize: "11px", color: "#6366f1", textAlign: "right" }}>
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: "13px", color: "#475569" }}>
        Arus kas harian dari QRIS tenant akan otomatis dibagikan melalui Waterfall Router saat properti mulai beroperasi. Anda dapat memantau saldo dan riwayat repayment kapan saja di portal investor.
      </p>

      <div style={{ textAlign: "center", margin: "28px 0 10px 0" }}>
        <a
          href="https://euthial.id/investor"
          style={{
            backgroundColor: "#059669",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "13px",
            display: "inline-block",
          }}
        >
          Lihat Portofolio di Investor Portal →
        </a>
      </div>
    </BaseEmailLayout>
  );
}
