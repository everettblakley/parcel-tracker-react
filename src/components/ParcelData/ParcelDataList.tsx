import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { About } from "../About";
import { CourierView } from "./Courier";
import "./ParcelDataList.scss";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "auto",
    },
  })
);

const CourierList = observer(function CourierList() {
  const { store } = useStore();
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {store.parcelData.map((d, i) => {
        return (
          <React.Fragment key={d.courier}>
            <CourierView data={d} collapsable={store.parcelData.length > 1} />
            {i !== store.parcelData.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </List>
  );
});

export const ParcelDataList = observer<React.FC>(function ParcelDataList() {
  const { store } = useStore();

  return (
    <div className="has-text-left px-3 mt-2">
      {store.parcelData.length > 0 ? <CourierList /> : <About />}
    </div>
  );
});
