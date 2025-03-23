import { formatNumber } from "@polymedia/suitcase-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { shortenStuff } from "@polymedia/spam-sdk";
import { useEffect } from "react";
import { UserBalances } from "../lib/types";

export const Balances: React.FC<{
  balances: UserBalances;
  isLoading: boolean;
}> = ({ balances, isLoading }) => {
  if (!balances) {
    return null;
  }

  useEffect(() => {
    if (isLoading) {
      setTimeout((isLoading) => {
        if (isLoading) {
          console.log("still loading... Reload the page!");
          window.location.reload();
        }
      }, 5000);
    }
  }, [isLoading]);

  return (
    <p>
      <span>
        {isLoading
          ? "loading..."
          : `IOTA: ${formatNumber(balances.iota, "compact")}`}
      </span>{" "}
      <FontAwesomeIcon icon={faCoins} />{" "}
      <span>
        {isLoading
          ? "loading..."
          : `SPAM: ${formatNumber(balances.spam, "compact")}`}
      </span>
    </p>
  );
};

export const AddressAndBalances: React.FC<{
  address: string;
  balances: UserBalances;
  isLoading: boolean;
}> = ({ address, balances, isLoading }) => {
  return (
    <>
      <div>{shortenStuff(address)} </div>
      <div className="tight">
        <Balances balances={balances} isLoading={isLoading} />
      </div>
    </>
  );
};

export const BalanceIOTA: React.FC<{
  balances: UserBalances;
  isLoading: boolean;
}> = ({ balances, isLoading }) => {
  if (!balances) {
    return null;
  }
  return (
    <p className="text-red">
      <span>
        {isLoading
          ? "loading..."
          : `${formatNumber(balances.iota, "compact")} IOTA`}
      </span>
    </p>
  );
};
