import { NextResponse } from "next/server";
import { uploadToIPFS } from "@/lib/ipfs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const dealId = (formData.get("dealId") as string) || "deal_demo_01";
    const milestoneIdx = Number(formData.get("milestoneIdx") ?? 0);
    const title = (formData.get("title") as string) || file?.name || "Milestone Inspection Evidence";
    const submittedBy = (formData.get("submittedBy") as string) || "Inspector";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ipfsResult = await uploadToIPFS(buffer, file.name, file.type || "application/octet-stream");

    // Persist document record
    const document = await prisma.dealDocument.create({
      data: {
        dealId,
        milestoneIdx,
        cid: ipfsResult.cid,
        title,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        submittedBy,
      },
    });

    return NextResponse.json({
      success: true,
      document,
      ipfs: ipfsResult,
    });
  } catch (error: any) {
    console.error("IPFS upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to IPFS" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("dealId");
  const milestoneIdx = searchParams.get("milestoneIdx");

  const where: any = {};
  if (dealId) where.dealId = dealId;
  if (milestoneIdx !== null && milestoneIdx !== undefined) {
    where.milestoneIdx = Number(milestoneIdx);
  }

  const documents = await prisma.dealDocument.findMany({ where });
  return NextResponse.json({ documents });
}
