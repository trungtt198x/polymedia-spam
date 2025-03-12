/* eslint-disable */

import {
    UserCounter, EXPLORER, SPAM_TX_LOW_BALANCE, IS_DISABLED, UPDATE_INTERVAL_MS, SPAM_DECIMALS,
    SPAM_MODULE,
    SPAM_SYMBOL,
} from "@polymedia/spam-sdk";
import { formatNumber, shortenAddress } from "@polymedia/suitcase-core";
// import { LinkToPolymedia } from "@polymedia/suitcase-react";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from "./App";
import { PageDisclaimer } from "./PageDisclaimer";
import { StatusSpan } from "./components/StatusSpan";
import { EpochData, formatEpochPeriod, getEpochTimes } from "./lib/epochs";

export const PageNFT: React.FC = () => {
    /* State */

    const { network, balances, spammer, spamView, disclaimerAccepted } = useOutletContext<AppContext>();

    const [mintTx, setmintTx] = useState(null);

    const isLoading = !balances || balances.iota === -1 || balances.spam === -1;

    /* Functions */

    const startMint = async (evt: Event, receivingAddress = null) => {
        evt.preventDefault();
        setmintTx(null);

        const to = receivingAddress || spammer.current.getSpamClient().signer.toIotaAddress();
        const coinResp = await spammer.current.getIotaClient().getCoins({
            owner: spammer.current.getSpamClient().signer.toIotaAddress(),
            coinType: `${spammer.current.getSpamClient().spamPackageId}::${SPAM_MODULE}::${SPAM_SYMBOL}`,
        });

        if (coinResp.data.length === 0) {
            toast.error("No SPAM coins available");
            return;
        }
        const coinFound = coinResp.data.find((coin) => Number(coin.balance) >= (1000 * 10 ** SPAM_DECIMALS));
        if (coinFound.length === 0) {
            toast.error("No SPAM coins available");
            return;
        }

        const resp = await spammer.current.mint(coinFound.coinObjectId, to);

        toast.success(`NFT minted`);
        setmintTx(resp.digest);
    };

    /* HTML */

    const HrefLink: React.FC<
        { network: string; isOnlyExplorer: boolean; isAddress: boolean; hrefEndValue: string; hrefDisplay: string }
    > = ({ network, isOnlyExplorer, isAddress, hrefEndValue, hrefDisplay }) => {
        let href: string = EXPLORER[network] as string;

        if (!isOnlyExplorer) {
            href += isAddress ? "/address/" : "/object/";
            href += hrefEndValue;
        }

        return <a href={href} style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer"> {hrefDisplay} </a>;
    };

    const HrefLinkTx: React.FC<
        { network: string; hrefEndValue: string; hrefDisplay: string }
    > = ({ network, isAddress, hrefEndValue, hrefDisplay }) => {
        let href: string = EXPLORER[network] as string;
        href += "/tx/";
        href += hrefEndValue;
        // href += `?network=${network}`;

        return <a href={href} style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer"> {hrefDisplay} </a>;
    };

    if (!disclaimerAccepted) {
        return <PageDisclaimer />;
    }

    const counters = spamView.counters;
    const hasCounters = Boolean(
        counters.current || counters.register || counters.claim.length > 0 || counters.delete.length > 0
    );

    let showProcessCountersButton = false;
    const actionableCounters: string[] = [];
    if (hasCounters && spammer.current.status === "stopped") {
        if (counters.register?.registered === false) {
            actionableCounters.push("REGISTER");
        }
        if (counters.claim.length > 0) {
            actionableCounters.push("CLAIM");
        }
        if (counters.delete.length > 0) {
            actionableCounters.push("DELETE");
        }
        showProcessCountersButton = actionableCounters.length > 0;
    }

    const Balances: React.FC = () => {
        if (!balances) {
            return null;
        }
        return <>
            <p>IOTA balance: {isLoading ? "loading..." : formatNumber(balances.iota, "compact")}</p>
            <p>SPAM balance: {isLoading ? "loading..." : formatNumber(balances.spam, "compact")}</p>
        </>;
    };

    const MintTx: React.FC = () => {
        if (!mintTx) {
            return null;
        }
        return <>
            <p>Mint transaction</p>
            <HrefLinkTx network={network} hrefEndValue={mintTx} hrefDisplay={shortenAddress(mintTx)} />
        </>;
    };

    const SpamUp: React.FC = () => {
        if (isLoading || IS_DISABLED) {
            return null;
        }
        let message: React.ReactNode = <p>Top up your wallet to start.</p>;

        return <>
            {message}
            <Link className="btn" to="/spam">
                Spam up
            </Link>
        </>;
    };

    const MintFromMinerWallet: React.FC = () => {
        const [receivingAddress, setReceivingAddress] = useState();
        const [msg, setMsg] = useState<{ type: "okay" | "error"; text: string }>();
        const disableButton = msg?.type === "error" || !receivingAddress;

        useEffect(() => {
            const minerAddress = spammer.current.getSpamClient().signer.toIotaAddress();
            // setReceivingAddress(minerAddress);
        });

        const onInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
            evt.preventDefault();
            const newReceivingAddress = evt.currentTarget.value;

            // if (newReceivingAddress.length === 0) {
            //     setMsg(undefined);
            //     return;
            // }

            const cleanAddress = newReceivingAddress; // validateAndNormalizeAddress(newReceivingAddress);
            // if (!cleanAddress) {
            //     setMsg({ type: "error", text: "Invalid address" });
            //     return;
            // }

            setReceivingAddress(cleanAddress);
            setMsg(undefined);
            console.log("cleanAddress:", cleanAddress);
        };

        // const onKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        //     if (evt.key === "Enter" && !disableButton) {
        //         evt.preventDefault();
        //         onSubmit();
        //     }
        // };

        // const onSubmit = (): void => {
        //     if (receivingAddress) {
        //         try {
        //             updateReceivingAddress(receivingAddress);
        //             setMsg({ type: "okay", text: "Success!" });
        //         } catch (err) {
        //             setMsg({ type: "error", text: String(err) });
        //         }
        //     }
        // };

        if (isLoading || IS_DISABLED) {
            return null;
        }

        return <div>
            <h2>Mint from miner wallet</h2>
            <p>
                Receiving address
            </p>
            <input
                type="text"
                value={receivingAddress}
                onChange={onInputChange}
                // onKeyDown={onKeyDown}
                style={{ width: "100%", wordBreak: "break-all" }}
            />
            <br />
            
            <button className="btn" onClick={(evt: Event, receivingAddress) => startMint(evt, receivingAddress)}>MINT</button>

            <MintTx />
            {msg && <div className={`${msg.type}-box`}>
                <div>{msg.text}</div>
            </div>}
        </div>;
    };

    const CounterCard: React.FC<{
        type: "current" | "register" | "claim" | "delete";
        counter: UserCounter;
    }> = ({
        type,
        counter,
    }) => {
            let txClass = "";
            let status: React.ReactNode;
            if (type === "current") {
                if (spammer.current.status === "running") {
                    status = "Spamming...";
                    txClass = "blink";
                } else {
                    status = (balances.iota < SPAM_TX_LOW_BALANCE)
                        ? "Top up your wallet to spam this counter"
                        : `Ready to spam. Can be registered on epoch ${counter.epoch + 1}.`;
                }
            }
            else if (type === "register") {
                if (counter.registered) {
                    status = `✅ Registered, possible to mint SPAM from epoch ${counter.epoch + 2}`;
                } else if (spammer.current.status === "running") {
                    status = "⏳ Registering counter...";
                } else {
                    status = <span className="blink-loop">🚨 MUST BE REGISTERED before epoch {counter.epoch + 1} ends</span>;
                }
            }
            else if (type === "claim") {
                if (spammer.current.status === "running") {
                    status = "💰 Minting SPAM...";
                } else {
                    status = "✅ Can mint SPAM at any time";
                }
            }
            else {
                if (spammer.current.status === "running") {
                    status = "🧹 Deleting counter...";
                } else {
                    status = "Unusable. Will be deleted.";
                }
            }

            return <div className={`counter-card ${type}`}>
                <div>
                    <div className="counter-epoch">
                        Epoch {counter.epoch}
                    </div>
                    <div>
                        {/* <LinkToPolymedia network={network} kind="object" addr={counter.id} /> */}
                        Counter:
                        <HrefLink network={network} isOnlyExplorer={false} isAddress={false} hrefEndValue={counter.id} hrefDisplay={shortenAddress(counter.id)} />
                    </div>
                </div>

                <div>
                    <div className={txClass}>
                        You sent {counter.tx_count} transactions
                    </div>
                </div>

                <div>
                    <div>
                        {status}
                    </div>
                </div>
            </div>;
        };

    const signerAddress = spammer.current.getSpamClient().signer.toIotaAddress();
    // const claimAddress = spammer.current.getClaimAddress() || signerAddress;

    return <>
        <h1><span className="rainbow">NFT</span></h1>
        <div>

            <div className="tight">
                <Balances />
            </div>
            { balances?.spam === 0 ?
                <SpamUp />
                :   
                <div id="page-wallet">
                    <div id="page-wallet-sections">
                        <MintFromMinerWallet />
                    </div>
                </div>
            }
        </div>
        <Toaster />
    </>;
};
