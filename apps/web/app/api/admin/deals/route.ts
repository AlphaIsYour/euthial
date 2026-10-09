import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitExceededResponse, RATE_LIMIT_PROFILES } from "@/lib/rate-limit";
import { z } from "zod";

const createDealSchema = z.object({
  propertyName: z.string().min(3, "Property name must be at least 3 characters"),
  location: z.string().optional().default("Jakarta, Indonesia"),
  budget: z.coerce.number().positive("Budget must be positive"),
  seniorPrincipal: z.coerce.number().positive("Senior principal must be positive"),
  juniorPrincipal: z.coerce.number().positive("Junior principal must be positive"),
  seniorMultipleBps: z.coerce.number().int().min(10000).max(30000).optional().default(12000),
  juniorMultipleBps: z.coerce.number().int().min(10000).max(30000).optional().default(15000),
  targetTenorDays: z.coerce.number().int().positive().optional().default(540),
  maxTenorDays: z.coerce.number().int().positive().optional().default(720),
  landlordAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid landlord address"),
  tenantAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid tenant address"),
  contractorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contractor address"),
  inspectorAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid inspector address"),
  arbiterAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid arbiter address").optional(),
  onChainDealId: z.coerce.number().optional(),
  agreementAddress: z.string().optional(),
  seniorVaultAddress: z.string().optional(),
  juniorVaultAddress: z.string().optional(),
  routerAddress: z.string().optional(),
  status: z.string().optional().default("FUNDRAISING"),
});

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.PUBLIC, "admin-deals");
  if (!rateLimit.success) return rateLimitExceededResponse(rateLimit);

  try {
    const deals = await prisma.deal.findMany();
    return NextResponse.json({ deals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, RATE_LIMIT_PROFILES.AUTH, "admin-deals-post");
  if (!rateLimit.success) return rateLimitExceededResponse(rateLimit);

  try {
    const rawBody = await request.json();
    const parseResult = createDealSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }

    const {
      propertyName,
      location,
      budget,
      seniorPrincipal,
      juniorPrincipal,
      seniorMultipleBps,
      juniorMultipleBps,
      targetTenorDays,
      maxTenorDays,
      landlordAddress,
      tenantAddress,
      contractorAddress,
      inspectorAddress,
      arbiterAddress,
      onChainDealId,
      agreementAddress,
      seniorVaultAddress,
      juniorVaultAddress,
      routerAddress,
      status,
    } = parseResult.data;

    const newDeal = await prisma.deal.create({
      data: {
        propertyName,
        location: location || "Jakarta, Indonesia",
        budget: Number(budget),
        seniorPrincipal: Number(seniorPrincipal || (budget * 0.8)),
        juniorPrincipal: Number(juniorPrincipal || (budget * 0.2)),
        seniorMultipleBps: Number(seniorMultipleBps || 12500),
        juniorMultipleBps: Number(juniorMultipleBps || 14000),
        targetTenorDays: Number(targetTenorDays || 540),
        maxTenorDays: Number(maxTenorDays || 720),
        landlordAddress: landlordAddress || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        tenantAddress: tenantAddress || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        contractorAddress: contractorAddress || "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        inspectorAddress: inspectorAddress || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        arbiterAddress: arbiterAddress || "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        onChainDealId: onChainDealId !== undefined ? Number(onChainDealId) : null,
        agreementAddress: agreementAddress || null,
        seniorVaultAddress: seniorVaultAddress || null,
        juniorVaultAddress: juniorVaultAddress || null,
        routerAddress: routerAddress || null,
        status: status || "FUNDRAISING",
      },
    });

    return NextResponse.json({ success: true, deal: newDeal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create deal" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, agreementAddress, seniorVaultAddress, juniorVaultAddress, routerAddress } = body;

    if (!id) {
      return NextResponse.json({ error: "Deal ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (agreementAddress) updateData.agreementAddress = agreementAddress;
    if (seniorVaultAddress) updateData.seniorVaultAddress = seniorVaultAddress;
    if (juniorVaultAddress) updateData.juniorVaultAddress = juniorVaultAddress;
    if (routerAddress) updateData.routerAddress = routerAddress;

    const updated = await prisma.deal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, deal: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update deal" }, { status: 500 });
  }
}
