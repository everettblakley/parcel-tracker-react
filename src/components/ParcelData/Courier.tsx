import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData } from "../../models";
import { StopsTimeline } from "./Timeline";

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
        <StopsTimeline stops={data.stops} />
      </Collapse>
    </>
  );
});
