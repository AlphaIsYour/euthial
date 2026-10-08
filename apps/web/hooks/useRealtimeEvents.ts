"use client";

import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { DEFAULT_CONFIG } from "../contracts/addresses";
import { FITOUT_AGREEMENT_ABI } from "../contracts/abis";

export interface RealtimeEventPayload {
  eventName: string;
  args: any;
  timestamp: string;
}

export function useRealtimeEvents(onNewEvent?: (event: RealtimeEventPayload) => void) {
  const [latestEvent, setLatestEvent] = useState<RealtimeEventPayload | null>(null);
  const [eventHistory, setEventHistory] = useState<RealtimeEventPayload[]>([]);

  // Watch MilestoneApproved
  useWatchContractEvent({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    eventName: "MilestoneApproved",
    onLogs(logs: any[]) {
      logs.forEach((log) => {
        const payload: RealtimeEventPayload = {
          eventName: "MilestoneApproved",
          args: (log as any)?.args,
          timestamp: new Date().toLocaleTimeString("id-ID"),
        };
        setLatestEvent(payload);
        setEventHistory((prev) => [payload, ...prev.slice(0, 19)]);
        if (onNewEvent) onNewEvent(payload);
      });
    },
  });

  // Watch BondDeposited
  useWatchContractEvent({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    eventName: "BondDeposited",
    onLogs(logs: any[]) {
      logs.forEach((log) => {
        const payload: RealtimeEventPayload = {
          eventName: "BondDeposited",
          args: (log as any)?.args,
          timestamp: new Date().toLocaleTimeString("id-ID"),
        };
        setLatestEvent(payload);
        setEventHistory((prev) => [payload, ...prev.slice(0, 19)]);
        if (onNewEvent) onNewEvent(payload);
      });
    },
  });

  // Watch ShortfallPaid
  useWatchContractEvent({
    address: DEFAULT_CONFIG.contracts.fitOutAgreement,
    abi: FITOUT_AGREEMENT_ABI,
    eventName: "ShortfallPaid",
    onLogs(logs: any[]) {
      logs.forEach((log) => {
        const payload: RealtimeEventPayload = {
          eventName: "ShortfallPaid",
          args: (log as any)?.args,
          timestamp: new Date().toLocaleTimeString("id-ID"),
        };
        setLatestEvent(payload);
        setEventHistory((prev) => [payload, ...prev.slice(0, 19)]);
        if (onNewEvent) onNewEvent(payload);
      });
    },
  });

  return {
    latestEvent,
    eventHistory,
    totalEventsCaptured: eventHistory.length,
  };
}
