import { NetworkName } from "@polymedia/suitcase-core";

export type NetworkConfig = {
    packageId: string;
    directorId: string;
    epoch: number; // when the Move pkg was published
};

export const SPAM_IDS: Record<NetworkName, NetworkConfig> = {
    mainnet: {
        packageId: "",
        directorId: "",
        epoch: 1,
    },
    testnet: {
        packageId: "0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745",
        directorId: "0xc7dc8c06d28f77770bc4e84ac6fb14c82b4ac0cccd8198a59e71069dc1c3e418",
        epoch: 99, // when the Move pkg was published
    },
    devnet: {
        packageId: "",
        directorId: "",
        epoch: 1,
    },
    localnet: {
        packageId: "",
        directorId: "",
        epoch: 1,
    },
};

export const EXPLORER: Record<NetworkName, string> = {
    mainnet: "https://iotascan.com/mainnet",
    testnet: "https://iotascan.com/testnet",
    devnet: "",
    localnet: "",
};

export const SPAM_MODULE = "spam";
export const SPAM_SYMBOL = "SPAM";
export const SPAM_DECIMALS = 4;

// Total SPAM coin reward per epoch
// Must match the one defined in "spam.move" contract
export const TOTAL_EPOCH_REWARD = 1_000_000_000;

export const IOTA_DECIMALS = 9;

// "stopped" | "running" | "stopping"
export const SPAM_STATUS = "stopped";

export const SPAM_TX_FEE_INCREMENT_USER_COUNTER = 0.001;

// "testnet" and "mainnet"
export const DEFAULT_NETWORK = "testnet";
