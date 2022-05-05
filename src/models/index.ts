import { Feature, Point } from "@turf/helpers";
import { DateTime } from "luxon";
import { Color } from "../utilities/colour.utilities";
import { toSentenceCase } from "../utilities";

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
    return [this.city, this.state, this.country, this.postalCode]
      .filter(Boolean)
      .join(", ");
  }

  static isLocation(location: Partial<Location>): location is Location {
    const l = location as Location;
    return (
      l.city !== undefined ||
      l.country !== undefined ||
      l.postalCode !== undefined ||
      l.state !== undefined
    );
  }
}

export type RawTrackingEvent = Record<
  string,
  string | Record<string, string | undefined>
>;

export type RawParcelData = Record<string, RawTrackingEvent[]>;

export interface TrackingEvent {
  timestamp: DateTime;
  status: string;
  location?: string | Location;
}

export interface ParcelData {
  courier: string;
  stops: Stop[];
  active: boolean;
}

export interface Stop {
  startDate: DateTime;
  endDate?: DateTime;
  events: TrackingEvent[];
  location?: Location | string;
  selected: boolean;
  feature?: Feature<Point>;
  color?: Color;
}
