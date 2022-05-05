import { MapiResponse } from "@mapbox/mapbox-sdk/lib/classes/mapi-response";
import { Feature, Point, point } from "@turf/helpers";
import { toJS } from "mobx";
import { DateTime } from "luxon";

import {
  Location,
  ParcelData,
  RawParcelData,
  RawTrackingEvent,
  Stop,
  TrackingEvent,
} from "../models";
import { getColor } from "./colour.utilities";
import { geocoding, mapbox, mapboxSdk } from "./mapbox";
import { replaceUnderScores, toSentenceCase } from "./text.utilities";

export const courierName = (name?: string) => {
  if (!name) {
    return "";
  }
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
};

export const parseParcelData = async (
  rawData: RawParcelData
): Promise<ParcelData[]> => {
  // Get a raw JS array of the courier names
  const couriers = Object.keys(toJS(rawData));
  let parcelData: ParcelData[] = [];
  for (const courier of couriers) {
    const rawEvents: RawTrackingEvent[] = rawData[courier];
    const events = parseTrackingEvents(rawEvents);
    const stops = await parseStops(events);
    const name = courierName(courier) as string;
    parcelData.push({ courier: name, stops, active: couriers.length === 1 });
  }
  return parcelData;
};

export const parseTrackingEvents = (
  rawEvents: RawTrackingEvent[]
): TrackingEvent[] => {
  const events = rawEvents.map((t: any) => {
    const event: TrackingEvent = {
      timestamp: DateTime.fromISO(t.timestamp),
      status: t.status,
      location: Location.isLocation(t.location)
        ? new Location(t.location)
        : t.location,
    };
    return event;
  });
  return events;
};

export const parseStops = async (events: TrackingEvent[]): Promise<Stop[]> => {
  const stops: Stop[] = [];
  // Copy the events
  let data = [...events];

  // Sort the events by the timestamp
  data.sort((a, b) =>
    a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0
  );

  let event;
  // Remove first event from array
  while ((event = data.shift())) {
    let stop: Stop = {
      startDate: event.timestamp,
      events: [event],
      selected: false,
    };
    if (event.location) {
      stop.location = event.location;
      const locations: Set<string> = new Set([event.location.toString()]);

      let spliceIndex = 0;
      let nextEvent = data[spliceIndex];

      do {
        const nextLocation = nextEvent?.location?.toString() || "";
        locations.add(nextLocation);
        spliceIndex += 1;
        nextEvent = data[spliceIndex];
      } while (locations.size === 1);

      if (spliceIndex > 1) {
        let removedEvents = data.splice(0, spliceIndex - 1);
        removedEvents = [event, ...removedEvents];
        stop.events = removedEvents;
        stop.endDate = removedEvents[removedEvents.length - 1].timestamp;
      }

      const feature = await getGeolocation(event?.location?.toString());
      if (feature) {
        stop.feature = feature;
      }
    }
    stops.push(stop);
  }
  const { length } = stops;
  stops.forEach((stop, index) => {
    stop.color = getColor(length, index);
  });

  return Promise.resolve(stops);
};

export const getGeolocation = async (
  location: string
): Promise<Feature<Point> | undefined> => {
  const mapboxClient = mapboxSdk({ accessToken: mapbox.accessToken });
  const geocodingClient = geocoding(mapboxClient);
  if (!geocodingClient || !location) {
    return undefined;
  }
  return geocodingClient
    .forwardGeocode({
      query: location.toString(),
      autocomplete: false,
      limit: 1,
      mode: "mapbox.places",
    })
    .send()
    .then((response: MapiResponse) => {
      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        const feature = response.body.features[0];
        if (!feature.coordinates) {
          if ("geometry" in (feature as any)) {
            feature.coordinates = feature.geometry.coordinates;
          }
        }
        return point(feature.coordinates);
      }
    })
    .catch((error: Error) => {
      console.error(error);
      return undefined;
    });
};
