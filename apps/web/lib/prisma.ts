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
}

function getLocalDb(): LocalDb {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Could not read local DB, using fresh memory state:", err);
  }
  return {
    users: [
      {
        id: "usr_demo_landlord",
        name: "Hendra Wijaya (Landlord)",
        email: "landlord@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC", // password123
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
        id: "usr_demo_tenant",
        name: "Budi Santoso (Tenant Pengelola)",
        email: "tenant@euthial.id",
        passwordHash: "$2a$10$wTf2zXj5x7L1m8Uv5c3yXe0u5Qy4k4dYm8qV0b0tYvYq5e9dKq5tC",
        walletAddress: "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
        role: "TENANT",
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
    ],
    accounts: [],
    sessions: [],
    verificationTokens: [],
    userDeals: [],
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
        const idx = db.users.findIndex((u) => u.id === where.id || u.email === where.email);
        if (idx !== -1) {
          db.users[idx] = { ...db.users[idx], ...data, updatedAt: new Date().toISOString() };
          saveLocalDb(db);
          return db.users[idx];
        }
        return null;
      },
      async findMany() {
        return getLocalDb().users;
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
