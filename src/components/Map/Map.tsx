import { StaticMap } from "react-map-gl";
import DeckGL from "deck.gl";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../stores/store.context";
import { Drawer } from "../Drawer";
import { Form } from "../Form/Form";
import "./Map.scss";
import { Arc } from "../../stores/root.store";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

export const Map = observer(function Map() {
  const { store } = useStore();

  useEffect(() => {
    console.log(store.arcsLayer);
  }, [store.arcsLayer]);

  const layers = store.arcsLayer ? [store.arcsLayer] : [];

  return (
    <main className="Map">
      <section className="Map-content">
        <Form />
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          layers={layers}
          controller={true}
          getTooltip={({ object }) => {
            if (object) {
              const arc = (object as unknown) as Arc;
              return { text: `${arc.from.name} to ${arc.to.name}` };
            }
            return null;
          }}
        >
          <StaticMap
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/everettblakley/ckf65ncr70a2i19pl8u7wgpi9"
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN || ""}
          />
        </DeckGL>
      </section>
      <Drawer />
    </main>
  );
});
