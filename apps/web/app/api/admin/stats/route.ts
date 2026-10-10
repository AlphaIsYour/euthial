import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const deals = await prisma.deal.findMany();
    const whitelists = await prisma.whitelist.findMany();

    const roleCounts = users.reduce((acc: Record<string, number>, u: any) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalUsers: users.length,
      totalDeals: deals.length,
      activeDeals: deals.filter((d: any) => d.status === "OPERATING" || d.status === "BUILDING").length,
      totalWhitelisted: whitelists.filter((w: any) => w.status === "APPROVED").length,
      roleCounts,
      recentUsers: users.slice(-5).reverse(),
      recentDeals: deals.slice(-5).reverse(),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
