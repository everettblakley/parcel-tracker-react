import Collapse from "@material-ui/core/Collapse";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData } from "../../models";
import { useStore } from "../../stores/store.context";
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
  const { store } = useStore();
  const { caretCollapsed, caretExpanded } = useStyles();

  const handleClickCollapse = () => {
    if (!!collapsable) {
      runInAction(() => (store.activeCourier = data));
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
            className={data.active ? caretExpanded : caretCollapsed}
          />
        ) : null}
      </ListItem>
      <Collapse in={data.active} timeout="auto" unmountOnExit>
        <StopsTimeline stops={data.stops} />
      </Collapse>
    </>
  );
});
