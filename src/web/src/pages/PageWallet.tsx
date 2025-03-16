/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { validateAndNormalizeAddress } from "@polymedia/suitcase-core";
import { useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AppContext } from "../lib/types";
import { PageDisclaimer } from "./PageDisclaimer";
import { loadClaimAddressFromStorage, pairFromSecretKey } from "../lib/storage";

export const PageWallet: React.FC = () => {
  /* State */

  const location = useLocation();
  const { spammer, disclaimerAccepted, replaceKeypair, updateClaimAddress } =
    useOutletContext<AppContext>();

  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = location.hash.replace("#", "");
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    handleHashNavigation();
  }, [location.hash]);

  const confirmAndReplaceWallet = (pair: Ed25519Keypair): boolean => {
    // const userAccepted = window.confirm(
    //   "🚨 WARNING 🚨\n\nThis will delete and replace your current account.\n\nAre you sure?",
    // );

    // let userAccepted;
    // confirmToast(
    //   "This will delete and replace the current account. Are you sure?",
    //   (userAccepted) => userAccepted = true,
    //   (userAccepted) => userAccepted = false
    // );

    const userAccepted = true;

    if (userAccepted) {
      replaceKeypair(pair);
    }
    return userAccepted;
  };

  if (!disclaimerAccepted) {
    return <PageDisclaimer />;
  }

  const AutoGenWallet: React.FC = () => {
    return (
      <div id="wallet-info">
        <h3>Auto-generated account</h3>
        <div id="wallet-content">
          <div className="wallet-section">
            <b>Address</b>
            <p>Fund IOTA to this address to perform spam transactions</p>
            <span className="iota-address">
              {spammer.current.getSpamClient().signer.toIotaAddress()}
            </span>
          </div>
          <div className="wallet-section">
            <b>Secret key</b>
            <p>It allows to restore the account. Copy it somewhere safe!</p>
            <span className="iota-address">
              {(
                spammer.current.getSpamClient().signer as Ed25519Keypair
              ).getSecretKey()}
            </span>
            <div className="dont-share-secret-key">
              Secret key generated and stored on the browser. Clearing cookies
              will delete it.
            </div>
          </div>
        </div>
        {/* <div id="set-claim-address" /> */}
      </div>
    );
  };

  const ClaimAddressForm: React.FC = () => {
    const [claimAddress, setClaimAddress] = useState<string | undefined>(
      loadClaimAddressFromStorage(),
    );
    const [msg, setMsg] = useState<{ type: "okay" | "error"; text: string }>();
    const disableButton =
      msg?.type === "error" ||
      !claimAddress ||
      spammer.current.status !== "stopped";
    const disableTextarea = spammer.current.status !== "stopped";

    const onInputChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      const newClaimAddress = evt.currentTarget.value;
      setClaimAddress(newClaimAddress);
      if (newClaimAddress.length === 0) {
        setMsg(undefined);
        return;
      }
      const cleanAddress = validateAndNormalizeAddress(newClaimAddress);
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
          toast.success("Claim address set");
        } catch (err) {
          setMsg({ type: "error", text: String(err) });
        }
      }
    };

    const onStopSpammer = () => {
      if (spammer.current.status === "running") {
        spammer.current.stop();
      }
    };

    return (
      <div>
        <h3>Set claim address</h3>
        <p>Claim SPAM coins to this address:</p>
        <input
          type="text"
          value={claimAddress}
          placeholder="Address to receive SPAM"
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          disabled={disableTextarea}
          style={{ width: "100%", wordBreak: "break-all" }}
        />
        <br />
        {spammer.current.status !== "stopped" ? (
          <button className="btn" onClick={onStopSpammer}>
            Stop spamming to set address
          </button>
        ) : (
          <button className="btn" onClick={onSubmit} disabled={disableButton}>
            Set address
          </button>
        )}
        {msg && (
          <div className={`${msg.type}-box`}>
            <div>{msg.text}</div>
          </div>
        )}
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
      <div>
        <h3>Import existing account</h3>
        <p>This will replace the current account with the imported one!</p>
        <input
          type="text"
          value={secretKey}
          placeholder="Paste secret key here"
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          style={{ width: "100%", wordBreak: "break-all" }}
        />
        <br />
        <button className="btn" onClick={onSubmit} disabled={disableSubmit}>
          Import
        </button>
        {errMsg && (
          <div className="error-box">
            <div>Invalid secret key:</div>
            <div>{errMsg}</div>
          </div>
        )}
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
      <div>
        <h3>Create new account</h3>
        <p>This will replace the current account with a new one!</p>
        <div className="btn-group">
          <button className="btn" onClick={onSubmit}>
            Create account
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="page-wallet">
        <h1>
          <span className="rainbow">Wallet</span>
        </h1>

        <div id="page-rpc">
          <p>
            To perform spam transactions, either use auto-generated account or
            import existing account.
          </p>
          <br />
        </div>

        <div id="page-wallet-sections">
          <AutoGenWallet />

          <ImportWalletForm />

          <CreateWalletForm />

          <ClaimAddressForm />
        </div>
      </div>
      <Toaster />
    </>
  );
};
