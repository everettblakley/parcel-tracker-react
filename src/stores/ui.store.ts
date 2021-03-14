import { autorun, makeAutoObservable, runInAction } from "mobx";
import { RootStore } from './root.store';

export class UIStore {
  rootStore: RootStore;
  drawerOpen = false;

  get isMobile(): boolean {
    // Janky? A little
    return this.width ? this.width < 768 : false;
  }

  get width() {
    if (!window) {
      return undefined;
    }
    return window.innerWidth;
  }

  get height() {
    if (!window) {
      return undefined;
    }
    return window.innerHeight;
  }

  get drawerHeight() {
    if (!this.isMobile) {
      return "0px";
    }
    if (this.drawerOpen) {
      if (this.height) {
        return `${this.height / 2}px`;
      }
    }
    return "10vh";
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this);

    // Open the drawer whenever the root store data changes
    autorun(() => {
      if (this.rootStore.parcelData !== []) {
        runInAction(() => this.drawerOpen = true);
      } else {
        runInAction(() => this.drawerOpen = false);
      }
    })
  }
}