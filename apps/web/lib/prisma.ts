import fs from "fs";
import path from "path";

// Local persistent DB file location
const DB_PATH = path.join(process.cwd(), "..", "..", "prisma", "dev_database.json");

interface LocalDb {
  users: any[];
  accounts: any[];
  sessions: any[];
  verificationTokens: any[];
  userDeals: any[];
  deals: any[];
  whitelists: any[];
  dealDocuments: any[];
}

function getLocalDb(): LocalDb {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(content);
      return {
        users: parsed.users || [],
        accounts: parsed.accounts || [],
        sessions: parsed.sessions || [],
        verificationTokens: parsed.verificationTokens || [],
        userDeals: parsed.userDeals || [],
        deals: parsed.deals || [],
        whitelists: parsed.whitelists || [],
        dealDocuments: parsed.dealDocuments || [],
      };
    }
  } catch (err) {
    console.warn("Could not read local DB, using fresh memory state:", err);
  }
  return {
    users: [
      {
        id: "usr_demo_admin",
        name: "Super Admin (Euthial Protocol)",
        email: "admin@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC", // password123
        walletAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        role: "ADMIN",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_landlord",
        name: "Hendra Wijaya (Landlord)",
        email: "landlord@euthial.id",
        passwordHash: "$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu",
        walletAddress: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        role: "LANDLORD",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_budi_landlord",
        name: "Budi Santoso (Landlord)",
        email: "budi@landlord.id",
        passwordHash: "$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu", // demo123
        walletAddress: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        role: "LANDLORD",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_investor",
        name: "Siti Rahma (Senior Investor)",
        email: "investor@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC",
        walletAddress: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
        role: "INVESTOR",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_yieldfund",
        name: "Yield Fund Investor",
        email: "investor@yieldfund.id",
        passwordHash: "$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu",
        walletAddress: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
        role: "INVESTOR",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_kopi",
        name: "Kopi Kenangan (Tenant)",
        email: "kopi@kenangan-ruko.id",
        passwordHash: "$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu",
        walletAddress: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        role: "TENANT",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_mandor",
        name: "PT Reka Cipta (Kontraktor)",
        email: "mandor@kontraktor.id",
        passwordHash: "$2b$10$OKGUd24Z53sPfZJ4.TzhkuED/Db.Kbp8Njq1imqfCybLIiBdJmdyu",
        walletAddress: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
        role: "CONTRACTOR",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_inspector",
        name: "Ir. Agus Salim (Inspektur Independen)",
        email: "inspector@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC",
        walletAddress: "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
        role: "INSPECTOR",
        createdAt: new Date().toISOString(),
      },
      {
        id: "usr_demo_contractor",
        name: "PT Reka Cipta Ruang (Kontraktor)",
        email: "contractor@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC",
        walletAddress: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
        role: "CONTRACTOR",
        createdAt: new Date().toISOString(),
      },
    ],
    accounts: [],
    sessions: [],
    verificationTokens: [],
    userDeals: [],
    deals: [
      {
        id: "deal_demo_01",
        onChainDealId: 0,
        propertyName: "Ruko Kemang Grand Square #4B",
        location: "Kemang Raya No. 42, Jakarta Selatan",
        budget: 150000000,
        seniorPrincipal: 120000000,
        juniorPrincipal: 30000000,
        seniorMultipleBps: 12500,
        juniorMultipleBps: 14000,
        targetTenorDays: 540,
        maxTenorDays: 720,
        status: "OPERATING",
        agreementAddress: "0x89D2E1643c59a35e00fB10283b7E42588147E840",
        seniorVaultAddress: "0x3F616b3f713e54b6C374b595b118b6348Eb01150",
        juniorVaultAddress: "0x288cf2B69B7c14a24A69A27F19656461FE187b50",
        routerAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        landlordAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        tenantAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        contractorAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        inspectorAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        arbiterAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    whitelists: [
      {
        id: "wl_01",
        address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
        name: "Siti Rahma (KYC Verified)",
        role: "INVESTOR",
        status: "APPROVED",
        addedBy: "Super Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "wl_02",
        address: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        name: "Hendra Wijaya (KYC Verified)",
        role: "LANDLORD",
        status: "APPROVED",
        addedBy: "Super Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    dealDocuments: [
      {
        id: "doc_01",
        dealId: "deal_demo_01",
        milestoneIdx: 0,
        cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        title: "Milestone 1 - Site Demolition & MEP Inspection Report",
        fileSize: 2450000,
        fileType: "application/pdf",
        txHash: "0x4a9b6c1284d72e90f23a45c78912e4f012b3456789abcdef0123456789abcdef",
        submittedBy: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

function saveLocalDb(data: LocalDb) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist local DB to file:", err);
  }
}

// Memory-backed adapter compatible with Prisma client API
function createPrismaMock(): any {
  return {
    user: {
      async findUnique({ where }: any) {
        const db = getLocalDb();
        if (where.id) return db.users.find((u) => u.id === where.id) || null;
        if (where.email) return db.users.find((u) => u.email?.toLowerCase() === where.email.toLowerCase()) || null;
        if (where.walletAddress) return db.users.find((u) => u.walletAddress?.toLowerCase() === where.walletAddress.toLowerCase()) || null;
        return null;
      },
      async findFirst({ where }: any) {
        const db = getLocalDb();
        return db.users.find((u) => {
          if (where.email && u.email?.toLowerCase() !== where.email.toLowerCase()) return false;
          if (where.walletAddress && u.walletAddress?.toLowerCase() !== where.walletAddress.toLowerCase()) return false;
          return true;
        }) || null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        };
        db.users.push(newUser);
        saveLocalDb(db);
        return newUser;
      },
      async update({ where, data }: any) {
        const db = getLocalDb();
        const idx = db.users.findIndex((u) => u.id === where.id || (where.email && u.email?.toLowerCase() === where.email.toLowerCase()));
        if (idx !== -1) {
          db.users[idx] = { ...db.users[idx], ...data, updatedAt: new Date().toISOString() };
          saveLocalDb(db);
          return db.users[idx];
        }
        return null;
      },
      async delete({ where }: any) {
        const db = getLocalDb();
        const prevCount = db.users.length;
        db.users = db.users.filter((u) => u.id !== where.id);
        saveLocalDb(db);
        return { count: prevCount - db.users.length };
      },
      async findMany(args?: any) {
        const db = getLocalDb();
        let results = [...db.users];
        if (args?.where?.role) {
          results = results.filter((u) => u.role === args.where.role);
        }
        return results;
      },
      async count() {
        return getLocalDb().users.length;
      },
    },
    deal: {
      async findMany() {
        return getLocalDb().deals;
      },
      async findUnique({ where }: any) {
        const db = getLocalDb();
        if (where.id) return db.deals.find((d) => d.id === where.id) || null;
        if (where.onChainDealId !== undefined) return db.deals.find((d) => d.onChainDealId === where.onChainDealId) || null;
        return null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newDeal = {
          id: `deal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          status: "DRAFT",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        };
        db.deals.push(newDeal);
        saveLocalDb(db);
        return newDeal;
      },
      async update({ where, data }: any) {
        const db = getLocalDb();
        const idx = db.deals.findIndex((d) => d.id === where.id);
        if (idx !== -1) {
          db.deals[idx] = { ...db.deals[idx], ...data, updatedAt: new Date().toISOString() };
          saveLocalDb(db);
          return db.deals[idx];
        }
        return null;
      },
      async delete({ where }: any) {
        const db = getLocalDb();
        db.deals = db.deals.filter((d) => d.id !== where.id);
        saveLocalDb(db);
        return { count: 1 };
      },
      async count() {
        return getLocalDb().deals.length;
      },
    },
    whitelist: {
      async findMany(args?: any) {
        const db = getLocalDb();
        let list = [...db.whitelists];
        if (args?.where?.status) {
          list = list.filter((w) => w.status === args.where.status);
        }
        return list;
      },
      async findUnique({ where }: any) {
        const db = getLocalDb();
        if (where.id) return db.whitelists.find((w) => w.id === where.id) || null;
        if (where.address) return db.whitelists.find((w) => w.address?.toLowerCase() === where.address.toLowerCase()) || null;
        return null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newEntry = {
          id: `wl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          status: "APPROVED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data,
        };
        db.whitelists.push(newEntry);
        saveLocalDb(db);
        return newEntry;
      },
      async update({ where, data }: any) {
        const db = getLocalDb();
        const idx = db.whitelists.findIndex((w) => w.id === where.id || (where.address && w.address?.toLowerCase() === where.address.toLowerCase()));
        if (idx !== -1) {
          db.whitelists[idx] = { ...db.whitelists[idx], ...data, updatedAt: new Date().toISOString() };
          saveLocalDb(db);
          return db.whitelists[idx];
        }
        return null;
      },
      async delete({ where }: any) {
        const db = getLocalDb();
        db.whitelists = db.whitelists.filter((w) => w.id !== where.id);
        saveLocalDb(db);
        return { count: 1 };
      },
      async count() {
        return getLocalDb().whitelists.length;
      },
    },
    dealDocument: {
      async findMany(args?: any) {
        const db = getLocalDb();
        let docs = [...db.dealDocuments];
        if (args?.where?.dealId) {
          docs = docs.filter((d) => d.dealId === args.where.dealId);
        }
        if (args?.where?.milestoneIdx !== undefined) {
          docs = docs.filter((d) => d.milestoneIdx === args.where.milestoneIdx);
        }
        return docs;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newDoc = {
          id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
          ...data,
        };
        db.dealDocuments.push(newDoc);
        saveLocalDb(db);
        return newDoc;
      },
      async delete({ where }: any) {
        const db = getLocalDb();
        db.dealDocuments = db.dealDocuments.filter((d) => d.id !== where.id);
        saveLocalDb(db);
        return { count: 1 };
      },
    },
    account: {
      async findUnique({ where }: any) {
        const db = getLocalDb();
        return db.accounts.find((a) => a.provider === where.provider_providerAccountId?.provider && a.providerAccountId === where.provider_providerAccountId?.providerAccountId) || null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newAccount = { id: `acc_${Date.now()}`, ...data };
        db.accounts.push(newAccount);
        saveLocalDb(db);
        return newAccount;
      },
    },
    session: {
      async findUnique({ where }: any) {
        const db = getLocalDb();
        return db.sessions.find((s) => s.sessionToken === where.sessionToken) || null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newSession = { id: `ses_${Date.now()}`, ...data };
        db.sessions.push(newSession);
        saveLocalDb(db);
        return newSession;
      },
      async delete({ where }: any) {
        const db = getLocalDb();
        db.sessions = db.sessions.filter((s) => s.sessionToken !== where.sessionToken);
        saveLocalDb(db);
        return { count: 1 };
      },
    },
    verificationToken: {
      async findUnique({ where }: any) {
        const db = getLocalDb();
        return db.verificationTokens.find((t) => t.token === where.token) || null;
      },
      async create({ data }: any) {
        const db = getLocalDb();
        db.verificationTokens.push(data);
        saveLocalDb(db);
        return data;
      },
    },
    userDeal: {
      async findMany({ where }: any) {
        const db = getLocalDb();
        return db.userDeals.filter((d) => d.userId === where.userId);
      },
      async create({ data }: any) {
        const db = getLocalDb();
        const newDeal = { id: `deal_${Date.now()}`, ...data };
        db.userDeals.push(newDeal);
        saveLocalDb(db);
        return newDeal;
      },
    },
  };
}

let prismaClientInstance: any;

try {
  // Try importing compiled Prisma client
  const { PrismaClient } = require("@prisma/client");
  prismaClientInstance = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
} catch {
  // Graceful fallback to persistent JSON engine
  prismaClientInstance = createPrismaMock();
}

export const prisma = prismaClientInstance;
