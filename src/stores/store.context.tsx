import React, { createContext, useContext } from "react";
import { RootStore } from "./root.store";

type Context = { store: RootStore };

const StoreContext = createContext<Context | undefined>(undefined);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Must use `useStore` within a StoreProvider");
  }
  return store;
};

export const StoreProvider: React.FC<Context> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  );
};
