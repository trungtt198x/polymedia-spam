import { NetworkName } from "@polymedia/suitcase-core";

export type SpamConfig = {
  packageId: string;
  directorId: string;
  epoch: number; // when the Move pkg was published
};

export type SpamNftConfig = {
  packageId: string;
  adminId: string;
  nftManagerId: string;
  epoch: number; // when the Move pkg was published
};

export const SPAM_IDS: Record<NetworkName, SpamConfig> = {
  mainnet: {
    packageId: "",
    directorId: "",
    epoch: 1,
  },
  testnet: {
    packageId:
      "0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745",
    directorId:
      "0xc7dc8c06d28f77770bc4e84ac6fb14c82b4ac0cccd8198a59e71069dc1c3e418",
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

// The number of epochs from the latest epoch
export const SPAM_EPOCHS_AMOUNT = 20;

export const SPAM_NFT_IDS: Record<NetworkName, SpamNftConfig> = {
  mainnet: {
    packageId: "",
    adminId: "",
    nftManagerId: "",
    epoch: 1, // when the Move pkg was published
  },
  testnet: {
    packageId:
      "0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f",
    adminId:
      "0x13fba29a4e50fef38d7da548a66638ae090b62d79d6dc70e9206b1c8e78d253e",
    nftManagerId:
      "0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5",
    epoch: 109, // when the Move pkg was published
  },
  devnet: {
    packageId: "",
    adminId: "",
    nftManagerId: "",
    epoch: 1, // when the Move pkg was published
  },
  localnet: {
    packageId: "",
    adminId: "",
    nftManagerId: "",
    epoch: 1, // when the Move pkg was published
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

export const SPAM_NFT_MODULE = "nft";

// Total SPAM coin reward per epoch
// Must match the one defined in "spam.move" contract
export const TOTAL_EPOCH_REWARD = 1_000_000_000;

export const IOTA_DECIMALS = 9;

// "stopped" | "running" | "stopping"
export const SPAM_STATUS = "stopped";

export const SPAM_TX_FEE_INCREMENT_USER_COUNTER = 0.001;
export const SPAM_TX_LOW_BALANCE = 5 * SPAM_TX_FEE_INCREMENT_USER_COUNTER;

// "testnet" and "mainnet"
export const DEFAULT_NETWORK = "testnet";

// Disable all buttons
export const IS_DISABLED = false;

// On Spam page, updating interval of the user's current counter
export const UPDATE_INTERVAL_MS = 10_000;
