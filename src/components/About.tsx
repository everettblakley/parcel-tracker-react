import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../stores/store.context";

export const About = observer(function About() {
  const store = useStore();

  return (
    <section className={`${store.uiStore.isMobile ? "pb-2" : "p-2"}`}>
      <h3 className="text-xl font-semibold mb-2">About Parcel Tracker</h3>
      <p className="text-sm font-light">
        Parcel Tracker was built after being tired of seeing the same, boring
        bullet list of tracking data for parcels ordered through various
        couriers
      </p>
    </section>
  );
});
