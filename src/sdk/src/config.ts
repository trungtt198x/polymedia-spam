import { NetworkName } from "@polymedia/suitcase-core";

export type NetworkConfig = {
    packageId: string;
    directorId: string;
};

export const SPAM_IDS: Record<NetworkName, NetworkConfig> = {
    mainnet: {
        packageId: "",
        directorId: "",
    },
    testnet: {
        packageId: "0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745",
        directorId: "0xc7dc8c06d28f77770bc4e84ac6fb14c82b4ac0cccd8198a59e71069dc1c3e418",
    },
    devnet: {
        packageId: "",
        directorId: "",
    },
    localnet: {
        packageId: "",
        directorId: "",
    },
};

export const SPAM_MODULE = "spam";
export const SPAM_SYMBOL = "SPAM";
export const SPAM_DECIMALS = 4;
export const IOTA_DECIMALS = 9;

// "stopped" | "running" | "stopping"
export const SPAM_STATUS = "running";

// "testnet" and "mainnet"
export const DEFAULT_NETWORK = "testnet";
