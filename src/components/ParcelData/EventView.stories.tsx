import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { EventView, EventViewProps } from "./StopView";
import { StoreProviderTemplate } from "../../stores/store.stories";
import { TrackingEvent } from "../../models";
import moment from "moment";

export default {
  title: "EventView",
  component: EventView,
} as Meta;

const EventViewTemplate: Story<EventViewProps> = (args) => (
  <EventView {...args} />
);

export const NoConnector = EventViewTemplate.bind({});
const event: TrackingEvent = { timestamp: moment(), status: "Some status" };
NoConnector.args = {
  event: event,
  displayConnector: false,
};
