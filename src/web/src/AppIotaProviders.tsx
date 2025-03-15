import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectModal, IotaClientProvider, WalletProvider, createNetworkConfig } from "@iota/dapp-kit";
import { useState } from "react";
import { getFullnodeUrl } from "@iota/iota-sdk/client";
import { App } from "./App";

const defaultNetwork = "testnet";

const supportedNetworks = ["testnet", "mainnet"] as const;

type SupportedNetwork = typeof supportedNetworks[number];

const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();
export const AppIotaProviders = () => {
    const [network, setNetwork] = useState<SupportedNetwork>(defaultNetwork);
    return (
        <QueryClientProvider client={queryClient}>
            <IotaClientProvider networks={networkConfig} network={network}>
                <WalletProvider autoConnect={true}>
                    <App />
                </WalletProvider>
            </IotaClientProvider>
        </QueryClientProvider>
    );
};