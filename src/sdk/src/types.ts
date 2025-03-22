import { bcs } from "@iota/bcs";
import { IotaObjectRef } from "@iota/iota-sdk/client";

/* 1:1 representations of Move contract structs */

export type Director = {
  id: string;
  paused: boolean;
  tx_count: number;
  treasury: string;
  epoch_counters: Map<number, string>;
};

export type EpochCounter = {
  epoch: number;
  tx_count: number;
  user_counts: Map<string, number>;
};

export type UserCounter = {
  id: string;
  ref: IotaObjectRef;
  epoch: number;
  tx_count: number;
  registered: boolean;
};

export type Stats = typeof BcsStats.$inferType;

export const BcsStats = bcs.struct("Stats", {
  epoch: bcs.u64(),
  paused: bcs.bool(),
  tx_count: bcs.u64(),
  supply: bcs.u64(),
  epochs: bcs.vector(
    bcs.struct("EpochStats", {
      epoch: bcs.u64(),
      tx_count: bcs.u64(),
    }),
  ),
});

/* Other types */

export type UserCounters = {
  epoch: number;
  current: UserCounter | null;
  register: UserCounter | null;
  claim: UserCounter[];
  delete: UserCounter[];
};

export function emptyUserCounters(): UserCounters {
  return {
    epoch: -1,
    current: null,
    register: null,
    claim: [],
    delete: [],
  };
}

export type SpamEvent = {
  type: "debug" | "info" | "warn" | "error";
  msg: string;
  txDigest?: string;
};

export type SpamEventHandler = (event: SpamEvent) => void;

export type SpamStatus = "stopped" | "running" | "stopping";

export type CounterOp = "register" | "claim" | "delete";
