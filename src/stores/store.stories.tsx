import React, { useEffect } from "react";
import { ParcelData } from "../models";
import { Story } from "@storybook/react/types-6-0";
import { RootStore } from "./root.store";
import { StoreProvider } from "./store.context";
import { runInAction } from "mobx";

import "../index.scss";

const dummyData: ParcelData[] = [];

interface StoreProviderStoryProps {
  data?: ParcelData[];
  children: React.ReactNode;
}

export const StoreProviderTemplate: Story<StoreProviderStoryProps> = ({
  data,
  children,
}: StoreProviderStoryProps) => {
  const store = new RootStore();
  useEffect(() => {
    runInAction(() => (store.parcelData = data ?? dummyData));
  }, []);

  return <StoreProvider store={store}>{children}</StoreProvider>;
};
