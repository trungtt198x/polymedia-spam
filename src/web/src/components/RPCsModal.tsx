import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { RPCs } from "./RPCs";
import { modalStyles } from "./modalStyle";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app");

export const RPCsModal: React.FC<{
  network: string;
  rpcUrls: RpcUrl[];
  updateRpcUrls: (...args: any[]) => any;
}> = ({ network, rpcUrls, updateRpcUrls }) => {
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
        <RPCs
          network={network}
          rpcUrls={rpcUrls}
          updateRpcUrls={updateRpcUrls}
        />{" "}
        <btn onClick={closeModal} style={{ cursor: "pointer" }}>
          <FontAwesomeIcon icon={faCircleXmark} size="xl" />
        </btn>
      </Modal>
    </div>
  );
};
