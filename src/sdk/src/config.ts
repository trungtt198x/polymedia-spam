import { NetworkName } from "@polymedia/suitcase-core";

export type NetworkConfig = {
    packageId: string;
    directorId: string;
};

export const SPAM_IDS: Record<NetworkName, NetworkConfig> = {
    mainnet: {
        packageId: "0x30a644c3485ee9b604f52165668895092191fcaf5489a846afa7fc11cdb9b24a",
        directorId: "0x71d2211afbb63a83efc9050ded5c5bb7e58882b17d872e32e632a978ab7b5700",
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
export const SUI_DECIMALS = 9;
