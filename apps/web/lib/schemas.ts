import { z } from "zod";

// Ethereum address validation
export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format");

// Auth schemas
export const authNonceQuerySchema = z.object({
  address: ethereumAddressSchema.optional(),
});

export const authVerifyBodySchema = z.object({
  message: z.string().min(1, "Message is required"),
  signature: z.string().min(1, "Signature is required"),
});

export const registerBodySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["INVESTOR", "LANDLORD", "TENANT", "CONTRACTOR", "INSPECTOR", "ARBITER", "ADMIN"]),
  walletAddress: ethereumAddressSchema.optional(),
});

// Admin deal creation schema
export const createDealBodySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  location: z.string().min(3, "Location is required"),
  budget: z.number().positive("Budget must be greater than zero"),
  seniorPrincipal: z.number().positive("Senior principal must be positive"),
  juniorPrincipal: z.number().positive("Junior principal must be positive"),
  seniorMultipleBps: z.number().int().min(10000).max(30000), // 1.0x to 3.0x
  juniorMultipleBps: z.number().int().min(10000).max(30000),
  landlordAddress: ethereumAddressSchema,
  tenantAddress: ethereumAddressSchema,
  contractorAddress: ethereumAddressSchema,
  inspectorAddress: ethereumAddressSchema,
  minDurationDays: z.number().int().positive().default(540),
  maxDurationDays: z.number().int().positive().default(720),
});

// Whitelist management schema
export const updateWhitelistBodySchema = z.object({
  address: ethereumAddressSchema,
  allowed: z.boolean(),
  role: z.enum(["INVESTOR", "LANDLORD", "TENANT", "INSPECTOR", "CONTRACTOR"]).optional(),
});

// Contract event webhook schema
export const contractEventWebhookSchema = z.object({
  event: z.enum([
    "DEPOSIT_CONFIRMED",
    "MILESTONE_READY",
    "COVENANT_WARNING",
    "BOND_DRAWDOWN",
    "STEP_IN_TRIGGERED",
  ]),
  payload: z.record(z.string(), z.any()),
});

// IPFS upload schema
export const ipfsUploadMetaSchema = z.object({
  milestoneIndex: z.coerce.number().int().min(0).max(2).optional(),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});
