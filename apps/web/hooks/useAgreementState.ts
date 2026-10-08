"use client";

import { useReadContract } from "wagmi";
import { DEFAULT_CONFIG } from "../contracts/addresses";
import { FITOUT_AGREEMENT_ABI } from "../contracts/abis";

export function useAgreementState() {
  const { data: stateData, isLoading: isStateLoading, refetch: refetchState } = useReadContract({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    functionName: "currentState",
    query: {
      refetchInterval: 15000,
    },
  });

  const { data: covenantData, isLoading: isCovenantLoading, refetch: refetchCovenant } = useReadContract({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    functionName: "covenantStatus",
    query: {
      refetchInterval: 15000,
    },
  });

  const stateLabels = ["PROPOSED", "ACTIVE_FITOUT", "LIVE_OPERATING", "RESTRUCTURED", "DEFAULTED", "COMPLETED"];
  const covenantLabels = ["HEALTHY", "WARNING", "CURE", "BOND_DRAWN", "STEP_IN"];

  const currentStateIndex = stateData !== undefined ? Number(stateData) : 1;
  const covenantStatusIndex = covenantData !== undefined ? Number(covenantData) : 0;

  return {
    stateIndex: currentStateIndex,
    stateLabel: stateLabels[currentStateIndex] || "UNKNOWN",
    covenantIndex: covenantStatusIndex,
    covenantLabel: covenantLabels[covenantStatusIndex] || "HEALTHY",
    isLoading: isStateLoading || isCovenantLoading,
    refetch: () => {
      refetchState();
      refetchCovenant();
    },
  };
}
