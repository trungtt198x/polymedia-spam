import { LinkExternal } from "@polymedia/suitcase-react";
import { hrStyles } from "./modalStyle";

export const Introduction: React.FC<{ explorerCoin: string }> = ({
  explorerCoin,
}) => {
  return (
    <>
      <div id="page-wallet">
        <h1 style={{ textAlign: "center" }}>Instructions</h1>
        <br />
        <p>
          <LinkExternal href={explorerCoin} follow={true}>
            $SPAM
          </LinkExternal>{" "}
          is a token distributed daily to active participants who engage in
          spamming activities.
        </p>
        <p>
          A total of 1 billion $SPAM coins are minted every 24 hours and
          allocated based on spam volume.
        </p>

        <br />

        <h3>How it works</h3>
        <ol>
          <li>Start spamming. </li>
          <li>
            Register counter within the next day. Otherwise accrued $SPAM is
            forfeited.{" "}
          </li>
          <li>Claim $SPAM coins anytime after that. </li>
          <li>Redeem $SPAM for NFTs. </li>
        </ol>

        <hr style={hrStyles} />

        <h3>Getting started</h3>
        <ol>
          <li>Fund your Spam Bot Wallet. </li>
          <li>Spam to Earn. The more you spam, the bigger your rewards.</li>
          <li>Claim your earned $SPAM anytime. </li>
        </ol>

        <hr style={hrStyles} />

        <h3>No spam, no gain. Spam or be rekt.</h3>
      </div>
    </>
  );
};
