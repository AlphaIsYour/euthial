import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, walletAddress } = body;

    if (!name || (!email && !walletAddress)) {
      return NextResponse.json(
        { ok: false, error: "Nama dan Email atau Wallet wajib diisi." },
        { status: 400 }
      );
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existing) {
        return NextResponse.json(
          { ok: false, error: "Email sudah terdaftar. Silakan login." },
          { status: 400 }
        );
      }
    }

    if (walletAddress) {
      const normalizedWallet = walletAddress.toLowerCase();
      const existingWallet = await prisma.user.findUnique({
        where: { walletAddress: normalizedWallet },
      });
      if (existingWallet) {
        return NextResponse.json(
          { ok: false, error: "Alamat wallet sudah terdaftar." },
          { status: 400 }
        );
      }
    }

    let passwordHash: string | null = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: email ? email.toLowerCase().trim() : null,
        passwordHash,
        walletAddress: walletAddress ? walletAddress.toLowerCase() : null,
        role: role || "INVESTOR",
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Gagal memproses registrasi akun." },
      { status: 500 }
    );
  }
}
