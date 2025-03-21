import React, { useEffect, useState } from "react";
import { RpcUrl } from "../lib/storage";
import { RPC_ENDPOINTS } from "@polymedia/spam-sdk";
import toast from "react-hot-toast";
import {
  inputStyles,
  buttonStyles,
  hrStyles,
  checkboxStyles,
} from "./modalStyle";

export const RPCs: React.FC<{
  network: string;
  rpcUrls: RpcUrl[];
  updateRpcUrls: (...args: any[]) => any;
}> = ({ network, rpcUrls, updateRpcUrls }) => {
  const [rpcs, setRpcs] = useState<RpcUrl[]>([...rpcUrls]);
  const [newRpcUrl, setNewRpcUrl] = useState("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    setRpcs([...rpcUrls]);
    setNewRpcUrl("");
    setHasChanges(false);
  }, [rpcUrls]);

  useEffect(() => {
    if (!rpcs.some((rpc) => rpc.enabled)) {
      setHasChanges(false);
    }
  }, [rpcs]);

  const onCheckboxChange = (url: string) => {
    setHasChanges(true);
    setRpcs((prevRpcs) =>
      prevRpcs.map((rpc) =>
        rpc.url !== url ? rpc : { ...rpc, enabled: !rpc.enabled },
      ),
    );
  };

  const onSaveRPCs = async () => {
    await updateRpcUrls(rpcs);
    setHasChanges(false);
    toast.success("RPC(s) saved");
  };

  const onAddRpcUrl = () => {
    const trimmedUrl = newRpcUrl.trim();
    if (trimmedUrl && !rpcs.find((rpc) => rpc.url === trimmedUrl)) {
      setRpcs(rpcs.concat({ url: trimmedUrl, enabled: true }));
      setNewRpcUrl("");
      setHasChanges(true);
      toast.success("RPC added");
    }
  };

  const onResetRpcs = () => {
    setRpcs(
      RPC_ENDPOINTS[network].map((rpcUrl) => {
        return { url: rpcUrl, enabled: true };
      }),
    );
    setHasChanges(true);
    toast.success("RPC restored");
  };

  const SaveRPCs: React.FC = () => {
    return (
      <div id="wallet-info">
        <h3>Set one or multiple RPC(s)</h3>
        <div id="wallet-content">
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            Multiple RPCs will auto be rotated to avoid rate limit
          </div>
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            {rpcs.map((rpc) => (
              <p key={rpc.url} style={{ paddingBottom: "1rem" }}>
                <label>
                  <input
                    type="checkbox"
                    checked={rpc.enabled}
                    onChange={() => onCheckboxChange(rpc.url)}
                    style={checkboxStyles}
                  />{" "}
                  {rpc.url}
                </label>
              </p>
            ))}
          </div>
          <div className="wallet-section">
            <button
              style={buttonStyles}
              onClick={onSaveRPCs}
              disabled={!hasChanges}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddRPC: React.FC = () => {
    return (
      <div id="wallet-info">
        <h3>Add another RPC</h3>
        <div id="wallet-content">
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <input
              type="text"
              value={newRpcUrl}
              onChange={(e) => setNewRpcUrl(e.target.value)}
              placeholder="RPC link"
              style={inputStyles}
            />
          </div>
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <button style={buttonStyles} onClick={onAddRpcUrl}>
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RestoreRPC: React.FC = () => {
    return (
      <div id="wallet-info">
        <h3>Restore default RPC</h3>
        <div id="wallet-content">
          <div className="wallet-section" style={{ paddingTop: "1rem" }}>
            <button style={buttonStyles} onClick={onResetRpcs}>
              Restore
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="page-wallet">
        <h1 style={{ textAlign: "center" }}>RPC</h1>
        <br />
        <div id="page-wallet-sections">
          <SaveRPCs />
          <hr style={hrStyles} />
          <AddRPC />
          <hr style={hrStyles} />
          <RestoreRPC />
        </div>
      </div>
    </>
  );
};
