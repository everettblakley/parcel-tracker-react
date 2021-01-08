import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { Drawer } from "../Drawer";
import { Form } from "../Form/Form";
import { FaGithub } from "react-icons/fa";

import "./Map.scss";

const GithubCornerTag = () => {
  return (
    <div className="GH-container has-background-dark p-2">
      <div className="GH-content">
        <a
          href="https://github.com/everettblakley/parcel-tracker-react"
          title="View code on GitHub"
        >
          <FaGithub className="has-text-white is-size-3" />
        </a>
      </div>
    </div>
  );
};

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
        <GithubCornerTag />
      </section>
      <Drawer />
    </main>
  );
});
