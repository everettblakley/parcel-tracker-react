import { withStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import { observer } from "mobx-react";
import React from "react";
import { Stop } from "../../models";
import { StopView } from "./StopView";

/**
 * Overrides the default Timeline styles so they can left align
 */
const GlobalCss = withStyles({
  "@global": {
    ".MuiTimelineOppositeContent-root": {
      paddingLeft: 0,
      textAlign: "center",
    },
    ".MuiTimelineItem-content": {
      paddingRight: "0",
      paddingTop: "0",
      display: "flex",
      flexDirection: "column",
    },
    ".MuiTimelineSeparator-root": {
      minWidth: "30px",
    },
    ".MuiTimelineDot-root": {
      alignSelf: "center",
      marginBottom: "4px",
      marginTop: "4px",
    },
  },
})(() => null);

export const StopsTimeline = observer(function StopsTimeline({
  stops,
}: {
  stops: Stop[];
}) {
  return (
    <Timeline>
      <GlobalCss />
      {stops.map((stop, index) => (
        <StopView
          key={stop.startDate.toString()}
          stop={stop}
          displayConnector={stops.length > 1 && index < stops.length - 1}
        />
      ))}
    </Timeline>
  );
});
