import { isDateFormatValid } from "../src/client/js/handleValidation";

describe("Testing the URL validation functionality", () => {
  test("isDateFormatValid is valid on mm/dd/yyyy", () => {
    const test_date = "01/30/2021";
    expect(isDateFormatValid(test_date)).toBe(true);
  });

  test("isDateFormatValid is invalid on formats NOT mm/dd/yyyy", () => {
    expect(isDateFormatValid("01-30-2021")).toBe(false);
    expect(isDateFormatValid("01-30-adfaf")).toBe(false);
    expect(isDateFormatValid("")).toBe(false);
  });
});
