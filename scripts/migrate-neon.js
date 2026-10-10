/**
 * scripts/migrate-neon.js
 * Direct migration and seeding script for NeonDB PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ONeI1mqg4ibl@ep-ancient-shadow-b30i7dhz-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

  console.log('🔌 Connecting to NeonDB...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✅ Connected to NeonDB successfully!');

  // 1. Read SQL migration file
  const sqlPath = path.join(__dirname, '..', 'prisma', 'migrations', 'supabase_init.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Strip Supabase-specific auth.uid() / auth.role() RLS policies for pure PostgreSQL
  const rlsMarker = '-- ROW LEVEL SECURITY (RLS) POLICIES';
  const tableDdl = sql.includes(rlsMarker) ? sql.split(rlsMarker)[0] : sql;

  console.log('⚡ Applying database schema (tables, enums, indexes)...');
  await client.query(tableDdl);
  console.log('✅ Schema migration applied successfully!');

  // 2. Seed Default Users & Roles
  console.log('🌱 Seeding initial records...');
  await client.query(`DELETE FROM "UserDeal"; DELETE FROM "User";`);

  // Admin
  await client.query(`
    INSERT INTO "User" ("id", "email", "name", "passwordHash", "walletAddress", "role", "createdAt", "updatedAt")
    VALUES (
      'usr_demo_admin',
      'admin@euthial.finance',
      'Euthial Protocol Admin',
      '$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu',
      '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      'ADMIN',
      NOW(),
      NOW()
    );
  `);

  // Demo Landlord (Budi)
  await client.query(`
    INSERT INTO "User" ("id", "email", "name", "passwordHash", "walletAddress", "role", "createdAt", "updatedAt")
    VALUES (
      'usr_budi_landlord',
      'budi@landlord.id',
      'Budi Santoso (Landlord)',
      '$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu',
      '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      'LANDLORD',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "email" = EXCLUDED."email";
  `);

  // Demo Investor
  await client.query(`
    INSERT INTO "User" ("id", "email", "name", "passwordHash", "walletAddress", "role", "createdAt", "updatedAt")
    VALUES (
      'usr_demo_yieldfund',
      'investor@yieldfund.id',
      'Yield Fund Investor',
      '$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu',
      '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      'INVESTOR',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "email" = EXCLUDED."email";
  `);

  // Demo Tenant (Kopi Kenangan)
  await client.query(`
    INSERT INTO "User" ("id", "email", "name", "passwordHash", "walletAddress", "role", "createdAt", "updatedAt")
    VALUES (
      'usr_demo_kopi',
      'kopi@kenangan-ruko.id',
      'Kopi Kenangan (Tenant)',
      '$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu',
      '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      'TENANT',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "email" = EXCLUDED."email";
  `);

  // Demo Contractor
  await client.query(`
    INSERT INTO "User" ("id", "email", "name", "passwordHash", "walletAddress", "role", "createdAt", "updatedAt")
    VALUES (
      'usr_demo_mandor',
      'mandor@kontraktor.id',
      'PT Reka Cipta (Kontraktor)',
      '$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu',
      '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      'CONTRACTOR',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", "email" = EXCLUDED."email";
  `);

  // Whitelist Landlord
  await client.query(`
    INSERT INTO "Whitelist" ("id", "address", "name", "role", "status", "addedBy", "createdAt", "updatedAt")
    VALUES (
      'wl_landlord_01',
      '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      'PT Kemang Propertindo',
      'LANDLORD',
      'APPROVED',
      'usr_demo_admin',
      NOW(),
      NOW()
    )
    ON CONFLICT ("address") DO NOTHING;
  `);

  // Whitelist Investor
  await client.query(`
    INSERT INTO "Whitelist" ("id", "address", "name", "role", "status", "addedBy", "createdAt", "updatedAt")
    VALUES (
      'wl_investor_01',
      '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      'Alpha Institutional Fund',
      'INVESTOR',
      'APPROVED',
      'usr_demo_admin',
      NOW(),
      NOW()
    )
    ON CONFLICT ("address") DO NOTHING;
  `);

  // Showcase Deal
  await client.query(`
    INSERT INTO "Deal" (
      "id", "onChainDealId", "propertyName", "location", "budget", 
      "seniorPrincipal", "juniorPrincipal", "seniorMultipleBps", "juniorMultipleBps", 
      "targetTenorDays", "maxTenorDays", "status", 
      "landlordAddress", "tenantAddress", "contractorAddress", "inspectorAddress", "arbiterAddress", 
      "createdAt", "updatedAt"
    )
    VALUES (
      'deal_kemang_01',
      1,
      'Ruko Kemang Grand Square',
      'Jl. Kemang Raya No. 45, Jakarta Selatan',
      150000000,
      120000000,
      30000000,
      12500,
      14000,
      540,
      720,
      'ACTIVE',
      '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
      '0x976ea74026e72cd5554282bf94fe574d3770310e',
      NOW(),
      NOW()
    )
    ON CONFLICT ("id") DO NOTHING;
  `);

  // 3. Verify Tables
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('📋 Existing tables in NeonDB:');
  res.rows.forEach(r => console.log(`   - ${r.table_name}`));

  const userCount = await client.query('SELECT count(*) FROM "User"');
  console.log(`✨ Total Users in NeonDB: ${userCount.rows[0].count}`);

  await client.end();
  console.log('🎉 NeonDB migration and seed completed successfully!');
}

run().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
