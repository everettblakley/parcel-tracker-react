import mapbox from "mapbox-gl";
import * as mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

mapbox.accessToken = accessToken as string;

export { mapbox, mapboxSdk, geocoding };
