/**
 * ponder.config.ts
 * Ponder Configuration for Euthial Protocol
 * Issue #63 [C-06]
 */

export const config = {
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
      pollingInterval: 12000,
      maxBlockRange: 2000,
    },
    local: {
      chainId: 31337,
      transport: "http://127.0.0.1:8545",
      pollingInterval: 1000,
    },
  },
  contracts: {
    AgreementFactory: {
      network: "sepolia",
      address: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "0x712516e61C8d383dF4221BCEab33264F5DE56acb") as `0x${string}`,
      startBlock: 6900000,
    },
    WaterfallRouter: {
      network: "sepolia",
      address: (process.env.NEXT_PUBLIC_ROUTER_ADDRESS || "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853") as `0x${string}`,
      startBlock: 6900000,
    },
  },
};

export default config;
