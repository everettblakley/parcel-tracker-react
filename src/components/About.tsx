import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../stores/store.context";

export const About = observer(function About() {
  const store = useStore();

  return (
    <section className={`content ${store.uiStore.isMobile ? "pb-2" : "p-2"}`}>
      <h3>About Parcel Tracker</h3>
      <p>
        Parcel Tracker was built after being tired of seeing the same, boring
        bullet list of tracking data for parcels ordered through various
        couriers
      </p>
    </section>
  );
});
