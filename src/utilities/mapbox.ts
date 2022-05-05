// @ts-ignore
import mapbox from "mapbox-gl/dist/mapbox-gl";
import * as mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

mapbox.accessToken = accessToken as string;

// eslint-disable-next-line import/no-webpack-loader-syntax
mapbox.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export { mapbox, mapboxSdk, geocoding };
