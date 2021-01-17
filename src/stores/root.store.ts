import { action, makeAutoObservable } from "mobx";
import { ParcelData, RawParcelData, Stop } from '../models';
import { parseParcelData } from '../utilities';
import { UIStore } from './ui.store';
import { ArcLayer, Position } from "deck.gl";

type Endpoint = { name: string; coordindates: Position; }

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

  setSelectedStop(stop: Stop) {
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
            coordindates: current.feature?.coordinates as Position
          },
          to: {
            name: next.location ? next.location.toString() : current.events[0].status,
            coordindates: next.feature?.coordinates as Position
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
      getSourcePosition: (d) => (d as Arc).from.coordindates as Position,
      getTargetPosition: (d) => (d as Arc).to.coordindates as Position,
      getHeight: 0.25
    })
  }

  constructor() {
    makeAutoObservable(this);

    this.uiStore = new UIStore(this);
  }
}