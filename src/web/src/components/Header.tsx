import { Link } from "react-router-dom";
import { SpamStatus } from "@polymedia/spam-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleQuestion,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { NetworkDropdownSelector } from "@polymedia/suitcase-react";
import { InstructionModal } from "./InstructionModal";
import { SettingsModal } from "./SettingsModal";

export const Header: React.FC<{
  inProgress: boolean;
  explorerCoin: string;
  spammerStatus: string;
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: () => {};
  updateClaimAddress: () => {};
}> = ({
  inProgress,
  explorerCoin,
  spammerStatus,
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
}) => {
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
          <InstructionModal explorerCoin={explorerCoin} />
        </span>
        <span>
          <SettingsModal
            spammerStatus={spammerStatus}
            spammerCurrentAddress={spammerCurrentAddress}
            spammerCurrentKey={spammerCurrentKey}
            replaceKeypair={replaceKeypair}
            updateClaimAddress={updateClaimAddress}
          />
        </span>
      </h1>
    </header>
  );
};
