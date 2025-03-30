import { NetworkName } from "@polymedia/suitcase-core";
import {
  TESTNET,
  MAINNET,
  defaultNetwork,
  systemDisabled,
} from "./config.json";

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
  mintPrice: number; // in $SPAM with 4 decimals
};

export const SPAM_IDS: Record<NetworkName, SpamConfig> = {
  mainnet: {
    ...MAINNET.SPAM,
  },
  testnet: {
    ...TESTNET.SPAM,
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
    ...MAINNET.NFT,
  },
  testnet: {
    ...TESTNET.NFT,
  },
  devnet: {
    ...TESTNET.NFT,
  },
  localnet: {
    ...TESTNET.NFT,
  },
};

export const EXPLORER: Record<NetworkName, string> = {
  mainnet: MAINNET.explorer,
  testnet: TESTNET.explorer,
  devnet: "",
  localnet: "",
};

export const SPAM_MODULE = "spam";
export const SPAM_SYMBOL = "SPAM";
export const SPAM_DECIMALS = 4;
export const getSpamCoinType = (network: NetworkName): string =>
  `${SPAM_IDS[network].packageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`;

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
export const DEFAULT_NETWORK = defaultNetwork;

// Disable all buttons
export const IS_DISABLED = systemDisabled;

// On Spam page, updating interval of the user's current counter
export const UPDATE_INTERVAL_MS = 10_000;

export const FETCH_LEADER_BOARD_INTERVAL_MS = 60_000;

// "info" or "debug"
export const SHOW_EVENT_TYPE = "info";
