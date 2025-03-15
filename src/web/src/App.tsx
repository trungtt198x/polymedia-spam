import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import {
    SPAM_DECIMALS,
    SPAM_MODULE,
    SPAM_SYMBOL,
    IOTA_DECIMALS,
    DEFAULT_NETWORK,
    SpamEvent,
    Spammer,
    emptyUserCounters,
    IotaWalletClient,
} from "@polymedia/spam-sdk";
import { sleep } from "@polymedia/suitcase-core";
import { LinkExternal, NetworkDropdownSelector } from "@polymedia/suitcase-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { PageAbout } from "./PageAbout";
import { PageNFT } from "./PageNFT";
import { PageHome } from "./PageHome";
import { PageNotFound } from "./PageNotFound";
import { PageRPCs } from "./PageRPCs";
import { PageSpam } from "./PageSpam";
import { PageStats } from "./PageStats";
import { PageWallet } from "./PageWallet";

import {
    RpcUrl,
    loadClaimAddressFromStorage,
    loadKeypairFromStorage,
    loadRpcUrlsFromStorage,
    saveClaimAddressToStorage,
    saveDisclaimerAcceptedToStorage,
    saveKeypairToStorage,
    saveRpcUrlsToStorage,
} from "./lib/storage";
import { SpamView, UserBalances } from "./lib/types";
import "./styles/.shared.app.less";
import "./styles/App.less";

import { ConnectModal, IotaClientProvider, useIotaClient, useSignTransaction, WalletProvider } from "@iota/dapp-kit";
import { defaultNetwork, networkConfig, packageIds, SupportedNetwork } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConnectButtonL1 } from "./components/ConnectButtonL1";
import { Header } from "./components/Header";
import { Nav } from "./components/Nav";

import { Toaster } from 'react-hot-toast';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppIotaProviders />} >
                    <Route index element={<PageHome />} />
                    <Route path="/about" element={<PageAbout />} />
                    <Route path="/spam" element={<PageSpam />} />
                    <Route path="/nft" element={<PageNFT />} />
                    <Route path="/wallet" element={<PageWallet />} />
                    <Route path="/rpcs" element={<PageRPCs />} />
                    <Route path="/stats" element={<PageStats />} />
                    <Route path="*" element={<PageNotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};


const supportedNetworks = ["mainnet", "testnet"] as const;
type NetworkName = typeof supportedNetworks[number];
const loadedNetwork = DEFAULT_NETWORK;

/* App */

export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type AppContext = {
    network: NetworkName;
    rpcUrls: RpcUrl[]; updateRpcUrls: (newRpcs: RpcUrl[]) => Promise<void>;
    balances: UserBalances;
    spammer: React.MutableRefObject<Spammer>;
    iotaWalletClient: IotaWalletClient;
    spamView: SpamView;
    replaceKeypair: (keypair: Ed25519Keypair) => void;
    updateClaimAddress: (claimAddress: string) => void;
    disclaimerAccepted: boolean; acceptDisclaimer: () => void;
};

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
const loadedRpcs = loadRpcUrlsFromStorage(loadedNetwork);

const queryClient = new QueryClient();
const AppIotaProviders = () => {
    const [network, setNetwork] = useState<SupportedNetwork>(defaultNetwork);
    return (
        <QueryClientProvider client={queryClient}>
            <IotaClientProvider networks={networkConfig} network={network}>
                <WalletProvider autoConnect={true}>
                    {/* <App network={network} setNetwork={setNetwork} /> */}
                    <App />
                </WalletProvider>
            </IotaClientProvider>
        </QueryClientProvider>
    );
};

const App: React.FC = () => {
    const inProgress = false;
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [network, setNetwork] = useState(loadedNetwork);
    const [pair, setPair] = useState<Ed25519Keypair>(loadedPair);
    const [rpcUrls, setRpcUrls] = useState<RpcUrl[]>(loadedRpcs);
    const [balances, setBalances] = useState<UserBalances>(emptyBalances());
    const [spamView, setSpamView] = useState<SpamView>(emptySpamView());
    const spammer = useRef(new Spammer(
        loadedPair,
        loadedNetwork,
        loadedRpcs.filter(rpc => rpc.enabled).map(rpc => rpc.url),
        handleSpamEvent,
        loadClaimAddressFromStorage(),
    ));
    const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(true);

    ////////////
    const iotaClient = useIotaClient();
    const { mutateAsync: walletSignTx } = useSignTransaction();

    const iotaWalletClient = useMemo(() => {
        return new IotaWalletClient(
            iotaClient,
            (transaction) => walletSignTx({ transaction }),
            loadedNetwork,
        );
    }, [iotaClient, walletSignTx, network]);
    ///////////

    const appContext: AppContext = {
        network,
        rpcUrls, updateRpcUrls,
        balances,
        spammer,
        spamView,
        replaceKeypair: updateKeypair,
        updateClaimAddress,
        disclaimerAccepted, acceptDisclaimer,
        iotaWalletClient
    };

    /* Functions */

    useEffect(() => {
        setSpamView(emptySpamView());
        setBalances(emptyBalances());

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
                owner: spammer.current.getSpamClient().signer.toIotaAddress(),
            });
            const balanceSpam = await spammer.current.getIotaClient().getBalance({
                owner: spammer.current.getSpamClient().signer.toIotaAddress(),
                coinType: `${spammer.current.getSpamClient().spamPackageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`,
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
            const counters = await spammer.current.getSpamClient().fetchUserCountersAndClassify();
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
        setSpamView(oldView => {
            if (e.type !== "debug") {
                // Only show non-debug events to the user
                oldView.events.push({
                    time: (new Date).toLocaleTimeString(),
                    msg: e.msg,
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

    function updateKeypair(newPair: Ed25519Keypair): void {
        if (spammer.current.status === "running") {
            spammer.current.stop();
        }
        spammer.current = new Spammer(
            newPair,
            network,
            rpcUrls.filter(rpc => rpc.enabled).map(rpc => rpc.url),
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
            newRpcs.filter(rpc => rpc.enabled).map(rpc => rpc.url),
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
            loadedRpcs.filter(rpc => rpc.enabled).map(rpc => rpc.url),
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
                <Header status={spammer.current.status} inProgress={inProgress} />
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
            </div>

            <Footer />

            <button
                id="btn-menu"
                disabled={inProgress}
                onClick={() => { setShowMobileNav(!showMobileNav); }}
            >
                {!showMobileNav ? "MENU" : "CLOSE"}
            </button>
        </div>
    );
};
