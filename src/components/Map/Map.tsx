import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { Drawer } from "../Drawer";

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
        <h1 className="title">This is the map (eventually)</h1>
        <button
          type="button"
          className="button is-primary"
          onClick={handleClick}
        >
          Toggle Loading
        </button>
      </section>
      <Drawer />
    </main>
  );
});
