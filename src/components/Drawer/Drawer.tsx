import { observer } from "mobx-react";
import React from "react";
import { StopList } from "../Locations/LocationList";

export const Drawer = observer(function Drawer() {
  return (
    <section className="Drawer has-text-centered is-hidden-tablet has-background-light">
      <StopList />
    </section>
  );
});
