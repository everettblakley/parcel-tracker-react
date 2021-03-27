import { WebMercatorViewport } from '@deck.gl/core';
import { ViewStateProps } from '@deck.gl/core/lib/deck';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { Feature, featureCollection, Point, Polygon } from '@turf/helpers';
import { ArcLayer, Position2D } from 'deck.gl';
import { action, autorun, makeAutoObservable, runInAction } from 'mobx';
import { Color } from 'src/utilities/colour.utilities';
import { ParcelData, RawParcelData, Stop } from '../models';
import { parseParcelData } from '../utilities';
import { UIStore } from './ui.store';

type Endpoint = { name: string; coordindates: Position2D };

export type Arc = {
  from: Endpoint;
  to: Endpoint;
  color?: Color;
};

export class RootStore {
  uiStore: UIStore;
  isLoading = false;
  errorMessage: string = '';
  parcelData: ParcelData[] = [];
  trackingNumber: string = '';
  pitch = 0;

  /**
   * Removes the current data from the store
   * A timeout is set to give a more natual feel
   */
  clear() {
    this.isLoading = true;
    return Promise.resolve(
      setTimeout(
        action(() => {
          this.trackingNumber = '';
          this.parcelData = [];
          this.isLoading = false;
        }),
        500
      )
    );
  }

