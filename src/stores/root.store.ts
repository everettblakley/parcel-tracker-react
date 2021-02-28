import { ViewStateProps } from '@deck.gl/core/lib/deck';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import centroid from "@turf/centroid";
import { Feature, featureCollection, Point, Polygon } from '@turf/helpers';
import { ArcLayer, PolygonLayer, Position2D } from 'deck.gl';
import { action, makeAutoObservable } from "mobx";
import { ParcelData, RawParcelData, Stop } from '../models';
import { parseParcelData } from '../utilities';
import { UIStore } from './ui.store';

type Endpoint = { name: string; coordindates: Position2D; }

export type Arc = {
  from: Endpoint;
  to: Endpoint;
}

export class RootStore {
  uiStore: UIStore;
  isLoading = false;
  errorMessage: string = "";
  parcelData: ParcelData[] = [];
  trackingNumber: string = "";

  clear() {
    this.isLoading = true;
    return Promise.resolve(setTimeout(action(() => {
      this.trackingNumber = "";
      this.parcelData = [];
      this.isLoading = false;
    }), 500));
  }

  load(trackingNumber: string) {
    this.isLoading = true;
    this.errorMessage = "";
    this.trackingNumber = trackingNumber;
    const url = process.env.REACT_APP_API_URL + "/" + trackingNumber;
    fetch(url)
      .then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("Couldn't find a parcel with that tracking number");
        } else {
          console.error(response);
          throw new Error("Hmmm... Something went wrong");
        }
      })
      .then((data: RawParcelData) => parseParcelData(data))
      .then(action("setData", (data: ParcelData[]) => this.parcelData = data))
      .catch(action("setError", (err: Error) => {
        this.errorMessage = err.message;
        this.clear();
      }))
      .finally(action(() => (this.isLoading = false)))
  }

  pitch = 0;
  displayBBox = false;

  bboxLayerId = 'parcel-data-bbox';

  get bboxLayer() {
    const bbox = this.bbox;
    if (!bbox) {
      return null;
    }
    return new PolygonLayer({
      id: this.bboxLayerId,
      data: [this.bbox],
      pickable: false,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getPolygon: (d: any) => {
        if (d && d.geometry && d.geometry.coordinates) {
          return [...d.geometry.coordinates]
        }
        return []
      },
      getLineColor: (d) => [255, 0, 0],
      getFillColor: (d) => [255, 0, 0, 50],
      getLineWidth: 5
    })
  }

  get viewStateProps(): ViewStateProps | null {
    const selectedStop = this.selectedStop;
    if (selectedStop) {
      const feature = selectedStop.feature;
      if (feature) {
        return {
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          pitch: this.pitch,
          zoom: 10
        };
      }
    }
    const bbox = this.bbox;
    if (bbox) {
      const bboxCentroid = centroid(bbox);
      return {
        longitude: bboxCentroid.geometry.coordinates[0],
        latitude: bboxCentroid.geometry.coordinates[1],
        pitch: this.pitch,
        zoom: 4
      };
    }
    return null;
  }

  get selectedStop(): Stop | null {
    const courier = this.activeCourier;
    if (!courier) {
      return null;
    }
    const selected = courier.stops.filter(s => s.selected);
    const stop = selected.length > 0 ? selected[0] : null;
    // debugger;
    // if (stop?.feature) {
    //   let bbox = toJS(stop).feature?.bbox;
    //   if (bbox && bbox.length >= 4) {
    //     console.log(new WebMercatorViewport({}).fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]))
    //   }
    // }
    return stop;
  }

  set selectedStop(stop: Stop | null) {
    if (stop) {
      this.parcelData.forEach((parcelData: ParcelData) => {
        if (parcelData.active) {
          parcelData.stops.forEach((s: Stop) => {
            if (s === stop) {
              s.selected = !stop.selected;
            } else {
              s.selected = false;
            }
          });
        }
      });
    }
  }

  get features(): Feature<Point>[] {
    const courier = this.activeCourier;
    if (!this.activeCourier) {
      return [];
    }
    return courier?.stops
      .filter((s: Stop) => s.feature !== undefined)
      .map<Feature<Point>>((s: Stop) => s.feature!) || [];
  }

  get bbox(): Feature<Polygon> | null {
    if (!this.activeCourier) {
      return null;
    }
    return bboxPolygon(bbox(featureCollection(this.features)));
  }

  get activeCourier(): ParcelData | null {
    const active = this.parcelData.filter((p) => p.active);
    if (!active.length) {
      return null;
    }
    return active[0];
  }

  set activeCourier(parcelData: ParcelData | null) {
    this.parcelData.forEach((p: ParcelData) => {
      if (p === parcelData) {
        p.active = !parcelData.active;
      } else {
        p.active = false;
      }
    })
  }

  get arcs(): Arc[] {
    const courier = this.activeCourier;
    if (!courier) {
      return [];
    }
    const stops = courier.stops.filter((s: Stop) => s.feature !== null && s.feature !== undefined);
    const arcs = stops.reduce((output, current, index, array) => {
      if (index < array.length - 1) {
        const next = array[index + 1];
        const currentArc: Arc = {
          from: {
            name: current.location ? current.location.toString() : current.events[0].status,
            coordindates: current.feature?.geometry.coordinates as Position2D
          },
          to: {
            name: next.location ? next.location.toString() : current.events[0].status,
            coordindates: next.feature?.geometry.coordinates as Position2D
          }
        }
        return [...output, currentArc];
      }
      return [...output];
    }, [] as Arc[]);
    return arcs;
  }

  get arcsLayer() {
    if (!this.activeCourier) {
      return null;
    }
    return new ArcLayer({
      id: "stops",
      data: this.arcs,
      // Have to add a 3rd coordinate, as MobX was complaining about checking
      // out of bounds
      getSourcePosition: (d) => [...(d as Arc).from.coordindates, 0],
      getTargetPosition: (d) => [...(d as Arc).to.coordindates, 0],
      getHeight: 0.25,
      getWidth: 3
    })
  }

  constructor() {
    makeAutoObservable(this);

    this.uiStore = new UIStore(this);
  }
}