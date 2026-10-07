"use client";

import React from "react";
import { AppProvider } from "../../context/AppContext";
import { ProtocolProvider } from "../../context/ProtocolContext";
import { Web3Provider } from "../../context/Web3Context";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <ProtocolProvider>
        <Web3Provider>
          {children}
        </Web3Provider>
      </ProtocolProvider>
    </AppProvider>
  );
};
