import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ParcelData } from "../../models";
import { useStore } from "../../stores/store.context";
import { ListItems } from "./ListItems";

export interface ListGroupProps {
  data: ParcelData;
  collapsable: boolean;
}

export const ListGroup = observer(function ListGroup({
  data,
  collapsable,
}: ListGroupProps) {
  const store = useStore();

  const handleClickCollapse = () => {
    if (!!collapsable) {
      runInAction(() => (store.activeCourier = data));
    }
  };

  return (
    <>
      <div onClick={handleClickCollapse} className="has-background-light p-2">
        <h5 className="mb-0">Delivered by {data.courier}</h5>
        {!!collapsable ? (
          <FaCaretDown
            onClick={handleClickCollapse}
            className={data.active ? "caretExpanded" : "caretCollapsed"}
          />
        ) : null}
      </div>
      <div>
        <ListItems stops={data.stops} />
      </div>
    </>
  );
});
