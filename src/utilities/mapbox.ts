import mapboxgl from "mapbox-gl";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export { mapboxgl as mapbox, mapboxSdk, geocoding };
