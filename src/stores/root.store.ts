import { action, autorun, makeAutoObservable, runInAction, spy } from "mobx";

export class RootStore {
  isLoading = false;
  errorMessage: string | undefined;
  date: Date = new Date();
  count: number = 0;

  load(trackingNumber: string) {
    this.isLoading = true;
    const url = process.env.REACT_APP_API_URL + "/" + trackingNumber;
    console.log(`URL: ${url}`)
    fetch(url)
      .then((res) => res.json())
      .then(console.log)
      .catch(action((err: Error) => this.errorMessage = err.toString()))
      .finally(action(() => (this.isLoading = false)))
  }

  constructor() {
    makeAutoObservable(this);

    spy(event => {
      if (event.type === "action") {
        console.log(`${event.name} was called`);
      }
    });
  }
}