import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      walletAddress?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    walletAddress?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    // 1. Traditional Credentials (Email + Password)
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
        };
      },
    }),

    // 2. Web3 Wallet Address / SIWE Provider
    CredentialsProvider({
      id: "siwe",
      name: "Ethereum Wallet",
      credentials: {
        address: { label: "Address", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.address) return null;

        const address = String(credentials.address).toLowerCase();

        // Upsert user with this wallet address
        let user = await prisma.user.findUnique({
          where: { walletAddress: address },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              walletAddress: address,
              name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
              role: "INVESTOR",
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "VIEWER";
        session.user.walletAddress = token.walletAddress as string | null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "euthial-protocol-secret-key-development-mode-2026",
});
