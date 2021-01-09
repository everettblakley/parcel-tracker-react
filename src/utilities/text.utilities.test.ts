import * as textUtilites from "./text.utilities";

describe("toSentenceCase", () => {
  test("returns provided values for falsy", () => {
    let text;
    expect(textUtilites.toSentenceCase(text)).toBeUndefined();
    text = "";
    expect(textUtilites.toSentenceCase(text)).toStrictEqual("");
  });

  test("works for single words", () => {
    let text = "test";
    text = textUtilites.toSentenceCase(text) as string;
    expect(text).toBe("Test");
  });

  test("works for multiple words", () => {
    let text = "this is a test";
    text = textUtilites.toSentenceCase(text) as string;
    expect(text).toBe("This Is A Test");
  });

  test("can handle special characters", () => {
    let text = "test!test";
    text = textUtilites.toSentenceCase(text) as string;
    expect(text).toBe("Test!test");
  });
});

describe("replaceUnderScores", () => {
  test("returns empty string for falsy", () => {
    let text;
    text = textUtilites.replaceUnderScores(text);
    expect(text).toBeUndefined();
    text = "";
    text = textUtilites.replaceUnderScores(text);
    expect(text).toBe("");
  });

  test("returns same string if no underscores", () => {
    let text = "some text";
    const result = textUtilites.replaceUnderScores(text);
    expect(result).toStrictEqual(text);
  });

  test("works for multiple underscores", () => {
    let text = "lots_of_underscores_in_here";
    const result = textUtilites.replaceUnderScores(text);
    expect(result).toBe("lots of underscores in here");
  });
});