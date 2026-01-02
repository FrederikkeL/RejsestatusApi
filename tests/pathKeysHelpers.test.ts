import * as pathKeysHelpers from "./../src/helpers/pathKeysHelpers"; // update to your file path
import fs from "fs";

jest.mock("fs");

describe("Country Lookup Utilities", () => {
  const mockCountryData = [
    { code: "FR", english: "France", danish: "Frankrig", pathKey: "frankrig" },
    { code: "FI", pathKey: "finland", danish: "Finland", english: "Finland" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockCountryData),
    );
  });

  describe("findPathKeyByCode", () => {
    it("should return the correct pathKey for a valid code", () => {
      const result = pathKeysHelpers.findPathKeyByCode("FI");
      expect(result).toBe("finland");
    });

    it("should be case-insensitive", () => {
      const result = pathKeysHelpers.findPathKeyByCode("fi");
      expect(result).toBe("finland");
    });

    it("should return undefined if code is not found", () => {
      const result = pathKeysHelpers.findPathKeyByCode("NONEXISTENT");
      expect(result).toBeUndefined();
    });
  });

  describe("findEnglishNameByCode", () => {
    it("should return the English name if found", () => {
      expect(pathKeysHelpers.findEnglishNameByCode("FR")).toBe("France");
    });

    it("should return the input countryCode if NOT found", () => {
      expect(pathKeysHelpers.findEnglishNameByCode("XYZ")).toBe("XYZ");
    });
  });

  describe("findDanishNameByCode", () => {
    it("should return the correct Danish name for a valid code", () => {
      expect(pathKeysHelpers.findDanishNameByCode("FR")).toBe("Frankrig");
    });

    it("should return the input countryCode if NOT found", () => {
      expect(pathKeysHelpers.findDanishNameByCode("XYZ")).toBe("XYZ");
    });
  });

  describe("findMockDanishNameByCode", () => {
    it("should call the correct mock file path", () => {
      pathKeysHelpers.findMockDanishNameByCode("FR");

      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining("mockCountryPathKeys.json"),
        "utf-8",
      );
    });
  });
});
