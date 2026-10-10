import { NextRequest, NextResponse } from "next/server";
import { defaultIndexerStore, EuthialIndexerClient, type IndexedSettlement } from "@euthial/indexer";
import { checkRateLimit, RATE_LIMIT_PROFILES, rateLimitExceededResponse } from "@/lib/rate-limit";
import { getCorsHeaders, handleOptions } from "@/lib/cors";

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  // 1. Rate Limiting Check
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.PUBLIC, "indexer_settlements");
  if (!rateLimit.success) {
    return rateLimitExceededResponse(rateLimit);
  }

  const cors = getCorsHeaders(request);

  try {
    const { searchParams } = new URL(request.url);
    const dealIdParam = searchParams.get("dealId");
    const dealId = dealIdParam ? parseInt(dealIdParam, 10) : undefined;

    const client = new EuthialIndexerClient(defaultIndexerStore);
    const result = client.getSettlementsLast6Months(dealId);
    const syncStatus = client.getSyncStatus();

    return NextResponse.json(
      {
        success: true,
        data: {
          settlements: result.settlements.map((s: IndexedSettlement) => ({
            ...s,
            grossRecorded: s.grossRecorded.toString(),
            landlordAmt: s.landlordAmt.toString(),
            toSenior: s.toSenior.toString(),
            toJunior: s.toJunior.toString(),
            tenantRetain: s.tenantRetain.toString(),
          })),
          summary: {
            totalGrossIdr: result.totalGrossIdr.toString(),
            totalSeniorPaidIdr: result.totalSeniorPaidIdr.toString(),
            totalJuniorPaidIdr: result.totalJuniorPaidIdr.toString(),
            totalLandlordExcessIdr: result.totalLandlordExcessIdr.toString(),
            count: result.count,
            timeRange: result.timeRange,
          },
          syncStatus,
        },
      },
      { headers: cors }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to query indexed settlements" },
      { status: 500, headers: cors }
    );
  }
}
