import {
    EXPLORER,
} from "@polymedia/spam-sdk";

export const HrefLinkTx: React.FC<{
    network: string;
    hrefEndValue: string;
    hrefDisplay: string;
  }> = ({ network, isAddress, hrefEndValue, hrefDisplay }) => {
    let href: string = EXPLORER[network] as string;
    href += "/tx/";
    href += hrefEndValue;

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