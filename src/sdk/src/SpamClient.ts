import {
  IotaClient,
  IotaObjectRef,
  IotaObjectResponse,
  IotaTransactionBlockResponse,
} from "@iota/iota-sdk/client";
import { Signer } from "@iota/iota-sdk/cryptography";
import { Transaction } from "@iota/iota-sdk/transactions";
import {
  NetworkName,
  // devInspectAndGetExecutionResults,
  // objResToFields,
  sleep,
} from "@polymedia/suitcase-core";
import {
  SPAM_IDS,
  SPAM_MODULE,
  SPAM_NFT_IDS,
  SPAM_TX_FEE_INCREMENT_USER_COUNTER,
  SPAM_DECIMALS,
} from "./config.js";
import * as pkgSpam from "./packageSpam.js";
import * as pkgNft from "./packageNft.js";
import {
  BcsStats,
  Stats,
  UserCounter,
  UserCounters,
  ClaimData,
  QueryTxBlocks,
} from "./types.js";
import { sortJsonByNumericValuesDesc } from "./lib.js";

const INCREMENT_TX_GAS_BUDGET = 3000000; // 0.003 IOTA
const SLEEP_MS_AFTER_FINALITY_ERROR = 10000;

export class SpamClient {
  public readonly signer: Signer;
  public readonly network: NetworkName;
  public readonly rpcUrl: string;
  public readonly iotaClient: IotaClient;

  public readonly spamPackageId: string;
  public readonly spamDirectorId: string;

  public readonly nftPackageId: string;
  public readonly nftManagerId: string;

  protected gasCoin: IotaObjectRef | undefined;
  protected gasPrice: bigint | undefined;

  constructor(keypair: Signer, network: NetworkName, rpcUrl: string) {
    this.signer = keypair;
    this.network = network;
    this.rpcUrl = rpcUrl;
    this.iotaClient = new IotaClient({ url: rpcUrl });

    this.spamPackageId = SPAM_IDS[network].packageId;
    this.spamDirectorId = SPAM_IDS[network].directorId;

    this.nftPackageId = SPAM_NFT_IDS[network].packageId;
    this.nftManagerId = SPAM_NFT_IDS[network].nftManagerId;

    this.gasCoin = undefined;
    this.gasPrice = undefined;
  }

  /* Data fetching */

  public async fetchLeaderClaimUsers(): Promise<ClaimData | null> {
    try {
      const { data } = (await this.iotaClient.queryTransactionBlocks({
        filter: {
          MoveFunction: {
            package: this.spamPackageId,
            module: SPAM_MODULE,
            function: "claim_user_counter",
          },
        },
        options: { showBalanceChanges: true },
      })) as QueryTxBlocks;

      let leaderClaimUsers: ClaimData | null = null;

      for (const tx of data) {
        if (!tx.balanceChanges || tx.balanceChanges.length === 0) {
          continue;
        }

        const claimBalance = tx.balanceChanges.find((bc) => {
          return (
            Number(bc.amount) > 0 &&
            bc.coinType === `${this.spamPackageId}::${SPAM_MODULE}::SPAM`
          );
        });

        if (!claimBalance) {
          continue;
        }

        const { amount, owner } = claimBalance;
        const _amount = Math.floor(Number(amount) / 10 ** SPAM_DECIMALS);
        const _address = owner.AddressOwner;

        if (leaderClaimUsers && leaderClaimUsers[_address]) {
          (leaderClaimUsers[_address] as number) += _amount;
        } else {
          leaderClaimUsers = Object.assign({}, leaderClaimUsers, {
            [_address]: _amount,
          });
        }
      }

      leaderClaimUsers = sortJsonByNumericValuesDesc(leaderClaimUsers);
      return leaderClaimUsers;
    } catch (err) {
      console.log("fetchLeaderClaimUsers - Error:", err);
      return null;
    }
  }

  public async fetchUserCounters(): Promise<UserCounter[]> {
    const StructType = `${this.spamPackageId}::${SPAM_MODULE}::UserCounter`;
    const pageObjResp = await this.iotaClient.getOwnedObjects({
      owner: this.signer.toIotaAddress(),
      cursor: null, // doesn't handle pagination, but it's unlikely that it will ever be needed
      options: { showContent: true },
      filter: { StructType },
    });
    return pageObjResp.data.map((objResp) => this.parseUserCounter(objResp));
  }

