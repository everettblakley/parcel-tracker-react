import * as testData from "../../db.json";
import * as utils from "./data.utilities";

describe("courierName", () => {
  test("returns an empty string for falsey values", () => {
    let testString;
    let result = utils.courierName(testString);
    expect(result).toStrictEqual("");
    testString = "";
    result = utils.courierName(testString);
    expect(result).toStrictEqual("");
  });

  test("returns sentence cased courier name", () => {
    const text = "lowercase letters";
    const result = utils.courierName(text);
    expect(result).toBe("Lowercase Letters");
  });

  test("returns text with spaces instead of underscores", () => {
    const text = "some_underscores_here";
    const result = utils.courierName(text);
    expect(result?.search("_")).toBe(-1);
  });

  test("returns sentence cased words with no underscores", () => {
    let text = "ALL_UPPER_CASE";
    let result = utils.courierName(text);
    expect(result).toBe("All Upper Case");
    text = "all_lower_case";
    result = utils.courierName(text);
    expect(result).toBe("All Lower Case");
  });
});

describe("parseParcelData", () => {
  test("returns an empty array if no couriers", () => {
    const data = {};
    expect(utils.parseParcelData(data)).toStrictEqual([]);
  });
  test("works for data with string locations", async () => {
    const data = testData["392404625680"];
    const newData = await utils.parseParcelData(data);
    expect(newData).toHaveLength(1);
    const couriers = newData.map((d) => d.courier);
    expect(couriers).toStrictEqual(["Fedex"]);
    expect(newData[0].stops).toHaveLength(1);
    const stop = newData[0].stops[0];
    expect(stop.events).toHaveLength(1);
    const event = stop.events[0];
    expect(stop.startDate).toStrictEqual(event.timestamp);
    expect(stop.endDate).toBeUndefined();
    expect(event.timestamp.year).toBe(2020);
    expect(event.timestamp.day).toBe(1);
    expect(event.timestamp.month).toBe(4);
    expect(event.status).toBe("Delivered");
    expect(event.location).toBe("LETHBRIDGE, AB");
  });
});
