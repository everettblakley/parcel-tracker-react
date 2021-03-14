import React from "react";
import { StoreProviderTemplate } from "../../stores/store.stories";
import { Meta } from "@storybook/react/types-6-0";

import { StopView } from "./StopView";
import { Stop } from "../../models";
import moment from "moment";

export default {
  title: "StopView",
  component: StopView,
} as Meta;

export const NoLocation = StoreProviderTemplate.bind({});
const stop: Stop = {
  startDate: moment(),
  events: [],
  selected: false,
};
NoLocation.args = {
  children: <StopView stop={stop} displayConnector={false} />,
};
