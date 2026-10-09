/**
 * prisma/seed.ts
 * Production & Staging Seeding for Euthial Protocol
 */

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Euthial Protocol database...');

  // 1. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@euthial.finance' },
    update: {},
    create: {
      email: 'admin@euthial.finance',
      name: 'Euthial Protocol Admin',
      walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      role: UserRole.ADMIN,
    },
  });
  console.log(`👤 Admin seeded: ${admin.email}`);

  // 2. Seed Demo Landlord & Tenant
  const landlord = await prisma.user.upsert({
    where: { walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
    update: {},
    create: {
      email: 'landlord@kemang.id',
      name: 'PT Kemang Propertindo',
      walletAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      role: UserRole.LANDLORD,
    },
  });

  const tenant = await prisma.user.upsert({
    where: { walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
    update: {},
    create: {
      email: 'tenant@kopi-nusantara.id',
      name: 'Kopi Nusantara F&B',
      walletAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      role: UserRole.TENANT,
    },
  });

  // 3. Seed Whitelist
  await prisma.whitelist.upsert({
    where: { address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
    update: {},
    create: {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      name: 'PT Kemang Propertindo',
      role: UserRole.LANDLORD,
      status: 'APPROVED',
      addedBy: admin.id,
    },
  });

  await prisma.whitelist.upsert({
    where: { address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
    update: {},
    create: {
      address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      name: 'Alpha Institutional Fund',
      role: UserRole.INVESTOR,
      status: 'APPROVED',
      addedBy: admin.id,
    },
  });

  // 4. Seed Showcase Deal
  const demoDeal = await prisma.deal.upsert({
    where: { onChainDealId: 1 },
    update: {},
    create: {
      onChainDealId: 1,
      propertyName: 'Ruko Kemang Grand Square',
      location: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
      budget: 150_000_000,
      seniorPrincipal: 120_000_000,
      juniorPrincipal: 30_000_000,
      seniorMultipleBps: 12500, // 1.25x
      juniorMultipleBps: 14000, // 1.40x
      targetTenorDays: 540,
      maxTenorDays: 720,
      status: 'ACTIVE',
      landlordAddress: landlord.walletAddress!,
      tenantAddress: tenant.walletAddress!,
      contractorAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      inspectorAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
      arbiterAddress: '0x976EA74026E72CD5554282bf94FE574D3770310e',
    },
  });
  console.log(`🏢 Showcase deal seeded: ${demoDeal.propertyName} (ID: ${demoDeal.id})`);

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
