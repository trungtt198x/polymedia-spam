import { Link } from "react-router-dom";
import { InstructionModal } from "./InstructionModal";
import { WalletModal } from "./WalletModal";
import { RPCsModal } from "./RPCsModal";

export const Header: React.FC<{
  inProgress: boolean;
  explorerCoin: string;
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: (...args: any[]) => any;
  updateClaimAddress: (...args: any[]) => any;
  currentClaimAddr: string;
}> = ({
  inProgress,
  explorerCoin,
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
  currentClaimAddr,
}) => {
  return (
    <header>
      <Link
        to="/"
        onClick={(e) => {
          inProgress && e.preventDefault();
        }}
      >
        <h1>
          <span>
            <img alt="polymedia" src="/img/spam-logo.png" />
          </span>
        </h1>
      </Link>

      <h1 style={{ paddingTop: "1rem" }}>
        <span>
          <InstructionModal explorerCoin={explorerCoin} />
        </span>
        <span>
          <WalletModal
            spammerCurrentAddress={spammerCurrentAddress}
            spammerCurrentKey={spammerCurrentKey}
            replaceKeypair={replaceKeypair}
            updateClaimAddress={updateClaimAddress}
            currentClaimAddr={currentClaimAddr}
          />
        </span>
        <span>
          <RPCsModal explorerCoin={explorerCoin} />
        </span>
      </h1>
    </header>
  );
};
