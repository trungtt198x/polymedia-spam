import { DevInspectTransactionBlockParams, IotaClient, IotaTransactionBlockResponse, IotaTransactionBlockResponseOptions } from "@iota/iota-sdk/client";
import { SignatureWithBytes } from "@iota/iota-sdk/cryptography";
import { Transaction } from "@iota/iota-sdk/transactions";
import { NetworkName } from "@polymedia/suitcase-core";

import { SignTx } from "./lib.js";
import * as pkgNft from "./packageNft.js";
import { SPAM_NFT_IDS } from "./config.js";

/**
 * A client to interact with the demo IOTA contract.
 */
export class IotaWalletClient {

    public readonly iotaClient: IotaClient;
    public readonly signTx: SignTx;
    public readonly nftPackageId: string;
    public readonly nftManagerId: string;

    constructor(
        iotaClient: IotaClient,
        signTx: SignTx,
        network: NetworkName,
    ) {
        this.iotaClient = iotaClient;
        this.signTx = signTx;
        this.nftPackageId = SPAM_NFT_IDS[network].packageId;
        this.nftManagerId = SPAM_NFT_IDS[network].nftManagerId;
    }

    public async mint(
        spamCoinId: string,
        to: string,
        sender: string,
        dryRun?: boolean,
    ): Promise<IotaTransactionBlockResponse> {
        const tx = new Transaction();
        pkgNft.mint(tx, this.nftPackageId, spamCoinId, this.nftManagerId, to);
        const resp = await this.signAndExecuteTx({
            tx,
            sender,
            dryRun,
        });
        return resp;
    }

    // === data fetching ===

    // public async fetchOwnedNfts(sender: string): Promise<Nft[]> {
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

    // === transaction helpers ===

    public async executeTx({
        signedTx,
        txRespOptions,
        dryRun = false,
        sender,
    }: {
        signedTx: SignatureWithBytes;
        txRespOptions?: IotaTransactionBlockResponseOptions;
        dryRun?: boolean;
        sender?: string;
    }): Promise<IotaTransactionBlockResponse> {
        if (dryRun) {
            return this.dryRunTx({ tx: signedTx.bytes, sender });
        }
        const resp = await this.iotaClient.executeTransactionBlock({
            transactionBlock: signedTx.bytes,
            signature: signedTx.signature,
            options: txRespOptions,
        });
        return resp;
    }

    public async signAndExecuteTx({
        tx,
        txRespOptions,
        dryRun = false,
        sender,
    }: {
        tx: Transaction;
        txRespOptions?: IotaTransactionBlockResponseOptions;
        dryRun?: boolean;
        sender?: string;
    }): Promise<IotaTransactionBlockResponse> {
        if (dryRun) {
            return await this.dryRunTx({ tx, sender });
        }
        const signedTx = await this.signTx(tx);
        const resp = await this.executeTx({ signedTx, txRespOptions, sender });
        return resp;
    }

    public async dryRunTx({
        tx,
        sender = "0x7777777777777777777777777777777777777777777777777777777777777777",
    }: {
        tx: DevInspectTransactionBlockParams["transactionBlock"];
        sender?: string;
    }): Promise<IotaTransactionBlockResponse> {
        const resp = await this.iotaClient.devInspectTransactionBlock({
            sender,
            transactionBlock: tx,
        });
        return { digest: "", ...resp };
    }
}
