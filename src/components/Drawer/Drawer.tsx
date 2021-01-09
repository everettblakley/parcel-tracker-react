import { observer } from "mobx-react";
import React from "react";
import { StopList } from "../Location/LocationList";

export const Drawer = observer(() => {
  return (
    <section className="Drawer has-text-centered is-hidden-tablet has-background-light">
      <StopList />
    </section>
  );
});
