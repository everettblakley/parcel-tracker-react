import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { Loading } from "./components/Loading";
import { Map } from "./components/Map";
import { Sidebar } from "./components/Sidebar";
import { useQueryParams } from "./hooks";
import { RootStore } from "./stores/root.store";
import { StoreProvider } from "./stores/store.context";
import "./App.scss";

const store = new RootStore();

const App = observer(function App() {
  const query = useQueryParams();
  const location = useLocation();
  const trackingNumber = query.get("trackingNumber");

  useEffect(() => {
    if (trackingNumber && location.pathname === "/") {
      store.load(trackingNumber);
    } else {
      store.clear();
    }
  }, [trackingNumber, location]);

  return (
    <StoreProvider store={store}>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <Loading isLoading={store.isLoading} />
            <Sidebar />
            <Map />
          </div>
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </StoreProvider>
  );
});

export default App;
