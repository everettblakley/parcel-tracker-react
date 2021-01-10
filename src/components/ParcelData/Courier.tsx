import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData, Stop } from "../../models";
import { StopView } from "./StopView";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    caretCollapsed: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    caretExpanded: {
      transform: "rotate(180deg)",
    },
  })
);

export interface CourierViewProps {
  data: ParcelData;
  collapsable: boolean;
}

export const CourierView = observer(function CourierView({
  data,
  collapsable,
}: CourierViewProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { caretCollapsed, caretExpanded } = useStyles();

  const handleClickCollapse = () => {
    if (!!collapsable) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      <ListItem
        button
        onClick={handleClickCollapse}
        className="has-background-light"
      >
        <ListItemText
          primary={<h5 className="mb-0">Delivered by {data.courier}</h5>}
        />
        {!!collapsable ? (
          <FaCaretDown
            onClick={handleClickCollapse}
            className={collapsed ? caretCollapsed : caretExpanded}
          />
        ) : null}
      </ListItem>
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        <ul className="mt-0 ml-0">
          {data.stops.map((stop: Stop) => (
            <StopView key={`${stop.startDate.toString()}`} stop={stop} />
          ))}
        </ul>
      </Collapse>
    </>
  );
});
