import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import {
  SPAM_DECIMALS,
  IOTA_DECIMALS,
  DEFAULT_NETWORK,
  SpamEvent,
  Spammer,
  emptyUserCounters,
  EXPLORER,
  SPAM_IDS,
  SHOW_EVENT_TYPE,
  getSpamCoinType,
} from "@polymedia/spam-sdk";
import { sleep } from "@polymedia/suitcase-core";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  RpcUrl,
  loadClaimAddressFromStorage,
  loadKeypairFromStorage,
  loadRpcUrlsFromStorage,
  saveClaimAddressToStorage,
  saveDisclaimerAcceptedToStorage,
  loadDisclaimerAcceptedFromStorage,
  saveKeypairToStorage,
  saveRpcUrlsToStorage,
} from "./lib/storage";
import {
  SpamView,
  UserBalances,
  AppContext,
  supportedNetworks,
  NetworkName,
} from "./lib/types";
import "./styles/.shared.app.less";
import "./styles/App.less";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";

import useIotaWalletClient from "./hooks/useIotaWalletClient";

const emptySpamView = (): SpamView => {
  return {
    events: [],
    counters: emptyUserCounters(),
  };
};

const emptyBalances = (): UserBalances => {
  return { iota: -1, spam: -1 };
};

const loadedPair = loadKeypairFromStorage();
const loadedRpcs = loadRpcUrlsFromStorage(DEFAULT_NETWORK);

