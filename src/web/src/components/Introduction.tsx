import { SPAM_IDS, EXPLORER } from "@polymedia/spam-sdk";
import { LinkExternal } from "@polymedia/suitcase-react";
import { Link } from "react-router-dom";

export const Introduction: React.FC<{ explorerCoin: string }> = ({
  explorerCoin,
}) => {
  return (
    <>
      <div id="page-wallet">
        <h1 style={{ textAlign: "center" }}>How does it work?</h1>
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

        <b>How it works</b>
        <ol>
          <li>Start spamming. </li>
          <li>
            Register counter within the next day. Otherwise accrued $SPAM is
            forfeited.{" "}
          </li>
          <li>Claim $SPAM coins anytime after that. </li>
          <li>Redeem $SPAM for NFTs. </li>
        </ol>

        <br />

        <b>Getting started</b>
        <ol>
          <li>Fund your Spam Bot Wallet. </li>
          <li>Spam to Earn. The more you spam, the bigger your rewards.</li>
          <li>Claim your earned $SPAM anytime. </li>
        </ol>

        <br />

        <b>No spam, no gain. Spam or be rekt.</b>
      </div>
    </>
  );
};