  public async fetchUserCountersAndClassify(): Promise<UserCounters> {
    // fetch user counters
    const userCountersArray = await this.fetchUserCounters();

    // fetch IOTA epoch
    const iotaState = await this.iotaClient.getLatestIotaSystemState();
    const currEpoch = Number(iotaState.epoch);

    // categorize user counters
    const counters: UserCounters = {
      epoch: currEpoch,
      current: null,
      register: null,
      claim: [],
      delete: [],
    };
    for (const counter of userCountersArray) {
      if (counter.epoch === currEpoch) {
        if (!counters.current) {
          counters.current = counter;
        } else {
          // delete counter with lower tx_count
          if (counter.tx_count > counters.current.tx_count) {
            counters.delete.push(counters.current);
            counters.current = counter;
          } else {
            counters.delete.push(counter);
          }
        }
      } else if (counter.epoch == currEpoch - 1) {
        if (!counters.register) {
          counters.register = counter;
        } else if (counter.registered) {
          // delete unregistered counter
          counters.delete.push(counters.register);
          counters.register = counter;
        } else {
          // delete counter with lower tx_count
          if (counter.tx_count > counters.register.tx_count) {
            counters.delete.push(counters.register);
            counters.register = counter;
          } else {
            counters.delete.push(counter);
          }
        }
      } else if (counter.epoch <= currEpoch - 2) {
        if (counter.registered) {
          counters.claim.push(counter);
        } else {
          // delete unclaimable counters
          counters.delete.push(counter);
        }
      } else {
        throw new Error("UserCounter.epoch is newer than network epoch");
      }
    }

    // addDevData(counters, currEpoch);

    return counters;
  }

  public async fetchGasCostOfIncrementTx(): Promise<number> {
    const resp = await this.iotaClient.queryTransactionBlocks({
      filter: {
        MoveFunction: {
          package: this.spamPackageId,
          module: "spam",
          function: "increment_user_counter",
        },
      },
      options: {
        showBalanceChanges: true,
      },
      order: "descending",
      limit: 50,
    });

    let iotaAmount = Number(SPAM_TX_FEE_INCREMENT_USER_COUNTER);
    for (const tx of resp.data) {
      if (tx.balanceChanges?.length !== 1) {
        // A regular SPAM tx only has 1 balance change, so this is likely a
        // dual-mining tx for SPAM and MINE, or some other mining technique.
        continue;
      }
      iotaAmount = Number(tx.balanceChanges[0].amount) / -1_000_000_000;
      break;
    }
    return iotaAmount;
  }

  /* SpamNft functions */

  public async mint(
    spamCoinId: string,
    to: string,
  ): Promise<IotaTransactionBlockResponse> {
    const txb = new Transaction();
    pkgNft.mint(txb, this.nftPackageId, spamCoinId, this.nftManagerId, to);
    return this.signAndExecute(txb);
  }

  /* ************************************************ */

  /* Spam coin functions */

  public async newUserCounter(): Promise<IotaTransactionBlockResponse> {
    const txb = new Transaction();
    pkgSpam.new_user_counter(txb, this.spamPackageId, this.spamDirectorId);
    return this.signAndExecute(txb);
  }

  public async incrementUserCounter(
    userCounterRef: IotaObjectRef,
  ): Promise<IotaTransactionBlockResponse> {
    const txb = new Transaction();
    txb.setGasBudget(INCREMENT_TX_GAS_BUDGET);
    pkgSpam.increment_user_counter(txb, this.spamPackageId, userCounterRef);
    return this.signAndExecute(txb);
  }

  public async destroyUserCounters(
    userCounterIds: string[],
  ): Promise<IotaTransactionBlockResponse> {
    const txb = new Transaction();
    for (const counterId of userCounterIds) {
      pkgSpam.destroy_user_counter(txb, this.spamPackageId, counterId);
    }
    return this.signAndExecute(txb);
  }

  public async registerUserCounter(
    userCounterId: string,
  ): Promise<IotaTransactionBlockResponse> {
    const txb = new Transaction();
    pkgSpam.register_user_counter(
      txb,
      this.spamPackageId,
      this.spamDirectorId,
      userCounterId,
    );
    return this.signAndExecute(txb);
  }

  public async claimUserCounters(
    userCounterIds: string[],
    recipientAddress?: string,
  ): Promise<IotaTransactionBlockResponse> {
    const recipient = recipientAddress ?? this.signer.toIotaAddress();
    const txb = new Transaction();
    for (const counterId of userCounterIds) {
      const [coin] = pkgSpam.claim_user_counter(
        txb,
        this.spamPackageId,
        this.spamDirectorId,
        counterId,
      );
      txb.transferObjects([coin], recipient);
    }
    return this.signAndExecute(txb);
  }

  public async fetchStatsForSpecificEpochs(
    epochNumbers: number[],
  ): Promise<Stats> {
    const txb = new Transaction();
    pkgSpam.stats_for_specific_epochs(
      txb,
      this.spamPackageId,
      this.spamDirectorId,
      epochNumbers,
    );
    return this.deserializeStats(txb);
  }

  public async fetchStatsForRecentEpochs(epochCount: number): Promise<Stats> {
    const txb = new Transaction();
    pkgSpam.stats_for_recent_epochs(
      txb,
      this.spamPackageId,
      this.spamDirectorId,
      epochCount,
    );
    return this.deserializeStats(txb);
  }

  /* Gas management */

  public getGasCoin(): IotaObjectRef | undefined {
    if (!this.gasCoin) {
      return undefined;
    }
    return { ...this.gasCoin };
  }

  public setGasCoin(gasCoin: IotaObjectRef | undefined): void {
    this.gasCoin = gasCoin;
  }

  public getGasPrice(): bigint | undefined {
    return this.gasPrice;
  }

