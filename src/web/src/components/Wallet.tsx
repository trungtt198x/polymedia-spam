import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidIotaAddress, shortenStuff } from "@polymedia/spam-sdk";
import { pairFromSecretKey } from "../lib/storage";
import { TextWithCopyClipboard } from "./TextWithCopyClipboard";
import { inputStyles, buttonStyles, redText, hrStyles } from "./modalStyle";
import { HrefLinkTx } from "./HrefLinkTx";

export const Wallet: React.FC<{
  spammerCurrentAddress: string;
  spammerCurrentKey: string;
  replaceKeypair: (...args: any[]) => any;
  updateClaimAddress: (...args: any[]) => any;
  currentClaimAddr: string;
  sendIOTA: (...args: any[]) => any;
  network: string;
}> = ({
  spammerCurrentAddress,
  spammerCurrentKey,
  replaceKeypair,
  updateClaimAddress,
  currentClaimAddr,
  sendIOTA,
  network,
}) => {
  const confirmAndReplaceWallet = (pair: Ed25519Keypair): boolean => {
    const userAccepted = true;
    if (userAccepted) {
      replaceKeypair(pair);
    }
    return userAccepted;
  };

  const AutoGenWallet: React.FC = () => {
    return (
      <div id="wallet-info">
        <div id="wallet-content">
          <div className="wallet-section">
            <b>
              <strong>Current address:</strong>
            </b>{" "}
            <TextWithCopyClipboard
              text={spammerCurrentAddress}
              className={""}
            />
          </div>
          <div className="wallet-section">
            <b>
              <strong>Secret key:</strong>
            </b>{" "}
            <TextWithCopyClipboard text={spammerCurrentKey} className={""} />
            <div style={redText}>
              Secret key generated and stored on the browser. Clearing cookies
              will delete it.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ClaimAddressForm: React.FC = () => {
    const [claimAddress, setClaimAddress] = useState<string | undefined>();
    const [msg, setMsg] = useState<{ type: "okay" | "error"; text: string }>();
    const disableButton = msg?.type === "error" || !claimAddress;

    const onInputChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      const newClaimAddress = evt.currentTarget.value;
      setClaimAddress(newClaimAddress);
      if (newClaimAddress.length === 0) {
        setMsg(undefined);
        return;
      }
      const cleanAddress = isValidIotaAddress(newClaimAddress);
      if (!cleanAddress) {
        setMsg({ type: "error", text: "Invalid address" });
        return;
      }
      setMsg(undefined);
    };

    const onKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (evt.key === "Enter" && !disableButton) {
        evt.preventDefault();
        onSubmit();
      }
    };

    const onSubmit = (): void => {
      if (claimAddress) {
        try {
          updateClaimAddress(claimAddress);
          // setMsg({ type: "okay", text: "Success!" });
          setMsg(null);
          toast.success("Claim address changed");
        } catch (err) {
          setMsg({ type: "error", text: String(err) });
        }
      }
    };

    return (
      <div id="wallet-info">
        {/* <b>Current claim address</b> */}
        <div id="wallet-content">
          <div className="wallet-section">
            <b>
              <strong>Current claim address:</strong>
            </b>{" "}
            <TextWithCopyClipboard text={currentClaimAddr} className={""} />
          </div>

          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <input
              type="text"
              value={claimAddress}
              placeholder="Change address to receive $SPAM"
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              style={inputStyles}
            />
          </div>
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <button
              style={buttonStyles}
              onClick={onSubmit}
              disabled={disableButton}
            >
              Change
            </button>
          </div>
          {msg && (
            <div className="wallet-section">
              <div style={redText}>{msg.text}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ImportWalletForm: React.FC = () => {
    const [secretKey, setSecretKey] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const disableSubmit = errMsg !== null || secretKey.length === 0;

    const onInputChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      const newSecretKey = evt.currentTarget.value;
      setSecretKey(newSecretKey);
      if (newSecretKey.length === 0) {
        setErrMsg(null);
        return;
      }
      try {
        pairFromSecretKey(newSecretKey);
        setErrMsg(null);
      } catch (err) {
        setErrMsg(String(err));
      }
    };

    const onKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (evt.key === "Enter" && !disableSubmit) {
        evt.preventDefault();
        onSubmit();
      }
    };

    const onSubmit = (): void => {
      const pair = pairFromSecretKey(secretKey);
      const okay = confirmAndReplaceWallet(pair);
      if (okay) {
        toast.success("Secret key imported");
      }
    };

    return (
      <div id="wallet-info">
        <b>
          <strong>Import existing account to replace current one</strong>
        </b>
        <div id="wallet-content" style={{ paddingTop: "1rem" }}>
          <div className="wallet-section">
            <input
              type="text"
              value={secretKey}
              placeholder="Paste secret key here"
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              style={inputStyles}
            />
          </div>
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <button
              style={buttonStyles}
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              Import
            </button>
          </div>
          {errMsg && (
            <div className="wallet-section">
              <div style={redText}>{errMsg}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CreateWalletForm: React.FC = () => {
    const onSubmit = (): void => {
      const okay = confirmAndReplaceWallet(new Ed25519Keypair());
      if (okay) {
        toast.success("New account created");
      }
    };

    return (
      <div id="wallet-info">
        <b>
          <strong>Create new account to replace current one</strong>
        </b>
        <div id="wallet-content" style={{ paddingTop: "1rem" }}>
          <div className="wallet-section">
            <button style={buttonStyles} onClick={onSubmit}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SendIotaForm: React.FC = () => {
    const [receivingAddress, setReceivingAddress] = useState<
      string | undefined
    >();
    const [msg, setMsg] = useState<{ type: "okay" | "error"; text: string }>();
    const disableButton = msg?.type === "error" || !receivingAddress;

    const onInputChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      const newReceivingAddress = evt.currentTarget.value;
      setReceivingAddress(newReceivingAddress);
      if (newReceivingAddress.length === 0) {
        setMsg(undefined);
        return;
      }
      const cleanAddress = isValidIotaAddress(newReceivingAddress);
      if (!cleanAddress) {
        setMsg({ type: "error", text: "Invalid address" });
        return;
      }
      setMsg(undefined);
    };

    const onKeyDown = (evt: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (evt.key === "Enter" && !disableButton) {
        evt.preventDefault();
        onSubmit();
      }
    };

    const onSubmit = (): void => {
      if (receivingAddress) {
        sendIOTA(receivingAddress).then((tx: string) => {
          if (tx.includes("Error")) {
            setMsg({ type: "error", text: tx });
            toast.error("Transaction failed");
          } else {
            setMsg({ type: "okay", text: tx });
            toast.error("IOTA sent");
          }
        });
      }
    };

    return (
      <div id="wallet-info">
        <div id="wallet-content">
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <input
              type="text"
              value={receivingAddress}
              placeholder="Receiving address"
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              style={inputStyles}
            />
          </div>
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <button
              style={buttonStyles}
              onClick={onSubmit}
              disabled={disableButton}
            >
              Withdraw IOTA
            </button>
          </div>
          {msg && (
            <div className="wallet-section">
              {msg.type === "error" ? (
                <div style={redText}>{msg.text}</div>
              ) : (
                <div>
                  <HrefLinkTx
                    network={network}
                    hrefEndValue={msg.text}
                    hrefDisplay={shortenStuff(msg.text)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="page-wallet">
        <h1 style={{ textAlign: "center" }}>Wallet</h1>
        <br />
        <div id="page-wallet-sections">
          <AutoGenWallet />
          <SendIotaForm />
          <hr style={hrStyles} />
          <ImportWalletForm />
          <hr style={hrStyles} />
          <CreateWalletForm />
          <hr style={hrStyles} />
          <ClaimAddressForm />
          <br />
        </div>
      </div>
    </>
  );
};
