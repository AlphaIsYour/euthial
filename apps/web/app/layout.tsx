import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Euthial · Verifiable RBF for Commercial Ruko Fit-Outs",
  description: "Verifiable Revenue-Based Financing protocol for shop-house fit-outs with dual-tranche ERC-4626 and EIP-712 settlement attestations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
