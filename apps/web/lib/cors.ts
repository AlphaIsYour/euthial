import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.NEXTAUTH_URL || "",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
].filter(Boolean);

export function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const isAllowed = ALLOWED_ORIGINS.some((allowed) => allowed === origin || allowed === "*");

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0] || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}

export function handleOptions(req: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}
