import React from "react";
import { BaseEmailLayout } from "./BaseEmailLayout";

export interface CovenantWarningEmailProps {
  tenantName: string;
  propertyName: string;
  monthTested: number;
  floorTargetIdr: number;
  actualPaidIdr: number;
  shortfallIdr: number;
  cureDays: number;
}

export function CovenantWarningEmail({
  tenantName,
  propertyName,
  monthTested,
  floorTargetIdr,
  actualPaidIdr,
  shortfallIdr,
  cureDays,
}: CovenantWarningEmailProps) {
  return (
    <BaseEmailLayout
      previewText={`⚠️ Peringatan Covenant Bulan ke-${monthTested}: Selisih Rp ${shortfallIdr.toLocaleString("id-ID")}`}
      heading="Peringatan: Pendapatan di Bawah Target Floor"
    >
      <p style={{ marginTop: 0 }}>
        Halo <strong>{tenantName}</strong>,
      </p>
      <p>
        Berdasarkan hasil evaluasi otomatis smart contract pada penutupan{" "}
        <strong>Bulan Operasional ke-{monthTested}</strong> untuk properti{" "}
        <strong>{propertyName}</strong>, akumulasi setoran pendapatan tercatat berada di bawah batas minimum (*Covenant Floor*).
      </p>

      {/* Warning Box */}
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "8px",
          padding: "16px 20px",
          margin: "20px 0",
          fontSize: "13px",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "6px 0", color: "#92400e" }}>Target Minimum (Floor):</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#78350f", textAlign: "right" }}>
              Rp {floorTargetIdr.toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#92400e" }}>Setoran Terbayar:</td>
            <td style={{ padding: "6px 0", fontWeight: "600", color: "#78350f", textAlign: "right" }}>
              Rp {actualPaidIdr.toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#92400e" }}>Kekurangan (Shortfall):</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#b45309", textAlign: "right" }}>
              Rp {shortfallIdr.toLocaleString("id-ID")}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "6px 0", color: "#92400e" }}>Masa Remedial (Cure Period):</td>
            <td style={{ padding: "6px 0", fontWeight: "700", color: "#b45309", textAlign: "right" }}>
              {cureDays} Hari Kalender
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: "13px", color: "#475569" }}>
        <strong>Tindakan yang Diperlukan:</strong> Silakan melakukan pembayaran kekurangan (*pay shortfall*) atau menambah omzet sebelum batas waktu remedial berakhir. Jika masa penyembuhan terlewati, protokol akan secara otomatis menarik dana jaminan (*Performance Bond*) untuk melindungi investor.
      </p>

      <div style={{ textAlign: "center", margin: "28px 0 10px 0" }}>
        <a
          href="https://euthial.id/tenant"
          style={{
            backgroundColor: "#d97706",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "13px",
            display: "inline-block",
          }}
        >
          Selesaikan Shortfall di Portal Tenant →
        </a>
      </div>
    </BaseEmailLayout>
  );
}
