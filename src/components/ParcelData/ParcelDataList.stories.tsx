import { Meta } from "@storybook/react/types-6-0";
import { runInAction } from "mobx";
import React, { useEffect } from "react";
import { useStore } from "../../stores/store.context";
import { StoreProviderTemplate } from "../../stores/store.stories";
import data from "../../testData/data.json";
import { parseParcelData } from "../../utilities";
import { ParcelDataList } from "./ParcelDataList";

export default {
  title: "ParcelDataList",
  component: ParcelDataList,
} as Meta;

export const NoData = StoreProviderTemplate.bind({});
NoData.args = { children: <ParcelDataList /> };

const OneCourierComponent = () => {
  const { store } = useStore();
  useEffect(() => {
    runInAction(async () => {
      store.parcelData = await parseParcelData(data["one_courier"]);
    });
  });

  return <ParcelDataList />;
};

export const OneCourier = StoreProviderTemplate.bind({});
OneCourier.args = {
  children: <OneCourierComponent />,
};
