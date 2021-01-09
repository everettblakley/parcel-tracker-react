import { makeAutoObservable } from "mobx";
import { ParcelData } from '../models';
import { rawDataToTrackingEvent } from '../utilities';
import { RootStore } from './root.store';

export class ParcelDataStore {
  rootStore: RootStore;

  get trackingEvents(): ParcelData[] {
    if (!this.rootStore.data) {
      return [];
    }
    return rawDataToTrackingEvent(this.rootStore.data);
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }
}