import { NextResponse } from "next/server";
import { generateNonce } from "siwe";

export const dynamic = "force-dynamic";

export async function GET() {
  const nonce = generateNonce();
  const response = NextResponse.json({ nonce });
  response.cookies.set("siwe_nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300, // 5 minutes
  });
  return response;
}
