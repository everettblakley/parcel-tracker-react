import { makeAutoObservable } from "mobx";
import { RootStore } from './root.store';

export class UIStore {
  rootStore: RootStore;
  drawerOpen = false;

  get isMobile(): boolean {
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
  }
}