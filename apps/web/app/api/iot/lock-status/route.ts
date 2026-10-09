import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitExceededResponse, RATE_LIMIT_PROFILES } from "@/lib/rate-limit";

// In-memory state for physical lock in web app
let lockState: "OPERATING" | "LOCKED" | "OVERRIDDEN" = "OPERATING";
let lastReason = "Normal operations";
let lastUpdated = new Date().toISOString();

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.PUBLIC, "iot-status");
  if (!rateLimit.success) return rateLimitExceededResponse(rateLimit);

  return NextResponse.json({
    deviceId: "LOCK-RUKO-001",
    propertyName: "Ruko Kemang Grand Square No. 12",
    state: lockState,
    isLocked: lockState === "LOCKED",
    batteryLevel: "94%",
    lastReason,
    lastUpdated,
  });
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.AUTH, "iot-toggle");
  if (!rateLimit.success) return rateLimitExceededResponse(rateLimit);

  try {
    const body = await request.json();
    const { action, reason } = body;

    if (action === "LOCK") {
      lockState = "LOCKED";
      lastReason = reason || "Step-In enforcement triggered";
      lastUpdated = new Date().toISOString();
    } else if (action === "UNLOCK") {
      lockState = "OPERATING";
      lastReason = reason || "Restored by Arbiter / Landlord";
      lastUpdated = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      state: lockState,
      isLocked: lockState === "LOCKED",
      lastReason,
      lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
