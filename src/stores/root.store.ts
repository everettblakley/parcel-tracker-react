import { action, makeAutoObservable } from "mobx";
import { RawParcelData } from '../models';
import { ParcelDataStore } from './parcelData.store';

export class RootStore {
  parcelDataStore: ParcelDataStore;
  isLoading = false;
  errorMessage: string | null = null;
  data: RawParcelData | null = null;
  trackingNumber: string = "";

  clear() {
    this.isLoading = true;
    return Promise.resolve(setTimeout(action(() => {
      this.data = null;
      this.trackingNumber = "";
      this.isLoading = false;
    }), 500));
  }

  load(trackingNumber: string) {
    this.isLoading = true;
    this.errorMessage = null;
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
      .then(action("setData", (data: any) => (this.data = data)))
      .catch(action("setError", (err: Error) => {
        this.errorMessage = err.message;
        this.clear();
      }))
      .finally(action(() => (this.isLoading = false)))
  }

  constructor() {
    makeAutoObservable(this);

    this.parcelDataStore = new ParcelDataStore(this);
  }
}