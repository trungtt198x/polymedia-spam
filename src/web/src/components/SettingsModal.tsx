import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleQuestion,
  faGear,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Settings } from "./Settings";
import { modalStyles } from "./modalStyle";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app");

export const SettingsModal: React.FC<{
  spammerStatus: string;
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: () => {};
  updateClaimAddress: () => {};
}> = ({
  spammerStatus,
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
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
        <FontAwesomeIcon icon={faGear} />
      </btn>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <Settings
          spammerStatus={spammerStatus}
          spammerCurrentAddress={spammerCurrentAddress}
          spammerCurrentKey={spammerCurrentKey}
          replaceKeypair={replaceKeypair}
          updateClaimAddress={updateClaimAddress}
        />{" "}
        <btn onClick={closeModal}>
          <FontAwesomeIcon icon={faCircleXmark} size="xl" />
        </btn>
      </Modal>
    </div>
  );
};
