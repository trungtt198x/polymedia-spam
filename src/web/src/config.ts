import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

export const defaultNetwork = "testnet";

export const supportedNetworks = ["testnet", "mainnet"] as const;

export type SupportedNetwork = typeof supportedNetworks[number];

export const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});
