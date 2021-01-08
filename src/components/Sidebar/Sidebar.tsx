import React from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores/store.context";

import "./Sidebar.scss";

export const Sidebar = observer(() => {
  const { store } = useStore();

  return (
    <aside className="Sidebar is-hidden-mobile">
      <header className="Sidebar-header has-background-light">
        <h2 className="title is-4">📦 Parcel Tracker</h2>
      </header>
      <section className="content py-4">
        {store.data ? (
          <pre>
            <code>{JSON.stringify(store.data)}</code>
          </pre>
        ) : (
          <p>Make a request to see the result</p>
        )}
      </section>
    </aside>
  );
});
