// Demonstrates using the SDK to build Node.js CLI tools for SPAM.

import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { SPAM_IDS, SpamClient, shortenStuff } from "@polymedia/spam-sdk";

async function main() {
  console.log(
    "Mainnet package ID:",
    shortenStuff(SPAM_IDS.mainnet.packageId),
  );

  const spamClient = new SpamClient(
    new Ed25519Keypair(),
    "mainnet",
    "https://fullnode.mainnet.iota.io:443",
  );
  const stats = await spamClient.fetchStatsForRecentEpochs(3);

  console.log("Stats:");
  console.log(stats);
}

void main();
