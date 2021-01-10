import { observer } from "mobx-react";
import React from "react";
import { ParcelDataList } from "../ParcelData/LocationList";

export const Drawer = observer(function Drawer() {
  return (
    <section className="Drawer has-text-centered is-hidden-tablet has-background-light">
      <ParcelDataList />
    </section>
  );
});
