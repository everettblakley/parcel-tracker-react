import { observer } from "mobx-react";
import React from "react";
import { Stop } from "../../models";
import { ListItem } from "./ListItem";

export const ListItems = observer(function ListItems({
  stops,
}: {
  stops: Stop[];
}) {
  return (
    <div>
      {stops.map((stop, index) => (
        <ListItem
          key={stop.startDate.toString()}
          stop={stop}
          displayConnector={stops.length > 1 && index < stops.length - 1}
        />
      ))}
    </div>
  );
});
