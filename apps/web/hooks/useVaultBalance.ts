"use client";

import { useReadContract } from "wagmi";
import { formatUnits, type Address } from "viem";
import { DEFAULT_CONFIG } from "../contracts/addresses";
import { TRANCHE_VAULT_ABI } from "../contracts/abis";

export function useVaultBalance(accountAddress?: string | null) {
  // Read Senior Vault totalAssets
  const { data: seniorTotalAssets, isLoading: isSeniorTotalLoading } = useReadContract({
    address: DEFAULT_CONFIG.contracts.seniorVault,
    abi: TRANCHE_VAULT_ABI,
    functionName: "totalAssets",
    query: { refetchInterval: 15000 },
  });

  // Read Junior Vault totalAssets
  const { data: juniorTotalAssets, isLoading: isJuniorTotalLoading } = useReadContract({
    address: DEFAULT_CONFIG.contracts.juniorVault,
    abi: TRANCHE_VAULT_ABI,
    functionName: "totalAssets",
    query: { refetchInterval: 15000 },
  });

  // Read user balance in Senior Vault if address provided
  const { data: userSeniorBalance, isLoading: isUserSeniorLoading } = useReadContract({
    address: DEFAULT_CONFIG.contracts.seniorVault,
    abi: TRANCHE_VAULT_ABI,
    functionName: "balanceOf",
    args: accountAddress ? [accountAddress as Address] : undefined,
    query: {
      enabled: !!accountAddress,
      refetchInterval: 15000,
    },
  });

  // Read user balance in Junior Vault if address provided
  const { data: userJuniorBalance, isLoading: isUserJuniorLoading } = useReadContract({
    address: DEFAULT_CONFIG.contracts.juniorVault,
    abi: TRANCHE_VAULT_ABI,
    functionName: "balanceOf",
    args: accountAddress ? [accountAddress as Address] : undefined,
    query: {
      enabled: !!accountAddress,
      refetchInterval: 15000,
    },
  });

  const seniorAssetsFormatted = seniorTotalAssets ? Number(formatUnits(seniorTotalAssets as bigint, 6)) : 0;
  const juniorAssetsFormatted = juniorTotalAssets ? Number(formatUnits(juniorTotalAssets as bigint, 6)) : 0;
  const userSeniorFormatted = userSeniorBalance ? Number(formatUnits(userSeniorBalance as bigint, 6)) : 0;
  const userJuniorFormatted = userJuniorBalance ? Number(formatUnits(userJuniorBalance as bigint, 6)) : 0;

  return {
    seniorTotalAssets: seniorAssetsFormatted,
    juniorTotalAssets: juniorAssetsFormatted,
    userSeniorBalance: userSeniorFormatted,
    userJuniorBalance: userJuniorFormatted,
    isLoading: isSeniorTotalLoading || isJuniorTotalLoading || isUserSeniorLoading || isUserJuniorLoading,
  };
}
