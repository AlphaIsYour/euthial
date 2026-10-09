import React from "react";
import { BaseEmailLayout } from "./BaseEmailLayout";

export interface BondDrawdownEmailProps {
  tenantName: string;
  propertyName: string;
  amountDrawnIdr: number;
  remainingBondIdr: number;
  reason: string;
}

export function BondDrawdownEmail({
  tenantName,
  propertyName,
  amountDrawnIdr,
  remainingBondIdr,
  reason,
}: BondDrawdownEmailProps) {
  return (
    <BaseEmailLayout
      previewText={`🚨 Pemberitahuan Penarikan Bond: Rp ${amountDrawnIdr.toLocaleString("id-ID")}`}
      heading="Penarikan Dana Jaminan (Performance Bond)"
    >
      <p style={{ marginTop: 0 }}>
        Halo <strong>{tenantName}</strong>,
      </p>
      <p>
        Smart contract <strong>FitOutAgreement</strong> pada proyek <strong>{propertyName}</strong> telah mengeksekusi penarikan sebagian atau seluruh dana jaminan (*Performance Bond*) akibat wanprestasi atau kegagalan penyelesaian shortfall pada masa remedial.
      </p>

      {/* Alert Box */}
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "16px 20px",
          margin: "20px 0",
          fontSize: "13px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "6px 0", color: "#991b1b" }}>Jumlah Bond Ditarik:</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#991b1b", textAlign: "right" }}>
              Rp {amountDrawnIdr.toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#991b1b" }}>Sisa Saldo Bond:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#7f1d1d", textAlign: "right" }}>
              Rp {remainingBondIdr.toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#991b1b" }}>Alasan Penarikan:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#7f1d1d", textAlign: "right" }}>
              {reason}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: "13px", color: "#475569" }}>
        Dana yang ditarik telah disalurkan secara otomatis ke Waterfall Router untuk memenuhi kewajiban pembayaran amortisasi investor senior dan junior. Harap segera berkoordinasi dengan pengelola ruko atau arbiter jika terdapat sanggahan.
      </p>

      <div style={{ textAlign: "center", margin: "28px 0 10px 0" }}>
        <a
          href="https://euthial.id/tenant"
          style={{
            backgroundColor: "#dc2626",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "13px",
            display: "inline-block",
          }}
        >
          Periksa Status di Portal Tenant →
        </a>
      </div>
    </BaseEmailLayout>
  );
}
