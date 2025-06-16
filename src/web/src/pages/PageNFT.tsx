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
  shortenStuff,
  isValidIotaAddress,
  DEFAULT_NETWORK,
} from "@polymedia/spam-sdk";
import { LinkExternal } from "@polymedia/suitcase-react";
import { formatNumber } from "@polymedia/suitcase-core";
import { useEffect, useState, useRef } from "react";
import { useOutletContext, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../lib/types";
import { PageDisclaimer } from "./PageDisclaimer";
import { ConnectButtonL1 } from "../components/ConnectButtonL1";
import { HrefLinkTx } from "../components/HrefLinkTx";
import { EventLog } from "../components/EventLog";
import { AddressAndBalances } from "../components/Balances";
import { useCurrentAccount } from "@iota/dapp-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

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
  const explorerCoin = `${EXPLORER[network]}/coin/${spamPackageId}::spam::SPAM`;
  const nftMintPrice = spamClient.nftMintPrice;

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

    let coinResp;
    try {
      coinResp = await _iotaClient.getCoins({
        owner: coinOwner,
        coinType: `${spamPackageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`,
      });

      console.log("coinResp", coinResp);
    } catch (err) {
      console.error("Error fetching coins:", err);
      toast.error("Error fetching coins");
      return;
    }

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

  if (!disclaimerAccepted && DEFAULT_NETWORK === "mainnet") {
    return <PageDisclaimer />;
  }

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
    const txDisplay = `Transaction: ${shortenStuff(digest)}`;
    return (
      <>
        <p>NFT minted to {shortenStuff(to)}</p>
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
    return (
      <>
        <h3>
          Spam the network to earn{" "}
          <LinkExternal href={explorerCoin} follow={true}>
            $SPAM
          </LinkExternal>{" "}
          token for NFTs
        </h3>

        <Link className="btn" to="/">
          Spam up
        </Link>
      </>
    );
  };

  const MintForm: React.FC<{ isFromMinerWallet: boolean }> = ({
    isFromMinerWallet,
  }) => {
    const [receivingAddress, setReceivingAddress] = useState("");
    const [connectedWalletBalances, setConnectedWalletBalances] =
      useState(null);
    const account = useCurrentAccount();

    useEffect(() => {
      if (account) {
        iotaWalletClient.getBalances(account.address).then((balances) => {
          setConnectedWalletBalances(balances);
        });
      }
    }, [account]);

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
            <AddressAndBalances
              address={minerAddress}
              balances={balances}
              isLoading={isLoading}
              network={network}
            />
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

            {account && spammer.current.status !== "running" && (
              <>
                <AddressAndBalances
                  address={account.address}
                  balances={connectedWalletBalances}
                  isLoading={false}
                  network={network}
                />
              </>
            )}

            <ConnectButtonL1 />
            <br />
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

  // if (DEFAULT_NETWORK !== "mainnet") {
  //   return (
  //     <>
  //       <h1>
  //         <span className="rainbow">NFT</span>
  //       </h1>
  //       <h2>Coming on mainnet</h2>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="event-section">
        <br />
        <h1>
          <span className="rainbow">NFT</span>
        </h1>
        <h2>{new Intl.NumberFormat().format(nftMintPrice)} $SPAM tokens per NFT</h2>

        {spammer.current.status === "running" && (
          <>
            <h3 className="blink-loop">Please stop spamming before NFT mint</h3>
            <span>
              <Link className="btn-red" to="/">
                <FontAwesomeIcon icon={faBackward} size="xs" /> Stop Spamming
              </Link>
            </span>
            <br />
          </>
        )}
      </div>
      <br />
      <br />
      <br />
      <div
        className={spammer.current.status === "running" ? "div-disabled" : ""}
      >
        <div id="page-wallet">
          <div id="page-wallet-sections">
            <MintForm isFromMinerWallet={true} />

            <MintForm isFromMinerWallet={false} />
          </div>
        </div>
      </div>

      <EventLog spamView={spamView} msgFilter={"nft"} network={network} />
    </>
  );
};
