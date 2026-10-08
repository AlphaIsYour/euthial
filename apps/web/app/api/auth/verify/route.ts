import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const storedNonce = req.cookies.get("siwe_nonce")?.value;
    if (!storedNonce) {
      return NextResponse.json(
        { ok: false, error: "Nonce expired or not found" },
        { status: 400 }
      );
    }

    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: storedNonce,
    });

    // Create verified session response
    const response = NextResponse.json({
      ok: true,
      address: fields.address,
      chainId: fields.chainId,
    });

    response.cookies.set("siwe_session", fields.address, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 days
    });

    // Invalidate nonce after single use to prevent replay attacks
    response.cookies.delete("siwe_nonce");

    return response;
  } catch (error: any) {
    console.error("SIWE verification error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Invalid signature" },
      { status: 400 }
    );
  }
}
