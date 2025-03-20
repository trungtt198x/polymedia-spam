import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCircleQuestion,
  faGear,
  faCircleXmark,
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
      backgroundColor: "rgb(15 23 42)",
      color: "rgb(226 232 240)",
      borderRadius: "2rem",
      display: "flex",
      // width: "50%"
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
        <Introduction explorerCoin={"abc"} />{" "}
        <btn onClick={closeModal}>
          <FontAwesomeIcon icon={faCircleXmark} size="xl" />
        </btn>
      </Modal>
    </div>
  );
};
