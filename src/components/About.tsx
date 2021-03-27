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
      <p>
        The{" "}
        <a
          href="https://package.place"
          target="_blank"
          rel="noreferrer"
          title="Package Place API homepage"
        >
          Package Place API
        </a>{" "}
        provides the ability to get tracking event data from most major
        couriers. We query that API, clean up the data, and then make it look
        pretty.
      </p>
      <p>
        For tech details and to peak into the code, checkout the{" "}
        <a
          href="https://github.com/everettblakley/parcel-tracker-react"
          target="_blank"
          rel="noreferrer"
          title="Parcel Tracker github repo"
        >
          Github Repo
        </a>
        . If you find any bugs, feel free to{" "}
        <a
          href="mailto:everettblakley@gmail.com"
          title="Email me!"
          target="_blank"
          rel="noreferrer"
        >
          email me
        </a>
      </p>
    </section>
  );
});
