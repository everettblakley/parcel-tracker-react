import React from "react";

import "./Sidebar.scss";

export const Sidebar = () => {
  return (
    <aside className="Sidebar is-hidden-mobile">
      <header className="Sidebar-header has-background-light">
        <h2 className="title is-4">📦 Parcel Tracker</h2>
      </header>
      <section className="content py-4">
        <h5>This is the sidebar</h5>
        <p>Well, one day</p>
      </section>
    </aside>
  );
};
