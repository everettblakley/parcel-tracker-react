import { action, autorun, makeAutoObservable } from "mobx";
import { ParcelDataStore } from './parcelData.store';

export class RootStore {
  parcelDataStore: ParcelDataStore;
  isLoading = false;
  errorMessage: string | undefined;
  data: any;

  clear() {
    this.isLoading = true;
    setTimeout(action(() => {
      this.data = null;
      this.isLoading = false;
    }), 500);
  }

  load(trackingNumber: string) {
    this.isLoading = true;
    const url = process.env.REACT_APP_API_URL + "/" + trackingNumber;
    fetch(url)
      .then(res => res.json())
      .then(action("setData", (data: any) => (this.data = data)))
      .catch(action((err: any) => (this.errorMessage = err.toString())))
      .finally(action(() => (this.isLoading = false)))
  }

  constructor() {
    makeAutoObservable(this);

    this.parcelDataStore = new ParcelDataStore(this);
    autorun(() => console.dir(this.data));
  }
}