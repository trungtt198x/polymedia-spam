import { formatNumber } from "@polymedia/suitcase-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { UserBalances } from "../lib/types";

export const Balances: React.FC<{
  balances: UserBalances;
  isLoading: boolean;
}> = ({ balances, isLoading }) => {
  if (!balances) {
    return null;
  }
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
