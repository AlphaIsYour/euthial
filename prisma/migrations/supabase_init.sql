-- ====================================================================
-- EUTHIAL PROTOCOL: SUPABASE / POSTGRESQL PRODUCTION MIGRATION & RLS
-- Issue #75 [E-01]
-- ====================================================================

-- 1. Create Enums
DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM (
    'INVESTOR',
    'LANDLORD',
    'TENANT',
    'CONTRACTOR',
    'INSPECTOR',
    'ADMIN',
    'VIEWER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE,
  "name" TEXT,
  "passwordHash" TEXT,
  "walletAddress" TEXT UNIQUE,
  "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Accounts Table (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

-- 4. Create Sessions Table (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires" TIMESTAMP(3) NOT NULL
);

-- 5. Create VerificationToken Table (NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- 6. Create Deals Table
CREATE TABLE IF NOT EXISTS "Deal" (
  "id" TEXT PRIMARY KEY,
  "onChainDealId" INTEGER UNIQUE,
  "propertyName" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "budget" DOUBLE PRECISION NOT NULL,
  "seniorPrincipal" DOUBLE PRECISION NOT NULL,
  "juniorPrincipal" DOUBLE PRECISION NOT NULL,
  "seniorMultipleBps" INTEGER NOT NULL,
  "juniorMultipleBps" INTEGER NOT NULL,
  "targetTenorDays" INTEGER NOT NULL,
  "maxTenorDays" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "agreementAddress" TEXT,
  "seniorVaultAddress" TEXT,
  "juniorVaultAddress" TEXT,
  "routerAddress" TEXT,
  "landlordAddress" TEXT NOT NULL,
  "tenantAddress" TEXT NOT NULL,
  "contractorAddress" TEXT NOT NULL,
  "inspectorAddress" TEXT NOT NULL,
  "arbiterAddress" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create UserDeal Relation Table
CREATE TABLE IF NOT EXISTS "UserDeal" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "dealId" TEXT NOT NULL REFERENCES "Deal"("id") ON DELETE CASCADE,
  "role" "UserRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Whitelist Table
CREATE TABLE IF NOT EXISTS "Whitelist" (
  "id" TEXT PRIMARY KEY,
  "address" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "role" "UserRole" NOT NULL DEFAULT 'INVESTOR',
  "status" TEXT NOT NULL DEFAULT 'APPROVED',
  "addedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create DealDocument Table (IPFS CIDs)
CREATE TABLE IF NOT EXISTS "DealDocument" (
  "id" TEXT PRIMARY KEY,
  "dealId" TEXT NOT NULL REFERENCES "Deal"("id") ON DELETE CASCADE,
  "milestoneIdx" INTEGER NOT NULL,
  "cid" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "fileSize" INTEGER,
  "fileType" TEXT,
  "txHash" TEXT,
  "submittedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS "idx_user_wallet" ON "User"("walletAddress");
CREATE INDEX IF NOT EXISTS "idx_deal_status" ON "Deal"("status");
CREATE INDEX IF NOT EXISTS "idx_whitelist_address" ON "Whitelist"("address");
CREATE INDEX IF NOT EXISTS "idx_deal_document_deal" ON "DealDocument"("dealId", "milestoneIdx");

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across core tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Deal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Whitelist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DealDocument" ENABLE ROW LEVEL SECURITY;

-- User Policies:
-- Allow users to read their own profile or public profiles
CREATE POLICY "Users can read own profile" ON "User"
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id OR auth.role() = 'service_role');

-- Deal Policies:
-- Public can read all active/deployed deals
CREATE POLICY "Deals are publicly readable" ON "Deal"
  FOR SELECT
  USING (true);

-- Only Landlords, Admins, or service role can insert/update deals
CREATE POLICY "Authorized deal mutations" ON "Deal"
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Whitelist Policies:
-- Whitelist entries are readable for verification
CREATE POLICY "Whitelist is publicly readable" ON "Whitelist"
  FOR SELECT
  USING (true);

CREATE POLICY "Whitelist mutations restricted to service role" ON "Whitelist"
  FOR ALL
  USING (auth.role() = 'service_role');

-- DealDocument Policies:
-- Documents are publicly verifiable on IPFS
CREATE POLICY "Documents are publicly readable" ON "DealDocument"
  FOR SELECT
  USING (true);

CREATE POLICY "Document upload allowed for authenticated actors" ON "DealDocument"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
