import { action, makeAutoObservable } from "mobx";
import { ParcelData, RawParcelData, Stop } from '../models';
import { parseParcelData } from '../utilities';
import { UIStore } from './ui.store';

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

  setActiveCourier(parcelData: ParcelData) {
    this.parcelData.forEach((p: ParcelData) => {
      if (p === parcelData) {
        p.active = !parcelData.active;
      } else {
        p.active = false;
      }
    })
  }

  constructor() {
    makeAutoObservable(this);

    this.uiStore = new UIStore(this);
  }
}