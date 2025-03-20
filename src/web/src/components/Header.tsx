import { Link } from "react-router-dom";
import { SpamStatus } from "@polymedia/spam-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleQuestion,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { NetworkDropdownSelector } from "@polymedia/suitcase-react";
import { InstructionModal } from "./InstructionModal";

export const Header: React.FC<{
  status: SpamStatus;
  inProgress: boolean;
  onOpenInstruction: () => {};
}> = ({ _status, inProgress }) => {
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
            <img alt="polymedia" src="/img/spam-logo.png" />
          </span>
        </h1>
      </Link>

      <h1 style={{ paddingTop: "1rem" }}>
        <span>
          <InstructionModal explorerCoin={""} />
        </span>
      </h1>
    </header>
  );
};
