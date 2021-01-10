import { observer } from "mobx-react";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData, Stop } from "../../models";
import { useStore } from "../../stores/store.context";
import "./LocationList.scss";

const StopView = observer(function StopView({ stop }: { stop: Stop }) {
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

const Courier = observer(function Courier({ data }: { data: ParcelData }) {
  return (
    <>
      <h5>Delivered by {data.courier}</h5>
      <ul className="mt-0 ml-0">
        {data.stops.map((stop: Stop) => (
          <StopView key={`${stop.startDate.toString()}`} stop={stop} />
        ))}
      </ul>
    </>
  );
});

const CourierList = observer(function CourierList({
  data,
}: {
  data: ParcelData[];
}) {
  return (
    <section>
      {data.map((d) => (
        <Courier key={d.courier} data={d} />
      ))}
    </section>
  );
});

export const ParcelDataList = observer(function ParcelDataList() {
  const { store } = useStore();
  const { data } = store.parcelDataStore;

  return (
    <div className="has-text-left px-3">
      {data.length === 1 ? (
        <Courier data={data[0]} />
      ) : data.length > 1 ? (
        <CourierList data={data} />
      ) : (
        <p>Make a request to see the result</p>
      )}
    </div>
  );
});
