import { makeAutoObservable } from "mobx";

export class RootStore {
  date: Date = new Date();
  count: number = 0;

  constructor() {
    makeAutoObservable(this);
  }
}