import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData } from "../../models";
import { useStore } from "../../stores/store.context";
import { StopsTimeline } from "./Timeline";

export interface CourierViewProps {
  data: ParcelData;
  collapsable: boolean;
}

export const CourierView = observer(function CourierView({
  data,
  collapsable,
}: CourierViewProps) {
  const { store } = useStore();

  const handleClickCollapse = () => {
    if (!!collapsable) {
      runInAction(() => (store.activeCourier = data));
    }
  };

  return (
    <>
      <div
        onClick={handleClickCollapse}
        className="has-background-light p-2"
      >
        <h5 className="mb-0">Delivered by {data.courier}</h5>
        {!!collapsable ? (
          <FaCaretDown
            onClick={handleClickCollapse}
            className={data.active ? "caretExpanded" : "caretCollapsed"}
          />
        ) : null}
      </div>
      <div>
        <StopsTimeline stops={data.stops} />
      </div>
    </>
  );
});