  public setGasPrice(gasPrice: bigint | undefined): void {
    this.gasPrice = gasPrice;
  }

  /* Helpers */

  protected async deserializeStats(txb: Transaction): Promise<Stats> {
    // const blockResults = await devInspectAndGetExecutionResults(this.iotaClient, txb);
    const { results: blockResults } =
      await this.iotaClient.devInspectTransactionBlock({
        sender:
          "0x7777777777777777777777777777777777777777777777777777777777777777",
        transactionBlock: txb,
      });

    if (blockResults?.length === 0) {
      throw Error("transaction didn't return any results");
    }

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const txResults = blockResults && blockResults[0];
    if (!txResults?.returnValues?.length) {
      throw Error(
        `transaction didn't return any values: ${JSON.stringify(txResults, null, 2)}`,
      );
    }

    const value = txResults.returnValues[0];
    const valueData = Uint8Array.from(value[0]);
    const valueDeserialized = BcsStats.parse(valueData);

    return valueDeserialized;
  }

  protected async signAndExecute(
    txb: Transaction,
  ): Promise<IotaTransactionBlockResponse> {
    txb.setSender(this.signer.toIotaAddress());

    if (this.gasCoin) {
      txb.setGasPayment([this.gasCoin]);
    }

    if (!this.gasPrice) {
      await this.fetchAndSetGasPrice();
    }

    if (this.gasPrice) {
      txb.setGasPrice(this.gasPrice);
    }

    const { bytes, signature } = await txb.sign({
      signer: this.signer,
      client: this.iotaClient,
    });

    let resp: IotaTransactionBlockResponse | null = null;
    while (!resp) {
      try {
        resp = await this.iotaClient.executeTransactionBlock({
          signature,
          transactionBlock: bytes,
          options: { showEffects: true },
          requestType: "WaitForEffectsCert",
        });
      } catch (err) {
        // Try to avoid equivocation issues
        const errStr = String(err);
        const errStrLower = errStr.toLowerCase();
        if (
          errStrLower.includes("finality") ||
          errStrLower.includes("timeout") ||
          errStrLower.includes("timed out")
        ) {
          const retryMsg = `Retrying in ${SLEEP_MS_AFTER_FINALITY_ERROR / 1000} seconds`;
          console.warn(
            `Finality/timeout error. ${retryMsg}. Original error: ${errStr}`,
          );
          await sleep(SLEEP_MS_AFTER_FINALITY_ERROR);
        } else {
          throw err;
        }
      }
    }

    this.gasCoin = resp.effects?.gasObject.reference;

    return resp;
  }

  protected async fetchAndSetGasPrice(): Promise<void> {
    try {
      this.gasPrice = await this.iotaClient.getReferenceGasPrice();
    } catch (err) {
      console.warn(`Failed to fetch gas price: ${err}`);
    }
  }

  private objResToFields(resp: IotaObjectResponse): Record<string, any> {
    if (resp.error) {
      throw Error(`response error: ${JSON.stringify(resp, null, 2)}`);
    }
    if (resp.data?.content?.dataType !== "moveObject") {
      throw Error(`response content missing: ${JSON.stringify(resp, null, 2)}`);
    }
    return resp.data.content.fields as Record<string, any>;
  }

  protected parseUserCounter(resp: IotaObjectResponse): UserCounter {
    const fields = this.objResToFields(resp);
    const ref: IotaObjectRef = {
      objectId: resp.data!.objectId,
      version: resp.data!.version,
      digest: resp.data!.digest,
    };
    return {
      id: fields.id.id,
      ref,
      epoch: Number(fields.epoch),
      tx_count: Number(fields.tx_count),
      registered: Boolean(fields.registered),
    };
  }
}

// Dev-only
/* eslint-disable */
// @ts-ignore
function addDevData(counters: UserCounters, currEpoch: number) {
  if (!counters.current) {
    counters.current = {
      id: "0x1111111111111111",
      ref: {
        objectId: "0x1111111111111111",
        version: "111",
        digest: "aaaaaaaaa",
      },
      epoch: currEpoch,
      tx_count: 111,
      registered: false,
    };
  }
  if (!counters.register) {
    counters.register = {
      id: "0x2222222222222222",
      ref: {
        objectId: "0x2222222222222222",
        version: "222",
        digest: "bbbbbbbbb",
      },
      epoch: currEpoch - 1,
      tx_count: 222,
      registered: true,
    };
  }
  if (counters.claim.length === 0) {
    counters.claim = [
      {
        id: "0x3333333333333333",
        ref: {
          objectId: "0x3333333333333333",
          version: "333",
          digest: "ccccccccc",
        },
        epoch: currEpoch - 2,
        tx_count: 333,
        registered: true,
      },
    ];
  }
  if (counters.delete.length === 0) {
    counters.delete = [
      {
        id: "0x4444444444444444",
        ref: {
          objectId: "0x4444444444444444",
          version: "444",
          digest: "ddddddddd",
        },
        epoch: currEpoch - 3,
        tx_count: 444,
        registered: false,
      },
    ];
  }
}
