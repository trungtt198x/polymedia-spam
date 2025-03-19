import {
    EXPLORER,
} from "@polymedia/spam-sdk";

export const HrefLink: React.FC<{
    network: string;
    isOnlyExplorer: boolean;
    isAddress: boolean;
    hrefEndValue: string;
    hrefDisplay: string;
}> = ({ network, isOnlyExplorer, isAddress, hrefEndValue, hrefDisplay }) => {
    let href: string = EXPLORER[network] as string;

    if (!isOnlyExplorer) {
        href += isAddress ? "/address/" : "/object/";
        href += hrefEndValue;
    }

    return (
        <a
            href={href}
            style={{ textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
        >
            {" "}
            {hrefDisplay}{" "}
        </a>
    );
};