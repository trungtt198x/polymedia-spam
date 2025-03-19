/* eslint-disable */

import {
  UserCounter,
  EXPLORER,
  SPAM_TX_LOW_BALANCE,
  IS_DISABLED,
  UPDATE_INTERVAL_MS,
  SPAM_DECIMALS,
  SPAM_MODULE,
  SPAM_SYMBOL,
  shortenTx,
  isValidIotaAddress,
} from "@polymedia/spam-sdk";
import { formatNumber, shortenAddress } from "@polymedia/suitcase-core";
import { useEffect, useState, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../lib/types";
import { PageDisclaimer } from "./PageDisclaimer";
import { StatusSpan } from "./components/StatusSpan";
import { ConnectButtonL1 } from "../components/ConnectButtonL1";
import { useCurrentAccount } from "@iota/dapp-kit";

export const PageNFT: React.FC = () => {
  const {
    network,
    balances,
    spammer,
    iotaWalletClient,
    spamView,
    disclaimerAccepted,
  } = useOutletContext<AppContext>();

  const [mintFromMinerTxResult, setMintFromMinerTxResult] = useState(null);
  const [mintFromConnectedWalletTxResult, setMintFromConnectedWalletTxResult] =
    useState(null);

  const isLoading = !balances || balances.iota === -1 || balances.spam === -1;

  const spamClient = spammer.current.getSpamClient();
  const minerAddress = spamClient.signer.toIotaAddress();
  const spamPackageId = spamClient.spamPackageId;

  const startMint = async (
    evt: Event,
    receivingAddress: string,
    isFromMinerWallet: boolean,
    currentAccount = null,
  ) => {
    evt.preventDefault();

    let _iotaClient;
    let coinOwner;
    let signer;

    if (isFromMinerWallet) {
      setMintFromMinerTxResult(null);
      _iotaClient = spammer.current.getIotaClient();
      signer = spamClient.signer;
      coinOwner = signer.toIotaAddress();
    } else {
      setMintFromConnectedWalletTxResult(null);
      _iotaClient = iotaWalletClient.iotaClient;

      if (!_iotaClient) {
        toast.error("IOTA wallet client not available");
        return;
      }

      signer = _iotaClient.signTx;
      coinOwner = currentAccount.address;
    }

    if (!isValidIotaAddress(receivingAddress)) {
      toast.error("Invalid receiving address");
      return;
    }

    const coinResp = await _iotaClient.getCoins({
      owner: coinOwner,
      coinType: `${spamPackageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`,
    });

    if (coinResp.data.length === 0) {
      toast.error("No SPAM coins available");
      return;
    }
    const coinFound = coinResp.data.find(
      (coin) => Number(coin.balance) >= 1000 * 10 ** SPAM_DECIMALS,
    );
    if (coinFound.length === 0) {
      toast.error("No SPAM coins available");
      return;
    }

    let resp;
    if (isFromMinerWallet) {
      resp = await spammer.current.mint(
        coinFound.coinObjectId,
        receivingAddress,
      );
    } else {
      resp = await iotaWalletClient.mint(
        coinFound.coinObjectId,
        receivingAddress,
        coinOwner,
        false,
      );
    }

    toast.success(`NFT minted`);

    if (isFromMinerWallet) {
      setMintFromMinerTxResult(`${resp.digest},${receivingAddress}`);
    } else {
      setMintFromConnectedWalletTxResult(`${resp.digest},${receivingAddress}`);
    }
  };

  /* HTML */

  const HrefLink: React.FC<{
    network: string;
    isOnlyExplorer: boolean;
    isAddress: boolean;
    hrefEndValue: string;
    hrefDisplay: string;
  }> = ({ network, isOnlyExplorer, isAddress, hrefEndValue, hrefDisplay }) => {
    let href: string = EXPLORER[network] as string;

    if (!isOnlyExplorer) {
      href += isAddress ? "/address/" : "/object/";
      href += hrefEndValue;
    }

    return (
      <a
        href={href}
        style={{ textDecoration: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        {hrefDisplay}{" "}
      </a>
    );
  };

  const HrefLinkTx: React.FC<{
    network: string;
    hrefEndValue: string;
    hrefDisplay: string;
  }> = ({ network, isAddress, hrefEndValue, hrefDisplay }) => {
    let href: string = EXPLORER[network] as string;
    href += "/tx/";
    href += hrefEndValue;
    // href += `?network=${network}`;

    return (
      <a
        href={href}
        style={{ textDecoration: "none" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        {hrefDisplay}{" "}
      </a>
    );
  };

  if (!disclaimerAccepted) {
    return <PageDisclaimer />;
  }

  const Balances: React.FC = () => {
    if (!balances) {
      return null;
    }
    return (
      <>
        <p>
          IOTA balance:{" "}
          {isLoading ? "loading..." : formatNumber(balances.iota, "compact")}
        </p>
        <p>
          SPAM balance:{" "}
          {isLoading ? "loading..." : formatNumber(balances.spam, "compact")}
        </p>
      </>
    );
  };

  const MintTxResult: React.FC<{ isFromMinerWallet: boolean }> = ({
    isFromMinerWallet,
  }) => {
    let mintTxResult;
    if (isFromMinerWallet) {
      if (!mintFromMinerTxResult) {
        return null;
      }
      mintTxResult = mintFromMinerTxResult;
    } else {
      if (!mintFromConnectedWalletTxResult) {
        return null;
      }
      mintTxResult = mintFromConnectedWalletTxResult;
    }

    const [digest, to] = mintTxResult.split(",");
    const txDisplay = `Transaction: ${shortenTx(digest)}`;
    return (
      <>
        <p>NFT minted to {shortenAddress(to)}</p>
        <HrefLinkTx
          network={network}
          hrefEndValue={digest}
          hrefDisplay={txDisplay}
        />
      </>
    );
  };

  const SpamUp: React.FC = () => {
    if (isLoading || IS_DISABLED) {
      return null;
    }
    let message: React.ReactNode = <p>Top up your wallet to start.</p>;

    return (
      <>
        {message}
        <Link className="btn" to="/spam">
          Spam up
        </Link>
      </>
    );
  };

  const MintForm: React.FC<{ isFromMinerWallet: boolean }> = ({
    isFromMinerWallet,
  }) => {
    const [receivingAddress, setReceivingAddress] = useState("");
    const account = useCurrentAccount();
    const onInputChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      evt.preventDefault();
      const newReceivingAddress = evt.currentTarget.value;
      setReceivingAddress(newReceivingAddress);
    };

    if (isLoading || IS_DISABLED) {
      return null;
    }

    return (
      <div>
        {isFromMinerWallet ? (
          <>
            <button
              className="btn-double"
              onClick={(evt: Event) =>
                startMint(evt, receivingAddress, isFromMinerWallet)
              }
            >
              Mint from miner wallet
            </button>
            <br />
          </>
        ) : (
          <>
            <button
              className="btn-double"
              disabled={!account}
              onClick={(evt: Event) =>
                startMint(evt, receivingAddress, isFromMinerWallet, account)
              }
            >
              Mint from connected wallet
            </button>
            <ConnectButtonL1 />
          </>
        )}

        <input
          type="text"
          value={receivingAddress}
          placeholder="Receiving address"
          onChange={onInputChange}
          style={{ width: "100%", wordBreak: "break-all" }}
        />

        <MintTxResult isFromMinerWallet={isFromMinerWallet} />
      </div>
    );
  };

  return (
    <>
      <h1>
        <span className="rainbow">NFT</span>
      </h1>
      <div>
        <div className="tight">
          <Balances />
        </div>
        {balances?.spam === 0 ? (
          <SpamUp />
        ) : (
          <div id="page-wallet">
            <div id="page-wallet-sections">
              <MintForm isFromMinerWallet={true} />

              <MintForm isFromMinerWallet={false} />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
};
