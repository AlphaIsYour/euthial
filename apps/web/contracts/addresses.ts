import type { Address } from "viem";

export interface NetworkContracts {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: {
    mockIDR: Address;
    euthialIDR: Address;
    seniorVault: Address;
    juniorVault: Address;
    fitOutAgreement: Address;
    waterfallRouter: Address;
    agreementFactory?: Address;
  };
}

export const NETWORKS: Record<number, NetworkContracts> = {
  // Sepolia Ethereum Testnet
  11155111: {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
    contracts: {
      mockIDR: "0x51E5dB7a216D8c50dC4b917036a4613B9B74F3b0" as Address,
      euthialIDR: "0x51E5dB7a216D8c50dC4b917036a4613B9B74F3b0" as Address,
      seniorVault: "0x3F616b3f713e54b6C374b595b118b6348Eb01150" as Address,
      juniorVault: "0x288cf2B69B7c14a24A69A27F19656461FE187b50" as Address,
      fitOutAgreement: "0x89D2E1643c59a35e00fB10283b7E42588147E840" as Address,
      waterfallRouter: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
      agreementFactory: "0x0165878A594ca255338adfa4d48449f69242Eb8F" as Address,
    },
  },
  // Anvil Localhost
  31337: {
    chainId: 31337,
    name: "Anvil Local",
    rpcUrl: "http://127.0.0.1:8545",
    blockExplorer: "http://localhost:3000",
    contracts: {
      mockIDR: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
      euthialIDR: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
      seniorVault: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as Address,
      juniorVault: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as Address,
      fitOutAgreement: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as Address,
      waterfallRouter: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" as Address,
      agreementFactory: "0x5FC8d32690cc91D4c39d103bc414979874999342" as Address,
    },
  },
};

export const DEFAULT_CHAIN_ID = 11155111;
export const DEFAULT_CONFIG = NETWORKS[DEFAULT_CHAIN_ID];
