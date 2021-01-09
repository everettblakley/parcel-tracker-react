import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ParcelData, TrackingEvent } from "../../models";
import { useStore } from "../../stores/store.context";
import "./ParcelList.scss";

const CarrierData = observer(({ data }: { data: ParcelData }) => {
  return (
    <>
      <h5>{data.carrier}</h5>
      <ul>
        {data.events.map((event: TrackingEvent) => (
          <li key={event.timestamp.toString()}>
            {event.timestamp.toString()}: {event?.location?.toString()}
          </li>
        ))}
      </ul>
    </>
  );
});

const CarrierList = observer(({ data }: { data: ParcelData[] }) => {
  return (
    <span className="content">
      {data.map((d) => (
        <CarrierData key={d.carrier} data={d} />
      ))}
    </span>
  );
});

export const ParcelList = observer(() => {
  const { store } = useStore();
  // const { parcelDataStore } = store;
  const { trackingEvents } = store.parcelDataStore;

  // useEffect(() => {
  //   const dispose = autorun(() => console.log(parcelDataStore.trackingEvents));
  //   return () => dispose();
  // }, []);

  return (
    <span className="content">
      {trackingEvents.length !== 0 ? (
        <CarrierList data={trackingEvents} />
      ) : (
        <p>Make a request to see the result</p>
      )}
    </span>
  );
});
