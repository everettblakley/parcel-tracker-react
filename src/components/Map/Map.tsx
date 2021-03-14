import { ViewStateProps } from "@deck.gl/core/lib/deck";
import DeckGL, { FlyToInterpolator } from "deck.gl";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { StaticMap } from "react-map-gl";
import { Arc } from "../../stores/root.store";
import { useStore } from "../../stores/store.context";
import { Drawer } from "../Drawer";
import { Form } from "../Form/Form";
import "./Map.scss";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1,
  pitch: 0,
  bearing: 0,
};

export const Map = observer(function Map() {
  const { store } = useStore();
  const [viewState, setViewState] = useState<ViewStateProps>(
    INITIAL_VIEW_STATE
  );

  useEffect(() => {
    document
      .getElementById("deckgl-wrapper")
      ?.addEventListener("contextmenu", (e) => e.preventDefault());
  }, []);

  useEffect(() => {
    let viewStateProps = store.viewStateProps;
    if (viewStateProps) {
      viewStateProps = {
        ...viewStateProps,
        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 500,
      };
      setViewState(viewStateProps);
    }
  }, [store.viewStateProps]);

  const layers = store.arcsLayer ? [store.arcsLayer] : [];

  const handleViewStateChange = (event: any) => setViewState(event.viewState);

  return (
    <main className="Map">
      <section className="Map-content">
        <Form />
        <DeckGL
          viewState={viewState || INITIAL_VIEW_STATE}
          onViewStateChange={handleViewStateChange}
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
