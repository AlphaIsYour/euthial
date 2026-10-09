import { renderToStaticMarkup } from "react-dom/server.edge";
import React from "react";
import { DepositConfirmedEmail, type DepositConfirmedEmailProps } from "@/emails/DepositConfirmedEmail";
import { MilestoneReadyEmail, type MilestoneReadyEmailProps } from "@/emails/MilestoneReadyEmail";
import { CovenantWarningEmail, type CovenantWarningEmailProps } from "@/emails/CovenantWarningEmail";
import { BondDrawdownEmail, type BondDrawdownEmailProps } from "@/emails/BondDrawdownEmail";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  from?: string;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
  isMock: boolean;
  recipient: string;
  subject: string;
  timestamp: string;
}

// In-memory audit log for sent notification emails
export const sentEmailsLog: EmailSendResult[] = [];

/**
 * Dispatch an email via Resend REST API or fallback to mock sandbox
 */
export async function sendEmail({
  to,
  subject,
  react,
  html,
  from = "Euthial Protocol <notifications@euthial.id>",
}: SendEmailOptions): Promise<EmailSendResult> {
  const recipient = Array.isArray(to) ? to.join(", ") : to;
  const contentHtml = html || (react ? renderToStaticMarkup(react) : "");
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html: contentHtml,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const result: EmailSendResult = {
          success: true,
          id: data.id,
          isMock: false,
          recipient,
          subject,
          timestamp: new Date().toISOString(),
        };
        sentEmailsLog.push(result);
        return result;
      }
      const errText = await res.text();
      console.warn("Resend API failed, falling back to simulated dispatch:", errText);
    } catch (err: any) {
      console.warn("Resend fetch error, falling back to simulated dispatch:", err.message);
    }
  }

  // Simulated email dispatch (Sandbox mode for hackathon / development)
  const mockResult: EmailSendResult = {
    success: true,
    id: `msg_mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    isMock: true,
    recipient,
    subject,
    timestamp: new Date().toISOString(),
  };

  sentEmailsLog.push(mockResult);
  console.log(`[Email Sandbox] Dispatched "${subject}" to ${recipient}`);

  return mockResult;
}

/**
 * Convenience helper: Send Deposit Confirmed notification
 */
export async function sendDepositConfirmedEmail(to: string, props: DepositConfirmedEmailProps) {
  return sendEmail({
    to,
    subject: `Konfirmasi Setoran Modal: Rp ${props.amountIdr.toLocaleString("id-ID")} ke ${props.propertyName}`,
    react: React.createElement(DepositConfirmedEmail, props),
  });
}

/**
 * Convenience helper: Send Milestone Ready notification
 */
export async function sendMilestoneReadyEmail(to: string, props: MilestoneReadyEmailProps) {
  return sendEmail({
    to,
    subject: `Otorisasi Milestone #${props.milestoneIdx + 1} Siap: ${props.propertyName}`,
    react: React.createElement(MilestoneReadyEmail, props),
  });
}

/**
 * Convenience helper: Send Covenant Warning notification
 */
export async function sendCovenantWarningEmail(to: string, props: CovenantWarningEmailProps) {
  return sendEmail({
    to,
    subject: `⚠️ Peringatan Covenant: Pendapatan Bulan #${props.monthTested} di Bawah Floor`,
    react: React.createElement(CovenantWarningEmail, props),
  });
}

/**
 * Convenience helper: Send Bond Drawdown notification
 */
export async function sendBondDrawdownEmail(to: string, props: BondDrawdownEmailProps) {
  return sendEmail({
    to,
    subject: `🚨 Pemberitahuan Penarikan Jaminan (Performance Bond): ${props.propertyName}`,
    react: React.createElement(BondDrawdownEmail, props),
  });
}
