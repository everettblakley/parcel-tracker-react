import { observer } from "mobx-react";
import React from "react";
import { ParcelData } from "../../models";
import { useStore } from "../../stores/store.context";
import { CourierView } from "./Courier";
import Divider from "@material-ui/core/Divider";
import "./LocationList.scss";
import List from "@material-ui/core/List";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { About } from "../About";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: "auto",
    },
  })
);

const CourierList = observer(function CourierList({
  data,
}: {
  data: ParcelData[];
}) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {data.map((d, i) => (
        <>
          <CourierView key={d.courier} data={d} collapsable={true} />
          {i !== data.length - 1 && <Divider />}
        </>
      ))}
    </List>
  );
});

export const ParcelDataList = observer(function ParcelDataList() {
  const { store } = useStore();
  const { data } = store.parcelDataStore;

  return (
    <div className="has-text-left px-3">
      {data.length === 1 ? (
        <CourierView data={data[0]} collapsable={false} />
      ) : data.length > 1 ? (
        <CourierList data={data} />
      ) : (
        <About />
      )}
    </div>
  );
});