export const App: React.FC = () => {
  const inProgress = false;
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [pair, setPair] = useState<Ed25519Keypair>(loadedPair);
  const [rpcUrls, setRpcUrls] = useState<RpcUrl[]>(loadedRpcs);
  const [balances, setBalances] = useState<UserBalances>(emptyBalances());
  const [spamView, setSpamView] = useState<SpamView>(emptySpamView());
  const spammer = useRef(
    new Spammer(
      loadedPair,
      DEFAULT_NETWORK,
      loadedRpcs.filter((rpc) => rpc.enabled).map((rpc) => rpc.url),
      handleSpamEvent,
      loadClaimAddressFromStorage(),
    ),
  );
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  const { iotaWalletClient } = useIotaWalletClient(network, DEFAULT_NETWORK, handleSpamEvent);

  const appContext: AppContext = {
    network,
    rpcUrls,
    updateRpcUrls,
    balances,
    spammer,
    spamView,
    replaceKeypair,
    updateClaimAddress,
    disclaimerAccepted,
    acceptDisclaimer,
    iotaWalletClient,
  };

  const spamPackageId = SPAM_IDS[network].packageId;
  const explorerCoin = `${EXPLORER[network]}/coin/${spamPackageId}::spam::SPAM`;
  const spammerClient = spammer.current.getSpamClient();
  const signerAddress = spammerClient.signer.toIotaAddress();

  /* Functions */

  useEffect(() => {
    setSpamView(emptySpamView());
    setBalances(emptyBalances());
    setDisclaimerAccepted(loadDisclaimerAcceptedFromStorage);

    updateSpamView();
    updateBalances();

    /* repaint periodically */

    const updateFrequency = network === "localnet" ? 5_000 : 20_000;
    const updatePeriodically = setInterval(updateBalances, updateFrequency);

    /* clean up on component unmount */

    return () => {
      clearInterval(updatePeriodically);
    };
  }, [network, pair]);

  const updateBalances = async () => {
    try {
      const balanceIOTA = await spammer.current.getIotaClient().getBalance({
        owner: spammerClient.signer.toIotaAddress(),
      });
      const balanceSpam = await spammer.current.getIotaClient().getBalance({
        owner: spammerClient.signer.toIotaAddress(),
        coinType: getSpamCoinType(network), // `${spammerClient.spamPackageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`,
      });
      setBalances({
        spam: Number(balanceSpam.totalBalance) / 10 ** SPAM_DECIMALS,
        iota: Number(balanceIOTA.totalBalance) / 10 ** IOTA_DECIMALS,
      });
    } catch (_err) {
      console.warn("balance update failed:", _err?.message);
    }
  };

  const updateSpamView = async (): Promise<void> => {
    try {
      const counters = await spammer.current
        .getSpamClient()
        .fetchUserCountersAndClassify();
      setSpamView({
        events: [],
        counters,
      });
      // console.info("view updated");
    } catch (_err) {
      console.warn("view reset failed");
    }
  };

  function handleSpamEvent(e: SpamEvent): void {
    console[e.type](e.msg);
    setSpamView((oldView) => {
      if (e.type === SHOW_EVENT_TYPE) {
        // Only show non-debug events to the user
        oldView.events.push({
          time: new Date().toLocaleTimeString(),
          msg: e.msg,
          txDigest: e.txDigest,
        });
        // Update balances when the spammer stops
        if (e.msg === "Stopped as requested") {
          updateBalances();
        }
      }
      return {
        events: oldView.events,
        counters: spammer.current.userCounters,
      };
    });
    // console.info("on-demand view update");
  }

  function replaceKeypair(newPair: Ed25519Keypair): void {
    if (spammer.current.status === "running") {
      spammer.current.stop();
    }
    spammer.current = new Spammer(
      newPair,
      network,
      rpcUrls.filter((rpc) => rpc.enabled).map((rpc) => rpc.url),
      handleSpamEvent,
      loadClaimAddressFromStorage(),
    );
    setPair(newPair);
    saveKeypairToStorage(newPair);
  }

  async function updateRpcUrls(newRpcs: RpcUrl[]): Promise<void> {
    const wasRunning = spammer.current.status === "running";
    if (wasRunning) {
      spammer.current.stop();
    }
    spammer.current = new Spammer(
      pair,
      network,
      newRpcs.filter((rpc) => rpc.enabled).map((rpc) => rpc.url),
      handleSpamEvent,
      spammer.current.getClaimAddress(),
    );
    setRpcUrls(newRpcs);
    saveRpcUrlsToStorage(network, newRpcs);
    if (wasRunning) {
      await sleep(3000); // hack, should start after the previous Spammer shuts down
      spammer.current.start(true);
    }
  }

  function updateNetwork(newNet: NetworkName): void {
    if (spammer.current.status === "running") {
      spammer.current.stop();
    }
    const loadedRpcs = loadRpcUrlsFromStorage(newNet);
    spammer.current = new Spammer(
      pair,
      newNet,
      loadedRpcs.filter((rpc) => rpc.enabled).map((rpc) => rpc.url),
      handleSpamEvent,
      spammer.current.getClaimAddress(),
    );
    setNetwork(newNet);
    setRpcUrls(loadedRpcs);
    setShowMobileNav(false);
  }

  function updateClaimAddress(newClaimAddress: string): void {
    spammer.current.setClaimAddress(newClaimAddress);
    saveClaimAddressToStorage(newClaimAddress);
  }

  function acceptDisclaimer(): void {
    setDisclaimerAccepted(true);
    saveDisclaimerAcceptedToStorage();
  }

  const layoutClasses: string[] = [];
  if (showMobileNav) {
    layoutClasses.push("menu-open");
  }
  if (inProgress) {
    layoutClasses.push("disabled");
  }

  return (
    <div id="layout" className={layoutClasses.join(" ")}>
      <div>
        <Header
          inProgress={inProgress}
          explorerCoin={explorerCoin}
          spammerCurrentAddress={spammerClient.signer.toIotaAddress()}
          spammerCurrentKey={(
            spammerClient.signer as Ed25519Keypair
          ).getSecretKey()}
          replaceKeypair={replaceKeypair}
          updateClaimAddress={updateClaimAddress}
          currentClaimAddr={spammer.current.getClaimAddress() || signerAddress}
          network={network}
          rpcUrls={rpcUrls}
          updateRpcUrls={updateRpcUrls}
        />
        <div id="nav-and-page">
          <Nav
            setShowMobileNav={setShowMobileNav}
            inProgress={inProgress}
            network={network}
            supportedNetworks={supportedNetworks}
            updateNetwork={updateNetwork}
          />
          <div id="page">
            <div id="page-content">
              <Outlet context={appContext} />
            </div>
          </div>
        </div>
        <Toaster />
      </div>

      <Footer />

      <button
        id="btn-menu"
        disabled={inProgress}
        onClick={() => {
          setShowMobileNav(!showMobileNav);
        }}
      >
        {!showMobileNav ? "MENU" : "CLOSE"}
      </button>
    </div>
  );
};
