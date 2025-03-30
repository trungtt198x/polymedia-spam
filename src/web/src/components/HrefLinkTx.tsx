import { EXPLORER } from "@polymedia/spam-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export const HrefLinkTx: React.FC<{
  network: string;
  hrefEndValue: string;
  hrefDisplay: string;
}> = ({ network, hrefEndValue, hrefDisplay }) => {
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
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />{" "}
    </a>
  );
};
