import { runInAction } from "mobx";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Counter } from "./components/Counter";
import { RootStore } from "./stores/root.store";

const store = new RootStore();

const App = observer(() => {
  useEffect(() => {
    const interval = setInterval(
      () => runInAction(() => (store.count += 1)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container has-text-centered">
      <h1 className="title">Parcel Tracker</h1>
      <Counter count={store.count} />
    </main>
  );
});

export default App;
