import { Link, useLocation } from "react-router-dom";
import { NetworkDropdownSelector } from "@polymedia/suitcase-react";

export const Nav: React.FC<{
    setShowMobileNav: () => void;
    inProgress: boolean;
    network: string;
    supportedNetworks: string[];
    updateNetwork: (string) => void;
}> = ({
    setShowMobileNav,
    inProgress,
    network,
    supportedNetworks,
    updateNetwork
}) => {
    const closeMobileNav = () => {
        setShowMobileNav(false);
    };

    const location = useLocation();
    const selected = (name: string) => location.pathname === name ? "selected" : "";
    const onClick: React.MouseEventHandler = (e) => {
        inProgress ? e.preventDefault() : closeMobileNav();
    };

    return <nav>
        <Link to="/" className={selected("/")} onClick={onClick}>
            Home
        </Link>
        <Link to="/stats" className={selected("/stats")} onClick={onClick}>
            Stats
        </Link>
        <Link to="/about" className={selected("/about")} onClick={onClick}>
            About
        </Link>
        <Link to="/spam" className={selected("/spam")} onClick={onClick}>
            Spam
        </Link>
        <Link to="/nft" className={selected("/nft")} onClick={onClick}>
            NFT
        </Link>
        <Link to="/wallet" className={selected("/wallet")} onClick={onClick}>
            Wallet
        </Link>
        <Link to="/rpcs" className={selected("/rpcs")} onClick={onClick}>
            RPCs
        </Link>
        <div className="divider" />

        <NetworkDropdownSelector
            currentNetwork={network}
            supportedNetworks={supportedNetworks}
            disabled={inProgress}
            onSwitch={updateNetwork}
        />
    </nav>;
};
