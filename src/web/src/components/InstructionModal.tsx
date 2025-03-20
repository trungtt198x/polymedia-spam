import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleQuestion,
  faGear,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Introduction } from "./Introduction";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app");

export const InstructionModal: React.FC<{ explorerCoin: string }> = ({
  explorerCoin,
}) => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      backgroundColor: "transparent",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <btn onClick={openModal}>
        <FontAwesomeIcon icon={faFileCircleQuestion} />
      </btn>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <btn onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} />
        </btn>
        <Introduction explorerCoin={"abc"} />
      </Modal>
    </div>
  );
};
