import React from "react";

import "./Sidebar.scss";

export const Sidebar = () => {
  return (
    <aside className="Sidebar has-background-light is-hidden-mobile py-6">
      <h1 className="title">This is the sidebar</h1>
      <small className="subtext">Well, one day</small>
    </aside>
  );
};
