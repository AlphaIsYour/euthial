import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany();
    return NextResponse.json({ deals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch deals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body;

    if (!propertyName || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
