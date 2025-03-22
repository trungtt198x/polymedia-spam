import { useMemo } from "react";
import { useIotaClient, useSignTransaction } from "@iota/dapp-kit";
import { IotaWalletClient, SpamEventHandler } from "@polymedia/spam-sdk";

const useIotaWalletClient = (network: string, loadedNetwork: string, handleSpamEvent: SpamEventHandler) => {
  const iotaClient = useIotaClient();
  const { mutateAsync: walletSignTx } = useSignTransaction();

  const iotaWalletClient = useMemo(() => {
    return new IotaWalletClient(
      iotaClient,
      (transaction) => walletSignTx({ transaction }),
      loadedNetwork,
      handleSpamEvent,
    );
  }, [iotaClient, walletSignTx, network]);
  return { iotaWalletClient };
};

export default useIotaWalletClient;
