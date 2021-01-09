import { autorun, makeAutoObservable } from "mobx";
import { ParcelData } from '../models';
import { parseParcelData } from '../utilities';
import { RootStore } from './root.store';

export class ParcelDataStore {
  rootStore: RootStore;

  get data(): ParcelData[] {
    if (!this.rootStore.data) {
      return [];
    }
    return parseParcelData(this.rootStore.data);
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
    autorun(() => console.log(this.data));
  }
}