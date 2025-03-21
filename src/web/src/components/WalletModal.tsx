import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Wallet } from "./Wallet";
import { modalStyles } from "./modalStyle";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app");

export const WalletModal: React.FC<{
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: (...args: any[]) => any;
  updateClaimAddress: (...args: any[]) => any;
  currentClaimAddr: string;
}> = ({
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
  currentClaimAddr,
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <btn onClick={openModal}>
        <FontAwesomeIcon icon={faWallet} />
      </btn>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <Wallet
          spammerCurrentAddress={spammerCurrentAddress}
          spammerCurrentKey={spammerCurrentKey}
          replaceKeypair={replaceKeypair}
          updateClaimAddress={updateClaimAddress}
          currentClaimAddr={currentClaimAddr}
        />{" "}
        <btn onClick={closeModal}>
          <FontAwesomeIcon icon={faCircleXmark} size="xl" />
        </btn>
      </Modal>
    </div>
  );
};
