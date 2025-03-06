// import { bcs } from "@iota/bcs";
// import { IotaObjectRef } from "@iota/iota-sdk/client";
import {
    Transaction,
    TransactionResult,
} from "@iota/iota-sdk/transactions";
import { SPAM_NFT_MODULE } from "./config.js";

export function mint(
    tx: Transaction,
    packageId: string,
    spamCoinId: string,
    nftManagerId: string,
    to: string,
): TransactionResult {
    return tx.moveCall({
        target: `${packageId}::${SPAM_NFT_MODULE}::mint`,
        arguments: [
            tx.object(spamCoinId),
            tx.object(nftManagerId),
            tx.pure.address(to),
        ],
    });
}
