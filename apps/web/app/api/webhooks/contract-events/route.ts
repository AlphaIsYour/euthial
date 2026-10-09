import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitExceededResponse, RATE_LIMIT_PROFILES } from "@/lib/rate-limit";
import { z } from "zod";
import {
  sendDepositConfirmedEmail,
  sendMilestoneReadyEmail,
  sendCovenantWarningEmail,
  sendBondDrawdownEmail,
  sentEmailsLog,
} from "@/lib/email";

const webhookSchema = z.object({
  eventType: z.enum([
    "DEPOSIT_CONFIRMED",
    "MILESTONE_READY",
    "COVENANT_WARNING",
    "BOND_DRAWDOWN",
  ]),
  recipientEmail: z.string().email(),
  data: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.WEBHOOK, "webhook");
  if (!rateLimit.success) {
    return rateLimitExceededResponse(rateLimit);
  }

  try {
    const rawBody = await request.json();
    const parseResult = webhookSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parseResult.error.issues.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const { eventType, recipientEmail, data } = parseResult.data;

    let result;

    switch (eventType) {
      case "DEPOSIT_CONFIRMED":
        result = await sendDepositConfirmedEmail(recipientEmail, {
          investorName: data?.investorName || "Investor",
          propertyName: data?.propertyName || "Ruko Kemang Grand Square",
          amountIdr: Number(data?.amountIdr || 50_000_000),
          tranche: data?.tranche || "SENIOR",
          sharesIssued: data?.sharesIssued || "50,000,000.00 eSNR",
          txHash: data?.txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        });
        break;

      case "MILESTONE_READY":
        result = await sendMilestoneReadyEmail(recipientEmail, {
          recipientName: data?.recipientName || "Pengelola / Inspektur",
          propertyName: data?.propertyName || "Ruko Kemang Grand Square",
          milestoneIdx: Number(data?.milestoneIdx ?? 0),
          milestoneTitle: data?.milestoneTitle || "Pekerjaan Struktur Sipil & MEP",
          allocationIdr: Number(data?.allocationIdr || 45_000_000),
          evidenceCid: data?.evidenceCid || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        });
        break;

      case "COVENANT_WARNING":
        result = await sendCovenantWarningEmail(recipientEmail, {
          tenantName: data?.tenantName || "Tenant Pengelola",
          propertyName: data?.propertyName || "Ruko Kemang Grand Square",
          monthTested: Number(data?.monthTested || 3),
          floorTargetIdr: Number(data?.floorTargetIdr || 30_000_000),
          actualPaidIdr: Number(data?.actualPaidIdr || 22_500_000),
          shortfallIdr: Number(data?.shortfallIdr || 7_500_000),
          cureDays: Number(data?.cureDays || 7),
        });
        break;

      case "BOND_DRAWDOWN":
        result = await sendBondDrawdownEmail(recipientEmail, {
          tenantName: data?.tenantName || "Tenant Pengelola",
          propertyName: data?.propertyName || "Ruko Kemang Grand Square",
          amountDrawnIdr: Number(data?.amountDrawnIdr || 7_500_000),
          remainingBondIdr: Number(data?.remainingBondIdr || 7_500_000),
          reason: data?.reason || "Shortfall gagal diselesaikan setelah masa cure 7 hari",
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported eventType: ${eventType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Contract event webhook error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process contract event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    totalSent: sentEmailsLog.length,
    recentLogs: sentEmailsLog.slice(-20).reverse(),
  });
}
