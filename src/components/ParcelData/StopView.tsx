import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { FaFlag } from "react-icons/fa";
import { RiMapPin2Fill } from "react-icons/ri";
import { Color, percentShift } from "src/utilities/colour.utilities";
import { Stop, TrackingEvent } from "../../models";
import { useStore } from "../../stores/store.context";
import "./StopView.scss";

export interface EventViewProps {
  event: TrackingEvent;
  displayConnector: boolean;
  selected?: boolean;
  onClick?: (args: any) => void;
}

export const EventView = observer(function EventView({
  event,
  displayConnector,
  selected,
}: EventViewProps) {
  return (
    <span>{event.timestamp.toString()}</span>
    // <TimelineItem className="StopView">
    //   <TimelineOppositeContent>
    //     <p className="is-size-7">{event.timestamp.format("h:mm a")}</p>
    //   </TimelineOppositeContent>
    //   <TimelineSeparator>
    //     <TimelineDot
    //       className={`StopIcon ${!!selected ? "selected" : ""}`}
    //       color="secondary"
    //     />
    //     {displayConnector && <TimelineConnector />}
    //   </TimelineSeparator>
    //   <TimelineContent>
    //     <h6 className="is-size-6 mb-0 has-text-weight-normal">
    //       {event.status}
    //     </h6>
    //   </TimelineContent>
    // </TimelineItem>
  );
});

export const StopView = observer(function StopView({
  stop,
  displayConnector,
}: {
  stop: Stop;
  displayConnector: boolean;
}) {
  const { store } = useStore();

  const [title] = useState(() => {
    const location = stop?.location?.toString();
    if (location) {
      return location;
    } else if (stop.events.length > 0) {
      return stop.events[0].status;
    }
    return stop.startDate.toString();
  });

  const [date] = useState(() => {
    if (stop.events.length === 1) {
      return stop.startDate.format("MMM Do, YYYY [at] h:mm a");
    } else if (stop.endDate) {
      let dateString = stop.startDate.format("MMM Do, YYYY [-]");
      dateString += stop.endDate.format("MMM Do, YYYY");
      return dateString;
    } else return "";
  });

  const [iconColor, setIconColor] = useState(() => stop.color?.hex ?? "#000");

  useEffect(() => {
    if (stop.color) {
      setIconColor(stop.selected ? percentShift(stop.color, 0.80).hex : stop.color.hex);
    }
  }, [stop.selected, stop.color])

  const handleSelect = () => (store.selectedStop = stop);

  return (
    <div onClick={handleSelect}>
      <div className={`StopView ${stop.selected ? "selected" : ""}`}>
        <div
          className="StopIcon"
          style={{ backgroundColor: iconColor }}
        >
          {displayConnector ? <RiMapPin2Fill /> : <FaFlag />}
        </div>
        <div>
          <h4 className="is-size-6 mb-0 has-text-weight-medium">{title}</h4>
          <p className="is-size-7">{date}</p>
        </div>
      </div>
      {stop.events.length > 1 &&
        stop.events.map((event, index) => (
          <EventView
            key={`${event.status}-${index}`}
            event={event}
            displayConnector={
              displayConnector || index < stop.events.length - 1
            }
            onClick={handleSelect}
            selected={stop.selected}
          />
        ))}
    </div>
  );
});
