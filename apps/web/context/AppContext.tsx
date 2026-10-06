"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "INVESTOR" | "LANDLORD" | "TENANT" | "INSPECTOR";

export type NavTab = "dashboard" | "scenarios" | "simulator" | "audit" | "contracts";

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  isWalletConnected: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  address: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("INVESTOR");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const [address] = useState("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  useEffect(() => {
    // Read saved theme on client mount
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("euthial-theme") as "dark" | "light" | null;
      const initial = savedTheme || "dark";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
      if (initial === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("euthial-theme", next);
        document.documentElement.setAttribute("data-theme", next);
        if (next === "light") {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        }
      }
      return next;
    });
  };

  const connectWallet = () => setIsWalletConnected(true);
  const disconnectWallet = () => setIsWalletConnected(false);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isSidebarCollapsed,
        toggleSidebar,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        isWalletConnected,
        connectWallet,
        disconnectWallet,
        address,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an AppProvider");
  return ctx;
};
