import { useMemo } from "react";
import { useIotaClient, useSignTransaction } from "@iota/dapp-kit";
import {
    IotaWalletClient,
} from "@polymedia/spam-sdk";

const useIotaWalletClient = (network: string, loadedNetwork: string) => {
    const iotaClient = useIotaClient();
    const { mutateAsync: walletSignTx } = useSignTransaction();

    const iotaWalletClient = useMemo(() => {
        return new IotaWalletClient(
            iotaClient,
            (transaction) => walletSignTx({ transaction }),
            loadedNetwork,
        );
    }, [iotaClient, walletSignTx, network]);
    return { iotaWalletClient };
};

export default useIotaWalletClient;