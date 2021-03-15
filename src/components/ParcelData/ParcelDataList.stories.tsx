import { Meta } from "@storybook/react/types-6-0";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
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

const OneCourierComponent = observer(function({ count }: { count: number}) {
  const { store } = useStore();
  useEffect(() => {
    (async () => {
      const courierData = data["one_courier"]
      courierData['SOME_COURIER'] = courierData['SOME_COURIER'].slice(0, count);
      const parsedData = await parseParcelData(courierData);
      console.log(parsedData[0].stops.length);
      runInAction(() => store.parcelData = parsedData);
    })();
  });

  return <ParcelDataList />;
});

export const TwoStops = StoreProviderTemplate.bind({});
TwoStops.args = {
  children: <OneCourierComponent count={2} />,
};

export const ThreeStops = StoreProviderTemplate.bind({});
ThreeStops.args = {
  children: <OneCourierComponent count={4} />,
};

export const SevenStops = StoreProviderTemplate.bind({});
SevenStops.args = {
  children: <OneCourierComponent count={7} />,
};

export const TwelveStops = StoreProviderTemplate.bind({});
TwelveStops.args = {
  children: <OneCourierComponent count={12} />,
};