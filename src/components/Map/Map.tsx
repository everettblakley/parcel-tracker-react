import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { Drawer } from "../Drawer";
import { Form } from "../Form/Form";

import "./Map.scss";

export const Map = observer(() => {
  const { store } = useStore();

  const toggleLoading = action("toggleLoading", () => {
    store.isLoading = !store.isLoading;
  });

  const handleClick = () => {
    toggleLoading();
    setTimeout(toggleLoading, 1000);
  };

  return (
    <main className="Map">
      <section className="Map-content">
        <Form />
      </section>
      <Drawer />
    </main>
  );
});
