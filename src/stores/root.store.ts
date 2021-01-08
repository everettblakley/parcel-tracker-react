import { autorun, makeAutoObservable, spy } from "mobx";

export class RootStore {
  isLoading = false;
  date: Date = new Date();
  count: number = 0;

  constructor() {
    makeAutoObservable(this);

    spy(event => {
      if (event.type === "action") {
        console.log(`${event.name} was called`);
      }
    });
  }
}