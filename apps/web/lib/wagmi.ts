import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { sepolia, foundry } from "viem/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Rekomendasi",
      wallets: [injectedWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Euthial Protocol",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f168da2d7b",
  }
);

export const config = createConfig({
  connectors,
  chains: [sepolia, foundry],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://ethereum-sepolia-rpc.publicnode.com",
      {
        timeout: 8000,
        retryCount: 1,
      }
    ),
    [foundry.id]: http("http://127.0.0.1:8545", {
      timeout: 3000,
      retryCount: 0,
    }),
  },
  ssr: true,
});
