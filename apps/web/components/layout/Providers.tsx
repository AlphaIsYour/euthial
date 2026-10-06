"use client";

import React from "react";
import { AppProvider } from "../../context/AppContext";
import { ProtocolProvider } from "../../context/ProtocolContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <ProtocolProvider>
        {children}
      </ProtocolProvider>
    </AppProvider>
  );
};
