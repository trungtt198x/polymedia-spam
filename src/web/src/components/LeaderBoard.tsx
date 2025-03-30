import { ClaimData, shortenStuff } from "@polymedia/spam-sdk";
import { formatNumber } from "@polymedia/suitcase-core";
import { HrefLink } from "./HrefLink";

export const LeaderBoard: React.FC<{
  data: ClaimData | null;
  network: string;
}> = ({ data, network }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const leaderList = [];

  // Define columns
  leaderList.push(
    <div className="event" key="0" style={{ fontWeight: "bold" }}>
      <span className="event-time">Rank</span>{" "}
      <span className="event-msg">Address</span>{" "}
      <span className="event-msg">$SPAM</span>
    </div>,
  );

  let index = 1;
  for (const dataKey of Object.keys(data)) {
    const formattedAmount = formatNumber(data[dataKey], "compact");
    const addr = dataKey;

    // Add data
    leaderList.push(
      <div className="event" key={dataKey}>
        <span className="event-time">{index++}</span>{" "}
        <span className="event-msg">
          <HrefLink
            network={network}
            isOnlyExplorer={false}
            isAddress={true}
            hrefEndValue={addr}
            hrefDisplay={shortenStuff(addr)}
          />
        </span>{" "}
        <span className="event-msg">{formattedAmount}</span>
      </div>,
    );
  }

  return (
    <div className="event-section">
      <h2>Spammer Leader Board</h2>
      <div id="event-log">{leaderList}</div>
    </div>
  );
};
