import { SpamView } from "../lib/types";
import { HrefLinkTx } from "./HrefLinkTx";

export type EventMsgFilter = "nft" | "counter";

export const EventLog: React.FC<{
  spamView: SpamView;
  msgFilter: EventMsgFilter;
  network: string;
}> = ({ spamView, msgFilter, network }) => {
  if (spamView.events.length === 0) {
    return null;
  }
  const reversedEvents = [];
  for (let i = spamView.events.length - 1; i >= 0; i--) {
    const evt = spamView.events[i];
    if (evt.msg.toLowerCase().includes(msgFilter)) {
      reversedEvents.push(
        <div className="event" key={i}>
          <span className="event-time">{evt.time}</span>

          {evt.txDigest ? (
            <span className="event-msg">
              <HrefLinkTx
                network={network}
                hrefEndValue={evt.txDigest}
                hrefDisplay={evt.msg}
              />
            </span>
          ) : (
            <span className="event-msg">{evt.msg}</span>
          )}
        </div>,
      );
    }
  }

  if (reversedEvents.length === 0) {
    return null;
  } else {
    return (
      <div className="event-section">
        <h2>Event log</h2>
        <div id="event-log">{reversedEvents}</div>
      </div>
    );
  }
};
