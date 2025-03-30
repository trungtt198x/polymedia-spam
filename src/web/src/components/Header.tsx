import { Link } from "react-router-dom";
import { InstructionModal } from "./InstructionModal";
import { WalletModal } from "./WalletModal";
import { RPCsModal } from "./RPCsModal";
import { StatusSpan } from "./StatusSpan";

export const Header: React.FC<{
  inProgress: boolean;
  explorerCoin: string;
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: (...args: any[]) => any;
  updateClaimAddress: (...args: any[]) => any;
  currentClaimAddr: string;
  network: string;
  rpcUrls: RpcUrl[];
  updateRpcUrls: (...args: any[]) => any;
  spammerStatus: string;
}> = ({
  inProgress,
  explorerCoin,
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
  currentClaimAddr,
  network,
  rpcUrls,
  updateRpcUrls,
  spammerStatus,
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
            <img alt="" src="/img/spamclub.gif" style={{ width: "8rem" }} />
          </span>
        </h1>
      </Link>

      <h1 style={{ paddingTop: "1rem" }}>
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
          <InstructionModal explorerCoin={explorerCoin} />
        </span>
        <span>
          <RPCsModal
            network={network}
            rpcUrls={rpcUrls}
            updateRpcUrls={updateRpcUrls}
          />
        </span>
        <span style={{ width: "3rem" }}>
          <StatusSpan status={spammerStatus} textOnly={false} />
        </span>
      </h1>
    </header>
  );
};
