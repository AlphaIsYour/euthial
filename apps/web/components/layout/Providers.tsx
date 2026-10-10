"use client";

import React, { useState } from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

import { SessionProvider } from "next-auth/react";

import { config } from "../../lib/wagmi";
import { DataLayerProvider } from "../../lib/data-layer";
import { LanguageProvider } from "../../hooks/useLanguageMode";
import { AppProvider } from "../../context/AppContext";
import { ProtocolProvider } from "../../context/ProtocolContext";
import { Web3Provider } from "../../context/Web3Context";
import { ToastContainer } from "../ui/Toast";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <DataLayerProvider>
              <LanguageProvider>
                <AppProvider>
                  <ProtocolProvider>
                    <Web3Provider>
                      {children}
                      <ToastContainer />
                    </Web3Provider>
                  </ProtocolProvider>
                </AppProvider>
              </LanguageProvider>
            </DataLayerProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
