import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/store.context";
import { ListGroup } from "./ListGroup";

export const List = observer(function List() {
  const store = useStore();
  return (
    <div>
      {store.parcelData.map((d, i) => {
        return (
          <React.Fragment key={d.courier}>
            <ListGroup data={d} collapsable={store.parcelData.length > 1} />
            {i !== store.parcelData.length - 1 && (
              <span style={{ backgroundColor: "#ff0" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});
