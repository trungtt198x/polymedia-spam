import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { shortenTx } from "@polymedia/spam-sdk";

export const TextWithCopyClipboard: React.FC<{
  text: string;
  className: string;
}> = ({ text, className }) => {
  const [copiedState, setCopiedState] = useState(false);

  return (
    <span className={className}>
      {shortenTx(text)} &nbsp;
      <span style={{ cursor: "pointer" }}>
        <CopyToClipboard
          text={text}
          onCopy={() => {
            setCopiedState(true);
            setTimeout(() => {
              setCopiedState(false);
            }, 5000);
          }}
        >
          <FontAwesomeIcon
            icon={copiedState ? faCheckCircle : faCopy}
            size="xs"
          />
        </CopyToClipboard>
      </span>
    </span>
  );
};
