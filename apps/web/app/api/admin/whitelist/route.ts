import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const list = await prisma.whitelist.findMany();
    return NextResponse.json({ whitelist: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch whitelist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, name, role } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    const existing = await prisma.whitelist.findUnique({
      where: { address: address.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: "Address already in whitelist" }, { status: 400 });
    }

    const entry = await prisma.whitelist.create({
      data: {
        address: address.toLowerCase(),
        name: name || `Investor ${address.slice(0, 6)}...`,
        role: role || "INVESTOR",
        status: "APPROVED",
        addedBy: "Admin",
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add whitelist entry" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.whitelist.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, entry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update whitelist status" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.whitelist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete whitelist entry" }, { status: 500 });
  }
}
