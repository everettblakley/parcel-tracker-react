import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { FaFlag } from "react-icons/fa";
import { RiMapPin2Fill } from "react-icons/ri";
import { Stop, TrackingEvent } from "../../models";

export const EventView = observer(function EventView({
  event,
  displayConnector,
}: {
  event: TrackingEvent;
  displayConnector: boolean;
}) {
  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <p className="is-size-7">{event.timestamp.format("h:mm a")}</p>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color="secondary" />
        {displayConnector && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <h6 className="is-size-6 mb-0 has-text-weight-normal">
          {event.status}
        </h6>
      </TimelineContent>
    </TimelineItem>
  );
});

export const StopView = observer(function StopView({
  stop,
  displayConnector,
}: {
  stop: Stop;
  displayConnector: boolean;
}) {
  const [title] = useState(() => {
    const location = stop?.location?.toString();
    if (location) {
      return location;
    } else if (stop.events.length > 0) {
      return stop.events[0].status;
    }
    return stop.startDate.toString();
  });

  return (
    <>
      <TimelineItem>
        <TimelineOppositeContent>
          <p className="is-size-7">{stop.startDate.format("MMM Do, YYYY")}</p>
          {stop.events.length === 1 && (
            <p className="is-size-7">{stop.startDate.format("h:mm a")}</p>
          )}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="secondary">
            {displayConnector ? <RiMapPin2Fill /> : <FaFlag />}
          </TimelineDot>
          {(stop.events.length > 1 || displayConnector) && (
            <TimelineConnector />
          )}
        </TimelineSeparator>
        <TimelineContent>
          <h4 className="is-size-6 mb-0 has-text-weight-medium">{title}</h4>
        </TimelineContent>
      </TimelineItem>
      {stop.events.length > 1 &&
        stop.events.map((event, index) => (
          <EventView
            key={`${event.status}-${index}`}
            event={event}
            displayConnector={
              displayConnector || index < stop.events.length - 1
            }
          />
        ))}
    </>
  );
});
