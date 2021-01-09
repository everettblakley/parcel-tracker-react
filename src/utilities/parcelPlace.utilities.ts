import { toJS } from 'mobx';
import { ParcelData, TrackingEvent, Location } from '../models';
import { replaceUnderScores, toSentenceCase } from './text.utilities';
import moment from "moment";

export const carrierName = (name?: string) => {
  if (!name) {
    return "";
  }
  name = replaceUnderScores(name);
  name = toSentenceCase(name);
  return name;
};

export const rawDataToTrackingEvent = (data: any): ParcelData[] => {
  // Get a raw JS array of the carrier names 
  const carriers = Object.keys(toJS(data));
  let initial: ParcelData[] = [];
  const parcelData = carriers.reduce((result, carrier) => {
    // Get the tracking events from the data
    const trackingData = data[carrier].map((t: any) => {
      const event: TrackingEvent = {
        timestamp: moment.utc(t.timestamp, "YYYY-MM-DDTHH:mm:ssZZ"),
        status: t.status,
        location: Location.isLocation(t.location) ? new Location(t.location) : t.location
      };
      return event;
    });
    const transformedName = carrierName(carrier) as string;
    return [...result, { "carrier": transformedName, events: [...trackingData] }]
  }, initial)
  return parcelData;
}