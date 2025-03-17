import { SPAM_IDS, EXPLORER } from "@polymedia/spam-sdk";
import { LinkExternal } from "@polymedia/suitcase-react";
import { useOutletContext, Link } from "react-router-dom";
import { AppContext } from "../lib/types";

export const PageHome: React.FC = () => {
  const { network } = useOutletContext<AppContext>();
  const spamPackageId = SPAM_IDS[network].packageId;

  const explorerCoin = `${EXPLORER[network]}/coin/${spamPackageId}::spam::SPAM`;

  return (
    <div id="page-home">
      <div id="home-content">
        <h1>
          <span className="rainbow">Spam Club</span>
        </h1>

        <img id="img-cult" src="img/spam-home.png" alt="cult" />
      </div>

      <br />

      <div id="page-wallet">
        <h2>Proof of Spam on IOTA</h2>
        <div id="page-wallet-sections">
          <div className="tight">
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
      </div>

      <div id="page-wallet">
        <h2>Rules</h2>
        <div id="page-wallet-sections">
          <div className="tight">
            <p>▸ Start spamming. </p>
            <p>
              ▸ Must register counter within the next day. Otherwise accrued
              $SPAM is forfeited.{" "}
            </p>
            <p>▸ Claim $SPAM coins anytime after that. </p>
            <p>▸ Redeem $SPAM for NFTs. </p>
          </div>
        </div>

        <h2>How To</h2>
        <div id="page-wallet-sections">
          <div className="tight">
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
              <LinkExternal
                href="https://docs.iota.org/about-iota"
                follow={true}
              >
                Connect Wallet
              </LinkExternal>{" "}
              button.
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};
