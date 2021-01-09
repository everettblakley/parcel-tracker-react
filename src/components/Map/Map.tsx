import { observer } from "mobx-react";
import React from "react";
import { Drawer } from "../Drawer";
import { Form } from "../Form/Form";
import "./Map.scss";

export const Map = observer(function Map() {
  // const { store } = useStore();

  return (
    <main className="Map">
      <section className="Map-content">
        <Form />
      </section>
      <Drawer />
    </main>
  );
});
