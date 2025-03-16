import { Link } from "react-router-dom";
import { SpamStatus } from "@polymedia/spam-sdk";
import { StatusSpan } from "./StatusSpan";

export const Header: React.FC<{
  status: SpamStatus;
  inProgress: boolean;
}> = ({ status, inProgress }) => {
  return (
    <header>
      <Link
        to="/"
        onClick={(e) => {
          inProgress && e.preventDefault();
        }}
      >
        <h1>
          <span>
            <img alt="polymedia" src="/img/spam-logo.png" className="logo" />
          </span>
        </h1>
      </Link>

      <span id="status-indicator">
        <StatusSpan status={status} />
      </span>
    </header>
  );
};
