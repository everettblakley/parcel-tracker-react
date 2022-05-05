import { Location } from "../models";

describe("Location", () => {
  test("isLocation works", () => {
    let partial = {};
    expect(Location.isLocation(partial)).toBeFalsy();
    partial = { City: "Incorrect spelling" };
    expect(Location.isLocation(partial)).toBeFalsy();
    partial = { city: "proper city" };
    expect(Location.isLocation(partial)).toBeTruthy();
    partial = { state: "proper state" };
    expect(Location.isLocation(partial)).toBeTruthy();
    partial = { postalCode: "proper postal code" };
    expect(Location.isLocation(partial)).toBeTruthy();
    partial = { country: "country" };
    expect(Location.isLocation(partial)).toBeTruthy();
  });
  test("can build from partial location object", () => {
    const partial = { city: "Somewhere", state: "Elsewhere" };
    const location = new Location(partial);
    expect(location.city).toBe("Somewhere");
    expect(location.state).toBe("Elsewhere");
    expect(location.country).toBeUndefined();
    expect(location.postalCode).toBeUndefined();
  });
  test("can build from a string", () => {
    const stringLocation = "SOMEPLACE, EARTH";
  });
})
