import { UserCounters, IotaWalletClient } from "@polymedia/spam-sdk";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { RpcUrl } from "./storage";

export type SpamView = {
  events: { time: string; msg: string }[];
  counters: UserCounters;
};

export type UserBalances = {
  iota: number;
  spam: number;
};

export const supportedNetworks = ["mainnet", "testnet"] as const;
export type NetworkName = (typeof supportedNetworks)[number];

export type AppContext = {
  network: NetworkName;
  rpcUrls: RpcUrl[];
  updateRpcUrls: (newRpcs: RpcUrl[]) => Promise<void>;
  balances: UserBalances;
  spammer: React.MutableRefObject<Spammer>;
  iotaWalletClient: IotaWalletClient;
  spamView: SpamView;
  replaceKeypair: (keypair: Ed25519Keypair) => void;
  updateClaimAddress: (claimAddress: string) => void;
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
};
