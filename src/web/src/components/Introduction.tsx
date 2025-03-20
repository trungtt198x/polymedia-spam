import { SPAM_IDS, EXPLORER } from "@polymedia/spam-sdk";
import { LinkExternal } from "@polymedia/suitcase-react";
import { Link } from "react-router-dom";

export const Introduction: React.FC<{ explorerCoin: string }> = ({
  explorerCoin,
}) => {
  // const { network } = useOutletContext<AppContext>();
  // const spamPackageId = SPAM_IDS[network].packageId;
  // const explorerCoin = `${EXPLORER[network]}/coin/${spamPackageId}::spam::SPAM`;

  return (
    <div>
      Proof of Spam on IOTA
      <div>
        <div>
          <p>
            One billion{" "}
            <LinkExternal href={explorerCoin} follow={true}>
              $SPAM
            </LinkExternal>{" "}
            coins are minted every day and split between users. The more you
            spam, the more $SPAM you receive.
          </p>
        </div>
      </div>
      <b>Rules</b>
      <div>
        <p>▸ Start spamming. </p>
        <p>
          ▸ Must register counter within the next day. Otherwise accrued $SPAM
          is forfeited.{" "}
        </p>
        <p>▸ Claim $SPAM coins anytime after that. </p>
        <p>▸ Redeem $SPAM for NFTs. </p>
      </div>
      <b>How To</b>
      <div>
        <p>
          ▸ Setup and fund the miner <Link to="/wallet">wallet</Link>
        </p>
        <p>▸ Choose Mainnet or Testnet</p>
        <p>
          ▸ Start <Link to="/spam">spamming</Link>
        </p>
        <p>
          ▸ Redeem $SPAM for <Link to="/nft">NFTs</Link>
        </p>
        <p>
          ▸ RPC too slow? Change it <Link to="/rpcs">here</Link>
        </p>
        <i>
          Need Testnet $IOTA? Hit{" "}
          <LinkExternal href="https://docs.iota.org/about-iota" follow={true}>
            Connect Wallet
          </LinkExternal>{" "}
          button.
        </i>
      </div>
    </div>
  );
};
