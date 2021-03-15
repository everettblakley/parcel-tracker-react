import { Meta } from "@storybook/react/types-6-0";
import { runInAction } from "mobx";
import React, { useEffect } from "react";
import { useStore } from "src/stores/store.context";
import { parseParcelData } from "src/utilities";
import { StoreProviderTemplate } from "../../stores/store.stories";
import data from "../../testData/data.json";
import { StopView } from "./StopView";

export default {
  title: "StopView",
  component: StopView,
} as Meta;

// export const NoLocation = StoreProviderTemplate.bind({});
// const NoLocationComponent = () => {
//   const { store } = useStore();
//   useEffect(() => {
//     runInAction(async () => {
//       store.parcelData = await parseParcelData(data["one_stop"]);
//     });
//   });

//   return store.parcelData?.length > 0 ? <h1>h1</h1> : <h3>bye</h3>;
// };

// NoLocation.args = {
//   children: <NoLocationComponent />,
// };
