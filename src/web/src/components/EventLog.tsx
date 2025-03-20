import { SpamView } from "../lib/types";

export const EventLog: React.FC<{ spamView: SpamView }> = ({ spamView }) => {
  if (spamView.events.length === 0) {
    return null;
  }
  const reversedEvents = [];
  for (let i = spamView.events.length - 1; i >= 0; i--) {
    reversedEvents.push(
      <div className="event" key={i}>
        <span className="event-time">{spamView.events[i].time}</span>
        <span className="event-msg">{spamView.events[i].msg}</span>
      </div>,
    );
  }
  return (
    <>
      <h2>Event log</h2>
      <div id="event-log">{reversedEvents}</div>
    </>
  );
};
