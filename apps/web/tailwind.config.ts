import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--app-bg)",
          sidebar: "var(--sidebar-bg)",
          panel: "var(--panel-bg)",
          card: "var(--card-bg)",
          cardSoft: "var(--card-bg-soft)",
          input: "var(--input-bg)",
          borderSoft: "var(--border-soft)",
          borderHover: "var(--border-hover)",
          dot: "var(--dot-color)",
          hover: "var(--hover-bg)",
          active: "var(--active-bg)",
        },
        status: {
          healthy: "var(--status-healthy)",
          "healthy-bg": "var(--status-healthy-bg)",
          warning: "var(--status-warning)",
          "warning-bg": "var(--status-warning-bg)",
          danger: "var(--status-danger)",
          "danger-bg": "var(--status-danger-bg)",
        },
        accent: {
          senior: "var(--accent-senior)",
          junior: "var(--accent-junior)",
          landlord: "var(--accent-landlord)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "8px",
        badge: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
