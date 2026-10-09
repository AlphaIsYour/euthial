import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limiter cache
const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  limit: number;      // Maximum requests allowed in the window
  windowMs: number;   // Time window in milliseconds (e.g. 60_000 for 1 minute)
}

export const RATE_LIMIT_PROFILES = {
  PUBLIC: { limit: 100, windowMs: 60_000 },   // 100 req/min for public APIs
  AUTH: { limit: 10, windowMs: 60_000 },       // 10 req/min for auth endpoints
  WEBHOOK: { limit: 60, windowMs: 60_000 },    // 60 req/min for webhooks
} as const;

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a client IP and scope
 */
export function checkRateLimit(
  req: NextRequest,
  profile: RateLimitConfig = RATE_LIMIT_PROFILES.PUBLIC,
  prefix: string = "global"
): RateLimitResult {
  // Extract IP or client identifier
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + profile.windowMs,
    });

    return {
      success: true,
      limit: profile.limit,
      remaining: profile.limit - 1,
      reset: Math.ceil((now + profile.windowMs) / 1000),
    };
  }

  if (record.count >= profile.limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit: profile.limit,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  // Increment counter
  record.count += 1;
  return {
    success: true,
    limit: profile.limit,
    remaining: profile.limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}

/**
 * Helper to generate 429 Too Many Requests response with standard headers
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      limit: result.limit,
      retryAfter: Math.max(0, result.reset - Math.ceil(Date.now() / 1000)),
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": result.reset.toString(),
        "Retry-After": Math.max(1, result.reset - Math.ceil(Date.now() / 1000)).toString(),
      },
    }
  );
}
