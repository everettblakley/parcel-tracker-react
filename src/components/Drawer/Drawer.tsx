import { observer } from "mobx-react";
import React from "react";
import { ParcelList } from "../Parcel/ParcelList";

export const Drawer = observer(() => {
  return (
    <section className="Drawer has-text-centered is-hidden-tablet has-background-light">
      <ParcelList />
    </section>
  );
});
