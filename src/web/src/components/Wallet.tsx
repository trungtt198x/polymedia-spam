import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { isValidIotaAddress } from "@polymedia/spam-sdk";
import { pairFromSecretKey } from "../lib/storage";
import { TextWithCopyClipboard } from "./TextWithCopyClipboard";
import { inputStyles, buttonStyles, redText, hrStyles } from "./modalStyle";

export const Wallet: React.FC<{
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
        <h3>Import existing account to replace current one</h3>
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
        <h3>Create new account to replace current one</h3>
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

  return (
    <>
      <div id="page-wallet">
        <h1 style={{ textAlign: "center" }}>Wallet</h1>
        <br />
        <div id="page-wallet-sections">
          <AutoGenWallet />
          <hr style={hrStyles} />
          <ImportWalletForm />
          <hr style={hrStyles} />
          <CreateWalletForm />
          <hr style={hrStyles} />
          <ClaimAddressForm />
        </div>
      </div>
      <Toaster />
    </>
  );
};
