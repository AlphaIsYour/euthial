"use client";

import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { DEFAULT_CONFIG } from "../contracts/addresses";
import { FITOUT_AGREEMENT_ABI } from "../contracts/abis";

export function useBondBalance() {
  const { data, isLoading, refetch } = useReadContract({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    functionName: "bondBalance",
    query: {
      refetchInterval: 15000,
    },
  });

  const rawBalance = (data as bigint) || BigInt(0);
  const formattedIDR = Number(formatUnits(rawBalance, 6));

  return {
    rawBalance,
    formattedIDR,
    isLoading,
    refetch,
  };
}
