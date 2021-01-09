import { observer } from "mobx-react";
import React from "react";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";
import { Loading } from "./components/Loading";
import { RootStore } from "./stores/root.store";
import { StoreProvider } from "./stores/store.context";

import "./App.scss";

const store = new RootStore();

const App = observer(function App() {
  return (
    <StoreProvider store={store}>
      <div className="App has-text-centered">
        <Loading isLoading={store.isLoading} />
        <Sidebar />
        <Map />
      </div>
    </StoreProvider>
  );
});

export default App;
