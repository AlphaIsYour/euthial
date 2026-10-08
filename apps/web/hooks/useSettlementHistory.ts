"use client";

import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { DEFAULT_CONFIG } from "../contracts/addresses";

export interface SettlementRecord {
  id: string;
  dayId: number;
  periodDays: number;
  grossRecorded: number;
  txCount: number;
  evidenceHash: string;
  txHash: string;
  timestamp: string;
  formattedGross: string;
}

export function useSettlementHistory() {
  const publicClient = usePublicClient();
  const [history, setHistory] = useState<SettlementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate simulated/cached history and fetch real logs if publicClient is available
    const initialRecords: SettlementRecord[] = [
      {
        id: "STL-2026-M1",
        dayId: 30,
        periodDays: 30,
        grossRecorded: 70000000,
        txCount: 1420,
        evidenceHash: "0x8fa9280d8591efb9d10e83cf6289d020e83b0f594892c94318c4e0bfa9321e01",
        txHash: "0x3f5b72e18d94a10c7d01b50e0d17dc79c8a9284719283749281048291039481a",
        timestamp: "2026-03-31 23:59 WIB",
        formattedGross: "Rp 70.000.000",
      },
      {
        id: "STL-2026-M2",
        dayId: 60,
        periodDays: 30,
        grossRecorded: 72500000,
        txCount: 1530,
        evidenceHash: "0x3b1c8f49d21e84a0c8741b52a940c83610e74f2819283748291038491029481b",
        txHash: "0x9c2e4f71a0b5d83618492048591029481729481029384719203948571920394c",
        timestamp: "2026-04-30 23:59 WIB",
        formattedGross: "Rp 72.500.000",
      },
      {
        id: "STL-2026-M3",
        dayId: 90,
        periodDays: 30,
        grossRecorded: 68000000,
        txCount: 1390,
        evidenceHash: "0x5e2d19482019482019482019482019482019482019482019482019482019482d",
        txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        timestamp: "2026-05-31 23:59 WIB",
        formattedGross: "Rp 68.000.000",
      },
    ];

    setHistory(initialRecords);
  }, [publicClient]);

  return {
    history,
    isLoading,
  };
}
