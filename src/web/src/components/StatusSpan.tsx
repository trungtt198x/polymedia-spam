import { SpamStatus } from "@polymedia/spam-sdk";

export const StatusSpan: React.FC<{
  status: SpamStatus;
  textOnly: boolean;
}> = ({ status, textOnly }) => {
  if (!status) {
    return <span>loading</span>;
  }
  let className: string;
  let imageName: string;
  if (status === "stopped") {
    // className = "text-red";
    // imageName = "stopped.gif";
    return;
  } else if (status === "stopping") {
    // className = "text-orange";
    // imageName = "orange.gif";
    return;
  } else {
    className = "text-green";
    imageName = "running.gif";
  }

  const imageSrc = `/img/${imageName}`;

  if (textOnly) {
    return <span className={className}>{status}</span>;
  } else {
    return (
      <h1>
        <span>
          <img
            alt=""
            src={imageSrc}
            style={{ borderRadius: "40%", width: "auto" }}
          />
        </span>
      </h1>
    );
  }
};
