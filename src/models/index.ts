import { toSentenceCase } from "../utilities";
import { Moment } from "moment";

export class Location {
  city: string | undefined = undefined;
  state: string | undefined = undefined;
  postalCode: string | undefined = undefined;
  country: string | undefined = undefined;

  constructor(location: Partial<Location>) {
    if (Location.isLocation(location)) {
      this.city = toSentenceCase(location.city);
      this.state = location.state;
      this.postalCode = location.postalCode;
      this.country = toSentenceCase(location.country);
    }
  }

  toString(): string {
    return [this.city, this.state, this.country, this.postalCode].filter(Boolean).join(", ");
  }

  static isLocation(location: Partial<Location>): boolean {
    const l = (location as Location);
    return l.city !== undefined || l.country !== undefined || l.postalCode !== undefined || l.state !== undefined;
  }
}

export interface TrackingEvent {
  timestamp: Moment;
  status: string;
  location?: string | Location;
}

export interface ParcelData {
  carrier: string;
  events: TrackingEvent[];
}