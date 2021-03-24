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

const Examples = () => {
  return (
    <ul>
      {/* <li>
        <b>{"YYC > YYZ -> YYC:"}</b> 4337360760364248
      </li>
      <li>
        <b>Two stops:</b> 4010765063638021
      </li> */}
    </ul>
  );
};

export const ParcelDataList = observer<React.FC>(function ParcelDataList() {
  const store = useStore();
  return (
    <div className="px-3 mt-2">
      {store.parcelData.length > 0 ? (
        <CourierList />
      ) : (
        <>
          <About />
          {process.env.NODE_ENV && <Examples />}
        </>
      )}
    </div>
  );
});
