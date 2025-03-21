import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../lib/types";
import { RpcUrl } from "../lib/storage";
import { RPC_ENDPOINTS } from "@polymedia/spam-sdk";
import toast, { Toaster } from "react-hot-toast";

export const PageRPCs: React.FC = () => {
  const { network, spammer, rpcUrls, updateRpcUrls } =
    useOutletContext<AppContext>();

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
      <div id="rpc-selector">
        <h3>Set one or multiple RPC(s)</h3>
        <p>Multiple RPCs will auto be rotated to avoid rate limit.</p>
        {rpcs.map((rpc) => (
          <div key={rpc.url} className="rpc">
            <label>
              <input
                type="checkbox"
                checked={rpc.enabled}
                onChange={() => onCheckboxChange(rpc.url)}
              />
              {rpc.url}
            </label>
          </div>
        ))}

        <div>
          <button className="btn" onClick={onSaveRPCs} disabled={!hasChanges}>
            {spammer?.current?.status === "running"
              ? "Save and restart"
              : "Save"}
          </button>
        </div>
      </div>
    );
  };

  const AddRPC: React.FC = () => {
    return (
      <div className="subsection">
        <h3>Add another RPC</h3>
        <input
          type="text"
          value={newRpcUrl}
          onChange={(e) => setNewRpcUrl(e.target.value)}
          placeholder="RPC link"
        />
        <br />
        <br />
        <button className="btn" onClick={onAddRpcUrl}>
          Add RPC
        </button>
      </div>
    );
  };

  const RestoreRPC: React.FC = () => {
    return (
      <div className="subsection">
        <h3>Restore default RPC</h3>
        <button className="btn" onClick={onResetRpcs}>
          Reset RPCs
        </button>
      </div>
    );
  };

  return (
    <>
      <>
        <h1>
          <span className="rainbow">RPC</span>
        </h1>

        <div id="page-rpc">
          <div id="page-wallet-sections">
            <SaveRPCs />
            <br />
            <br />

            <AddRPC />
            <br />
            <br />

            <RestoreRPC />
          </div>
        </div>
      </>
      <Toaster />
    </>
  );
};