  /**
   * Get the data from the API given a tracking number
   * @params trackingNumber
   */
  load(trackingNumber: string) {
    this.isLoading = true;
    this.errorMessage = '';
    this.trackingNumber = trackingNumber;
    const url = process.env.REACT_APP_API_URL + '/' + trackingNumber;
    fetch(url)
      .then((response: Response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("Couldn't find a parcel with that tracking number");
        } else {
          console.error(response);
          throw new Error('Hmmm... Something went wrong');
        }
      })
      // Once the "raw" data is received, we parse it
      .then((data: RawParcelData) => parseParcelData(data))
      // Then set the parcelData with the parsed data, which fires all the other
      // reactions
      .then(action('setData', (data: ParcelData[]) => (this.parcelData = data)))
      .catch(
        action('setError', (err: Error) => {
          this.errorMessage = err.message;
          this.clear();
        })
      )
      .finally(action(() => (this.isLoading = false)));
  }

  /**
   * The current view state props of the map
   */
  get viewStateProps(): ViewStateProps | null {
    const selectedStop = this.selectedStop;
    // If a stop is selected, we zoom to that stop
    if (selectedStop) {
      const feature = selectedStop.feature;
      if (feature) {
        return {
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          pitch: this.pitch,
          zoom: 10, // Need to work out how to dynamically set the zoom
        };
      }
    }
    return this.viewStateForStops;
  }

  /**
   * @returns the currently selected the Stop
   */
  get selectedStop(): Stop | null {
    const courier = this.activeCourier;
    if (!courier) {
      return null;
    }
    const selected = courier.stops.filter((s) => s.selected);
    return selected.length > 0 ? selected[0] : null;
  }

  /**
   * Sets the currently selected Stop
   * @param stop the current stop, or null for de-selecting
   */
  set selectedStop(stop: Stop | null) {
    if (stop) {
      this.parcelData.forEach((parcelData: ParcelData) => {
        if (parcelData.active) {
          parcelData.stops.forEach((s: Stop) => {
            if (s === stop) {
              s.selected = !stop.selected;
            } else {
              s.selected = false;
            }
          });
        }
      });
    }
  }

  /**
   * @returns the spatial data for the currently selected courier's parcel data
   */
  get features(): Feature<Point>[] {
    const courier = this.activeCourier;
    if (!this.activeCourier) {
      return [];
    }
    return (
      courier?.stops
        .filter((s: Stop) => s.feature !== undefined)
        .map<Feature<Point>>((s: Stop) => s.feature!) || []
    );
  }

  /**
   * @returns a polygon representing the minimum bounding geometry of all stops
   */
  get minimumBoundingGeometry(): Feature<Polygon> | null {
    if (!this.activeCourier) {
      return null;
    }
    return bboxPolygon(bbox(featureCollection(this.features)));
  }

  /**
   * @returns the top-left and bottom-right of the bbox around the stops
   */
  get bounds(): [[number, number], [number, number]] | null {
    const minBounds = this.minimumBoundingGeometry;
    if (!minBounds) return null;
    const bbox = minBounds!.bbox;
    if (!bbox) return null;
    return [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
  }

  /**
   * @returns the view state for the current stops, by using the Viewport fitBounds method
   */
  get viewStateForStops(): ViewStateProps | null {
    const bounds = this.bounds;
    if (!bounds) return null;

    // Get initial values for the map width
    let { width, height } = this.uiStore;
    const map = document.getElementById('Map');
    if (map) {
      width = map.clientWidth;
      height = map.clientHeight;
    }

    let viewport: any = new WebMercatorViewport({
      width,
      height,
      pitch: this.pitch,
    });
    viewport = viewport.fitBounds(bounds, { padding: 32 });
    const { latitude, longitude, altitude, bearing, zoom } = viewport;
    return {
      latitude,
      longitude,
      altitude,
      bearing,
      zoom,
      pitch: this.pitch,
    };
  }

  /**
   * @returns the currently selected courier
   */
  get activeCourier(): ParcelData | null {
    const active = this.parcelData.filter((p) => p.active);
    if (!active.length) {
      return null;
    }
    return active[0];
  }

  /**
   * Sets the current courier
   * @param parcelData the data corresponding to the courier, or null for de-selecting
   */
  set activeCourier(parcelData: ParcelData | null) {
    this.parcelData.forEach((p: ParcelData) => {
      if (p === parcelData) {
        p.active = !parcelData.active;
      } else {
        p.active = false;
      }
    });
  }

  /**
   * @returns the arcs between stops that have a feature property for the currently selected courier
   */
  get arcs(): Arc[] {
    const courier = this.activeCourier;
    if (!courier) {
      return [];
    }
    const stops = courier.stops.filter(
      (s: Stop) => s.feature !== null && s.feature !== undefined
    );
    const arcs = stops.reduce((output, current, index, array) => {
      if (index < array.length - 1) {
        const next = array[index + 1];
        const currentArc: Arc = {
          from: {
            name: current.location
              ? current.location.toString()
              : current.events[0].status,
            coordindates: current.feature?.geometry.coordinates as Position2D,
          },
          to: {
            name: next.location
              ? next.location.toString()
              : current.events[0].status,
            coordindates: next.feature?.geometry.coordinates as Position2D,
          },
          color: current.color,
        };
        return [...output, currentArc];
      }
      return [...output];
    }, [] as Arc[]);
    return arcs;
  }

  /**
   * @returns an ArcLayer with the computed arcs
   */
  get arcsLayer() {
    if (!this.activeCourier) {
      return [];
    }
    return [
      new ArcLayer({
        id: 'stops',
        data: this.arcs,
        // Have to add a 3rd coordinate, as MobX was complaining about checking
        // out of bounds
        getSourcePosition: (d) => [...(d as Arc).from.coordindates, 0],
        getTargetPosition: (d) => [...(d as Arc).to.coordindates, 0],
        getSourceColor: (d) => (d as Arc)?.color?.rgba ?? [0, 0, 0, 255],
        getTargetColor: (d) => (d as Arc)?.color?.rgba ?? [0, 0, 0, 255],
        getHeight: 0.25,
        getWidth: 3,
      }),
    ];
  }

  constructor() {
    makeAutoObservable(this);

    this.uiStore = new UIStore(this);

    // Set up reaction to change the pitch when parcel data is set
    autorun(() => {
      const pitch = this.parcelData?.length ? 60 : 0;
      runInAction(() => (this.pitch = pitch));
    });
  }
}
