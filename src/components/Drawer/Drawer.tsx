import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FaCaretUp } from "react-icons/fa";
import { useStore } from "../../stores/store.context";
import { Footer } from "../Footer";
import { ListContent } from "../List";
import "./Drawer.scss";

export const Drawer = observer(function Drawer() {
  const store = useStore();
  const { uiStore } = store;

  const handleDrawerButton = action("toggleDrawer", () => {
    uiStore.drawerOpen = !uiStore.drawerOpen;
  });

  return (
    <section className="Drawer is-hidden-tablet has-background-light">
      <button
        onClick={handleDrawerButton}
        className="button is-light m-2"
        title="Open drawer"
      >
        <FaCaretUp
          className={`Drawer-button ${
            uiStore.drawerOpen ? "Drawer-button__open" : "Drawer-button__closed"
          }`}
        />
      </button>

      <div
        className="Drawer-content"
        style={{ maxHeight: uiStore.drawerOpen ? uiStore.drawerHeight : 0 }}
      >
        <ListContent />
        <Footer />
      </div>
    </section>
  );
});
