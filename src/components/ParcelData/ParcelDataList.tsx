import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { About } from "../About";
import { CourierView } from "./Courier";
import "./ParcelDataList.scss";

const CourierList = observer(function CourierList() {
  const store = useStore();
  return (
    <div>
      {store.parcelData.map((d, i) => {
        return (
          <React.Fragment key={d.courier}>
            <CourierView data={d} collapsable={store.parcelData.length > 1} />
            {i !== store.parcelData.length - 1 && (
              <span style={{ backgroundColor: "#ff0" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

export const ParcelDataList = observer<React.FC>(function ParcelDataList() {
  const store = useStore();
  return (
    <div className="has-text-left px-3 mt-2">
      {store.parcelData.length > 0 ? <CourierList /> : <About />}
    </div>
  );
});
