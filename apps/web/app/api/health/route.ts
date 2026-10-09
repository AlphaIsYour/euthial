import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unknown";
  let dbLatencyMs = 0;

  // 1. Database Health Check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "healthy";
  } catch (error: any) {
    dbStatus = `degraded: ${error?.message || "connection error"}`;
  }

  // 2. Chain RPC Connectivity Check
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  let rpcStatus = "unknown";
  let rpcLatencyMs = 0;

  try {
    const rpcStart = Date.now();
    const rpcRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
      signal: AbortSignal.timeout(3000),
    });
    rpcLatencyMs = Date.now() - rpcStart;
    rpcStatus = rpcRes.ok ? "healthy" : `http_${rpcRes.status}`;
  } catch (err: any) {
    rpcStatus = `unreachable: ${err?.message || "timeout"}`;
  }

  const isOverallHealthy = dbStatus === "healthy" && (rpcStatus === "healthy" || rpcLatencyMs > 0);

  return NextResponse.json(
    {
      status: isOverallHealthy ? "healthy" : "degraded",
      environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: process.env.DATABASE_URL?.includes("postgres") ? "postgresql/supabase" : "sqlite",
        },
        chainRpc: {
          status: rpcStatus,
          endpoint: rpcUrl,
          latencyMs: rpcLatencyMs,
        },
      },
    },
    { status: isOverallHealthy ? 200 : 503 }
  );
}
