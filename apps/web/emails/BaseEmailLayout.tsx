import React from "react";

export interface BaseEmailLayoutProps {
  previewText: string;
  heading: string;
  children: React.ReactNode;
}

export function BaseEmailLayout({ previewText, heading, children }: BaseEmailLayoutProps) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: "40px 20px",
        color: "#0f172a",
      }}
    >
      {/* Hidden Preview Text for Email Clients */}
      <div style={{ display: "none", maxHeight: 0, overflow: "hidden", opacity: 0 }}>
        {previewText}
      </div>

      <table
        align="center"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{
          maxWidth: "580px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <tbody>
          <tr>
            <td
              style={{
                padding: "28px 32px",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "#ffffff",
              }}
            >
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "28px",
                            height: "28px",
                            backgroundColor: "#059669",
                            color: "#ffffff",
                            borderRadius: "6px",
                            textAlign: "center",
                            lineHeight: "28px",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          E
                        </span>
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#0f172a",
                            letterSpacing: "-0.3px",
                          }}
                        >
                          Euthial Protocol
                        </span>
                      </div>
                    </td>
                    <td align="right">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#059669",
                          backgroundColor: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Verifiable RBF
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Heading */}
          <tr>
            <td style={{ padding: "32px 32px 16px 32px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f172a",
                  lineHeight: "1.3",
                  letterSpacing: "-0.4px",
                }}
              >
                {heading}
              </h1>
            </td>
          </tr>

          {/* Main Body */}
          <tr>
            <td style={{ padding: "0 32px 32px 32px", fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
              {children}
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td
              style={{
                backgroundColor: "#f8fafc",
                padding: "24px 32px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "11px",
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              <table width="100%" border={0} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td>
                      <p style={{ margin: "0 0 6px 0", fontWeight: "600", color: "#475569" }}>
                        Euthial Protocol Foundation — Jakarta, Indonesia
                      </p>
                      <p style={{ margin: "0 0 8px 0" }}>
                        Smart Contract Verified on Ethereum Sepolia • Dual-Tranche ERC-4626 & EIP-712 Settlement
                      </p>
                      <p style={{ margin: 0 }}>
                        <a
                          href="https://euthial.id/unsubscribe"
                          style={{ color: "#64748b", textDecoration: "underline" }}
                        >
                          Unsubscribe
                        </a>{" "}
                        •{" "}
                        <a
                          href="https://euthial.id/privacy"
                          style={{ color: "#64748b", textDecoration: "underline" }}
                        >
                          Privacy Policy
                        </a>{" "}
                        •{" "}
                        <a
                          href="https://euthial.id/audit"
                          style={{ color: "#64748b", textDecoration: "underline" }}
                        >
                          Security Audit Log
                        </a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
