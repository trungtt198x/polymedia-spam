import {
  UserCounter,
  EXPLORER,
  SPAM_TX_LOW_BALANCE,
  IS_DISABLED,
  UPDATE_INTERVAL_MS,
  FETCH_LEADER_BOARD_INTERVAL_MS,
  SPAM_IDS,
  shortenStuff,
  ClaimData,
  DEFAULT_NETWORK,
} from "@polymedia/spam-sdk";
import { LinkExternal } from "@polymedia/suitcase-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../lib/types";
import { PageDisclaimer } from "./PageDisclaimer";
import { TextWithCopyClipboard } from "../components/TextWithCopyClipboard";
import { HrefLink } from "../components/HrefLink";
import { EventLog } from "../components/EventLog";
import { BalanceIOTA, AddressAndBalances } from "../components/Balances";
import { EpochData, formatEpochPeriod, getEpochTimes } from "../lib/epochs";
import { LeaderBoard } from "../components/LeaderBoard";

export const PageSpam: React.FC = () => {
  const { network, balances, spammer, spamView, disclaimerAccepted } =
    useOutletContext<AppContext>();
  const [currEpoch, setCurrEpoch] = useState<EpochData>();

  const [leaderBoard, setLeaderBoard] = useState<ClaimData | null>(null);

  const isLoading =
    spamView.counters.epoch === -1 || balances.iota === -1 || !currEpoch;

  const signerAddress = spammer.current.getSpamClient().signer.toIotaAddress();
  // const claimAddress = spammer.current.getClaimAddress() || signerAddress;

  const spamPackageId = SPAM_IDS[network].packageId;
  const explorerCoin = `${EXPLORER[network]}/coin/${spamPackageId}::spam::SPAM`;

  const btnStylesHandleCounter = {
    padding: "0.5em 1em",
    margin: "0",
    fontWeight: "400",
  };

  useEffect(() => {
    setCurrEpoch(undefined);
    updateCurrEpoch();
    fetchLeaderBoard();

    const updateCurrEpochTimer = setInterval(
      updateCurrEpoch,
      UPDATE_INTERVAL_MS,
    );
    const fetchLeaderBoardTimer = setInterval(
      fetchLeaderBoard,
      FETCH_LEADER_BOARD_INTERVAL_MS,
    );

    return () => {
      clearInterval(updateCurrEpochTimer);
      clearInterval(fetchLeaderBoardTimer);
    };
  }, [spammer.current, network]);

  const startLoop = (evt: Event) => {
    evt.preventDefault();
    if (spammer.current.status === "stopped") {
      spammer.current.start(true);
    }
  };

  // const startOnce = (evt: Event) => {
  //   evt.preventDefault();
  //   if (spammer.current.status === "stopped") {
  //     spammer.current.start(false);
  //   }
  // };

  const stop = () => {
    if (spammer.current.status === "running") {
      spammer.current.stop();
    }
  };

  const updateCurrEpoch = async () => {
    try {
      const iotaState = await spammer.current
        .getIotaClient()
        .getLatestIotaSystemState();
      setCurrEpoch({
        epochNumber: Number(iotaState.epoch),
        durationMs: Number(iotaState.epochDurationMs),
        startTimeMs: Number(iotaState.epochStartTimestampMs),
      });
    } catch (_err) {
      console.warn("epoch update failed");
    }
  };

  const fetchLeaderBoard = async () => {
    const res = await spammer.current.getSpamClient().fetchLeaderClaimUsers();
    if (res) {
      setLeaderBoard(res);
    }
  };

  if (!disclaimerAccepted && DEFAULT_NETWORK === "mainnet") {
    return <PageDisclaimer />;
  }

  const counters = spamView.counters;
  const hasCounters = Boolean(
    counters.current ||
      counters.register ||
      counters.claim.length > 0 ||
      counters.delete.length > 0,
  );

  let showProcessCountersButton = false;
  const actionableCounters: string[] = [];
  // const actionableCounters: string[] = ["Register", "Claim", "Delete"];
  if (hasCounters && spammer.current.status === "stopped") {
    if (counters.register?.registered === false) {
      actionableCounters.push("register");
    }
    if (counters.claim.length > 0) {
      actionableCounters.push("claim");
    }
    if (counters.delete.length > 0) {
      actionableCounters.push("delete");
    }
    showProcessCountersButton = actionableCounters.length > 0;
  }

  const TopUp: React.FC = () => {
    if (isLoading || !(balances.iota < SPAM_TX_LOW_BALANCE) || IS_DISABLED) {
      return null;
    }
    let message: React.ReactNode;
    const fundingMsg = "Fund your Spam bot account with IOTA tokens";
    if (counters.register?.registered === false) {
      message = (
        <p className="text-green">{fundingMsg} to register the counter!</p>
      );
    } else if (counters.claim.length) {
      message = (
        <p className="text-green">
          {fundingMsg} to claim the counter
          {counters.claim.length > 1 ? "s" : ""}
        </p>
      );
    } else {
      message = <p className="text-red">{fundingMsg}</p>;
    }
    return (
      <>
        {message}
        <TextWithCopyClipboard
          text={signerAddress}
          className={"iota-address"}
        />
        <br />
        <BalanceIOTA />
      </>
    );
  };

  const SpamOrStopButton: React.FC = () => {
    if (isLoading || balances.iota < SPAM_TX_LOW_BALANCE || IS_DISABLED) {
      return null;
    }
    if (spammer.current.status === "stopped") {
      return (
        <>
          {showProcessCountersButton ? (
            <>
              <br />
              {/* <button className="btn break-all" onClick={startOnce}>
                {actionableCounters.join(" + ")} Counters
              </button> */}
              <span className="blink-loop">
                You have counter(s) to {actionableCounters.join(" & ")}
              </span>
            </>
          ) : (
            <button className="btn-green" onClick={startLoop}>
              Start Spamming
            </button>
          )}
        </>
      );
    } else if (spammer.current.status === "running") {
      return (
        <button className="btn-red" onClick={stop} onMouseDown={stop}>
          Stop Spamming
        </button>
      );
    } else {
      return (
        <button className="btn" disabled>
          Stopping
        </button>
      );
    }
  };

  const CounterCard: React.FC<{
    type: "current" | "register" | "claim" | "delete";
    counter: UserCounter;
  }> = ({ type, counter }) => {
    let txClass = "";
    let status: React.ReactNode;
    if (type === "current") {
      if (spammer.current.status === "running") {
        status = "Spamming...";
        txClass = "blink";
      } else {
        status =
          balances.iota < SPAM_TX_LOW_BALANCE
            ? "Top up your wallet to spam this counter"
            : `Ready to spam. Can be registered on epoch ${counter.epoch + 1}.`;
      }
    } else if (type === "register") {
      if (counter.registered) {
        status = `✅ Registered, possible to mint $SPAM from epoch ${counter.epoch + 2}`;
      } else if (spammer.current.status === "running") {
        status = "⏳ Registering counter...";
      } else {
        status = (
          <>
            <span className="blink-loop">
              🚨 Before epoch {counter.epoch + 1} ends, must
            </span>{" "}
            <button
              className="btn-green"
              style={btnStylesHandleCounter}
              onClick={() => {
                spammer.current.handleCounter(counter.id, "register");
              }}
            >
              register
            </button>
          </>
        );
      }
    } else if (type === "claim") {
      if (spammer.current.status === "running") {
        status = "💰 Minting $SPAM...";
      } else {
        status = (
          <span>
            Registered counter. Can{" "}
            <button
              className="btn-green"
              style={btnStylesHandleCounter}
              onClick={() => {
                spammer.current.handleCounter(counter.id, "claim");
              }}
            >
              claim
            </button>{" "}
            $SPAM at any time
          </span>
        );
      }
    } else {
      if (spammer.current.status === "running") {
        status = "🧹 Deleting counter...";
      } else {
        status = (
          <span>
            Unusable. Please{" "}
            <button
              className="btn-red"
              style={btnStylesHandleCounter}
              onClick={() => {
                spammer.current.handleCounter(counter.id, "delete");
              }}
            >
              delete
            </button>
          </span>
        );
      }
    }

    const epochTimes = currEpoch && getEpochTimes(counter.epoch, currEpoch);

    return (
      <div className={`counter-card ${type}`}>
        <div>
          <div className="counter-epoch">Epoch {counter.epoch}</div>
          <div>
            Counter:
            <HrefLink
              network={network}
              isOnlyExplorer={false}
              isAddress={false}
              hrefEndValue={counter.id}
              hrefDisplay={shortenStuff(counter.id)}
            />
          </div>
        </div>

        <div>
          <div className={txClass}>
            You sent {counter.tx_count} transactions
          </div>
        </div>

        <div>
          <div>{status}</div>
        </div>

        {epochTimes && (
          <div>
            <div>
              {formatEpochPeriod(
                epochTimes.startTime,
                epochTimes.endTime,
                true,
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ExtraData: React.FC = () => {
    return (
      <div className="tight">
        <p>
          Current epoch:
          {isLoading ? (
            "loading... "
          ) : (
            <HrefLink
              network={network}
              isOnlyExplorer={true}
              isAddress={false}
              hrefEndValue=""
              hrefDisplay={counters.epoch}
            />
          )}
        </p>
        <AddressAndBalances
          address={signerAddress}
          balances={balances}
          isLoading={isLoading}
          network={network}
        />
        {/* <p>
          Claim address:
          <HrefLink
            network={network as string}
            isOnlyExplorer={false}
            isAddress={true}
            hrefEndValue={claimAddress}
            hrefDisplay={shortenStuff(claimAddress)}
          />
        </p> */}
      </div>
    );
  };

  return (
    <>
      <h1>
        <span className="rainbow">Spam Club</span>
      </h1>
      <h2>
        Spam the network and earn{" "}
        <LinkExternal href={explorerCoin} follow={true}>
          $SPAM
        </LinkExternal>{" "}
        token
      </h2>
      <div>
        <ExtraData />

        <TopUp />

        <SpamOrStopButton />

        {hasCounters && (
          <>
            <br />
            <br />
            <div className="counter-cards">
              <h2>Your counter(s)</h2>
              {counters.current && (
                <CounterCard type="current" counter={counters.current} />
              )}
              {counters.register && (
                <CounterCard type="register" counter={counters.register} />
              )}
              {counters.claim.map((counter) => (
                <CounterCard type="claim" counter={counter} key={counter.id} />
              ))}
              {counters.delete.map((counter) => (
                <CounterCard type="delete" counter={counter} key={counter.id} />
              ))}
            </div>
          </>
        )}

        <LeaderBoard data={leaderBoard} network={network} />

        <EventLog spamView={spamView} msgFilter={"counter"} network={network} />
      </div>
    </>
  );
};
