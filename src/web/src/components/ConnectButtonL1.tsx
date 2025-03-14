import { ConnectModal, useCurrentAccount, useDisconnectWallet } from '@iota/dapp-kit';
import '@iota/dapp-kit/dist/index.css';

export function ConnectButtonL1() {
    const account = useCurrentAccount();
    const { mutate: disconnectWallet } = useDisconnectWallet();

    return !account ? (
        <ConnectModal
            trigger={
                <div>
                    <button className="btn">
                        Connect Wallet
                    </button>
                </div>
            }
        />
    ) : (
        <div>
            <button className="btn" onClick={() => disconnectWallet()}>
                Disconnect
            </button>
        </div>
    );
}
