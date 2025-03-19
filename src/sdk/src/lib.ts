import { SignatureWithBytes } from "@iota/iota-sdk/cryptography";
import { Transaction } from "@iota/iota-sdk/transactions";
import { IotaObjectResponse } from "@iota/iota-sdk/client";

export type SignTx = (tx: Transaction) => Promise<SignatureWithBytes>;

export const shortenTx = (tx: string): string => {
  if (tx.length <= 8) {
    return tx; // No need to format if the string is too short
  }

  const firstPart = tx.slice(0, 4);
  const lastPart = tx.slice(-4);
  return `${firstPart}...${lastPart}`;
};

export const isValidIotaAddress = (address: string): boolean => {
  const suiAddressPattern = /^0x[a-fA-F0-9]{64}$/;
  return suiAddressPattern.test(address);
};

export type Nft = {
  id: string;
  name: string;
  imageUrl: string;
};

/* eslint-disable */
export const objResToNft = (obj: IotaObjectResponse): Nft => {
  const content = obj.data?.content;
  if (!content || content.dataType !== "moveObject") {
    throw new Error("Invalid object response");
  }
  const fields = content.fields as Record<string, any>;
  return {
    id: fields.id.id,
    name: fields.name,
    imageUrl: fields.image_url,
  };
};
/* eslint-enable */
