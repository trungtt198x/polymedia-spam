// import { bcs } from "@iota/bcs";
// import { IotaObjectRef } from "@iota/iota-sdk/client";
import { Transaction, TransactionResult } from "@iota/iota-sdk/transactions";
import { SPAM_NFT_MODULE } from "./config.js";

export const mint = (
  tx: Transaction,
  packageId: string,
  spamCoinId: string,
  nftManagerId: string,
  customMetadataRegistryId: string,
  to: string,
): TransactionResult => {
  return tx.moveCall({
    target: `${packageId}::${SPAM_NFT_MODULE}::mint`,
    typeArguments: [],
    arguments: [
      tx.object(spamCoinId),
      tx.object(nftManagerId),
      tx.object(customMetadataRegistryId),
      tx.pure.address(to),
    ],
  });
};

// export const fetchOwnedNfts = async (sender: string): Promise<Nft[]> => {
//     const resp = await this.iotaClient.getOwnedObjects({
//         owner: sender,
//         filter: {
//             StructType: `${this.nftPackageId}::nft::Nft`,
//         },
//         options: {
//             showContent: true,
//             showDisplay: true,
//         },
//     });
//     return resp.data.map(objResToNft);
// }
