const CurrentRPC: React.FC<{ rpcUrl: string }> = ({ rpcUrl }) => {
    return (
        <div className="tight">
            <h2>Current RPC</h2>
            <span className="iota-address">
                {/* {spammer.current.getSpamClient().rpcUrl} */}
                {rpcUrl}
            </span>
            <br />
            <br />
        </div>
    );
};