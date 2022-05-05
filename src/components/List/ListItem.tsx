import { DateTime } from "luxon";
import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import { FaFlag } from "react-icons/fa";
import { RiMapPin2Fill } from "react-icons/ri";
import { Color, percentShift } from "src/utilities/colour.utilities";
import { Stop, TrackingEvent } from "../../models";
import { useStore } from "../../stores/store.context";
import "./ListItem.scss";

const useSelectedProp = (selected: boolean): string => {
  const [selectedClass, setSelectedClass] = useState(() =>
    selected ? "selected" : ""
  );

  useEffect(() => setSelectedClass(() => (selected ? "selected" : "")), [
    selected,
  ]);
  return selectedClass;
};

const useIconColor = (color: Color | undefined, selected: boolean): string => {
  const [iconColor, setIconColor] = useState(() => color?.hex ?? "#000");

  useEffect(() => {
    if (color) {
      setIconColor(selected ? percentShift(color, 0.8).hex : color.hex);
    }
  }, [selected, color]);

  return iconColor;
};

interface ListItemProps {
  selected?: boolean;
  color?: Color;
  iconSize: "30px" | "15px";
  iconContent?: React.ReactNode;
  content: React.ReactNode;
  onClick?: (args: any) => void;
  [key: string]: any;
}

const GenericListItem = observer(function GenericListItem({
  selected,
  color,
  onClick,
  iconSize,
  iconContent,
  content,
}: ListItemProps) {
  const selectedClass = useSelectedProp(selected || false);
  const iconColor = useIconColor(color, selected || false);

  return (
    <div className={`ListItem ${selectedClass}`} onClick={onClick}>
      <div className={`ListItem_icon ${selectedClass}`}>
        <div
          className="ListItem_icon--fill"
          style={{
            backgroundColor: iconColor,
            width: iconSize,
            height: iconSize,
          }}
        >
          {iconContent}
        </div>
      </div>
      <div className="ListItem_content">{content}</div>
    </div>
  );
});

export interface EventViewProps
  extends Omit<ListItemProps, "content" | "iconContent"> {
  event: TrackingEvent;
}

export const EventView = observer(function EventView({
  event,
  ...props
}: EventViewProps) {
  return (
    <GenericListItem
      content={
        <>
          <h4 className="is-size-6">{event.status}</h4>
          <p className="is-size-7">
            {event.timestamp.toLocaleString(DateTime.DATETIME_MED)}
          </p>
        </>
      }
      iconSize="15px"
      {...props}
    />
  );
});

export const ListItem = observer(function StopView({
  stop,
  displayConnector,
}: {
  stop: Stop;
  displayConnector: boolean;
}) {
  const store = useStore();

  const displayEvents = useMemo(() => {
    return !!stop.location?.toString();
  }, [stop]);
  const title = useMemo(() => {
    const location = stop?.location?.toString();
    if (location) {
      return location;
    } else if (stop.events.length > 0) {
      return stop.events[0].status;
    }
    return stop.startDate.toString();
  }, [stop]);

  const date = useMemo(() => {
    const { startDate, endDate } = stop;
    const parts = [];
    if (stop.events.length === 1) {
      if (stop.location) {
        parts.push(startDate.toLocaleString(DateTime.DATE_MED));
      } else {
        parts.push(startDate.toLocaleString(DateTime.DATETIME_MED));
      }
    } else {
      parts.push(startDate.toLocaleString(DateTime.DATE_MED));
    }
    if (endDate) {
      if (!endDate.hasSame(startDate, "day")) {
        parts.push(endDate.toLocaleString(DateTime.DATE_MED));
      }
    }
    return parts.join(" - ");
  }, [stop]);

  const handleSelect = () => (store.selectedStop = stop);

  return (
    <div>
      <GenericListItem
        selected={stop.selected}
        iconSize="30px"
        onClick={handleSelect}
        color={stop.color}
        content={
          <>
            <h4 className="is-size-5 mb-0 has-text-weight-medium">{title}</h4>
            <p className="is-size-6">{date}</p>
          </>
        }
        iconContent={
          <div className="ListItem_icon--fill">
            {displayConnector ? <RiMapPin2Fill /> : <FaFlag />}
          </div>
        }
      />
      {displayEvents &&
        stop.events.map((event, index) => (
          <EventView
            key={`${event.status}-${index}`}
            event={event}
            color={stop.color}
            onClick={handleSelect}
            selected={stop.selected}
          />
        ))}
    </div>
  );
});
