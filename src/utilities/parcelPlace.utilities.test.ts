import * as utils from "./parcelPlace.utilities"
import * as testData from "../../db.json";
import { Location } from '../models';

describe("carrierName", () => {
  test("returns an empty string for falsey values", () => {
    let testString;
    let result = utils.carrierName(testString);
    expect(result).toStrictEqual("");
    testString = "";
    result = utils.carrierName(testString);
    expect(result).toStrictEqual("");
  });

  test("returns sentence cased carrier name", () => {
    const text = "lowercase letters";
    const result = utils.carrierName(text);
    expect(result).toBe("Lowercase Letters");
  });

  test("returns text with spaces instead of underscores", () => {
    const text = "some_underscores_here";
    const result = utils.carrierName(text);
    expect(result?.search("_")).toBe(-1);
  });

  test("returns sentence cased words with no underscores", () => {
    let text = "ALL_UPPER_CASE";
    let result = utils.carrierName(text);
    expect(result).toBe("All Upper Case");
    text = "all_lower_case";
    result = utils.carrierName(text);
    expect(result).toBe("All Lower Case");
  });
});

describe("rawDataToTrackingEvent", () => {
  test("returns an empty array if no carriers", () => {
    const data = {};
    expect(utils.rawDataToTrackingEvent(data)).toStrictEqual([]);
  });
  test("works for data with string locations", () => {
    const data = testData["392404625680"];
    const newData = utils.rawDataToTrackingEvent(data);
    expect(newData).toHaveLength(1);
    const carriers = newData.map((d) => d.carrier);
    expect(carriers).toStrictEqual(["Fedex"]);
    expect(newData[0].events).toHaveLength(1);
    const event = newData[0].events[0];
    expect(event.timestamp.year()).toBe(2020);
    expect(event.timestamp.format("D")).toBe("1");
    expect(event.timestamp.month()).toBe(4);
    expect(event.status).toBe("Delivered");
    expect(event.location).toBe("LETHBRIDGE, AB");
  });
})