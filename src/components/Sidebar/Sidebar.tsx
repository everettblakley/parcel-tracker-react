import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores/store.context";

import "./Sidebar.scss";
import { ParcelList } from "../Parcel/ParcelList";

export const Sidebar = observer(() => {
  const { store } = useStore();

  return (
    <aside className="Sidebar is-hidden-mobile">
      <header className="Sidebar-header has-background-light">
        <h2 className="title is-4">📦 Parcel Tracker</h2>
      </header>
      <section className="Sidebar-content content py-4">
        <ParcelList />
      </section>
      <footer className="Sidebar-footer p-2 has-background-light">
        <a
          className="is-size-7 text-muted"
          href="https://www.github.com/everettblakley/parcel-tracker-react"
          title="source code"
        >
          Check out the code on Github
        </a>
        <p className="is-size-7 is-italic">
          &copy; Copyright {new Date().getFullYear()} -{" "}
          <a href="https://www.github.com/everettblakley">Everett Blakley</a>
        </p>
      </footer>
    </aside>
  );
});
