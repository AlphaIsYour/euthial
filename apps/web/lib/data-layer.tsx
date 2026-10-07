"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type DataMode = "simulation" | "onchain";

interface DataLayerContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  toggleMode: () => void;
  isSimulation: boolean;
  isOnChain: boolean;
}

const DataLayerContext = createContext<DataLayerContextType | undefined>(undefined);

export const DataLayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<DataMode>("simulation");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("euthial-data-mode") as DataMode | null;
      if (saved === "simulation" || saved === "onchain") {
        setMode(saved);
      }
    }
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "simulation" ? "onchain" : "simulation";
      if (typeof window !== "undefined") {
        localStorage.setItem("euthial-data-mode", next);
      }
      return next;
    });
  };

  const handleSetMode = (newMode: DataMode) => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("euthial-data-mode", newMode);
    }
  };

  return (
    <DataLayerContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        toggleMode,
        isSimulation: mode === "simulation",
        isOnChain: mode === "onchain",
      }}
    >
      {children}
    </DataLayerContext.Provider>
  );
};

export const useDataLayer = () => {
  const ctx = useContext(DataLayerContext);
  if (!ctx) {
    return {
      mode: "simulation" as DataMode,
      setMode: () => {},
      toggleMode: () => {},
      isSimulation: true,
      isOnChain: false,
    };
  }
  return ctx;
};
