import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  IotaClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@iota/dapp-kit";
import { DEFAULT_NETWORK } from "@polymedia/spam-sdk";
import { getFullnodeUrl } from "@iota/iota-sdk/client";
import { App } from "./App";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();
export const AppIotaProviders = () => {
  // const [network, setNetwork] = useState<string>(DEFAULT_NETWORK);
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} network={DEFAULT_NETWORK}>
        <WalletProvider autoConnect={true}>
          <App />
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
};
