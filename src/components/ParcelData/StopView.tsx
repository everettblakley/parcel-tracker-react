import React, { useState } from "react";
import { observer } from "mobx-react";
import { Stop } from "../../models";
import { FaCaretDown } from "react-icons/fa";

export const StopView = observer(function StopView({ stop }: { stop: Stop }) {
  const [expandable] = useState(stop.events.length > 1);
  const [title] = useState(() => {
    const location = stop?.location?.toString();
    if (location) {
      return location;
    } else if (stop.events.length > 0) {
      return stop.events[0].status;
    }
    return stop.startDate.toString();
  });
  const [timeframe] = useState(() => {
    if (!stop.endDate) {
      return stop.startDate.format("dddd, MMMM Do, YYYY [at] h:mm a");
    } else {
      if (stop.startDate.isSame(stop.endDate, "day")) {
        return stop.startDate.format("dddd, MMMM Do, YYYY");
      } else {
        return `${stop.startDate.format(
          "dddd, MMMM Do"
        )} - ${stop.endDate.format("Do, YYYY")}`;
      }
    }
  });

  const handleClick = () => {
    console.log(stop);
  };

  return (
    <li className="level box mb-2" onClick={handleClick}>
      <div className="level-item is-flex-shrink-1 is-flex-grow-0 is-flex-direction-column is-align-items-flex-start">
        <h4 className="is-size-6 mb-1">{title}</h4>
        <small>{timeframe}</small>
      </div>
      {expandable && (
        <div className="level-item level-right has-text-dark">
          <FaCaretDown />
        </div>
      )}
    </li>
  );
});
