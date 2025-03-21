import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Introduction } from "./Introduction";
import { modalStyles } from "./modalStyle";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app");

export const RPCsModal: React.FC<{ explorerCoin: string }> = ({
  explorerCoin,
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
        <FontAwesomeIcon icon={faBolt} />
      </btn>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <Introduction explorerCoin={explorerCoin} />{" "}
        <btn onClick={closeModal}>
          <FontAwesomeIcon icon={faCircleXmark} size="xl" />
        </btn>
      </Modal>
    </div>
  );
};
