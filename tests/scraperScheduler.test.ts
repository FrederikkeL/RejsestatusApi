import {
  getPathKeys,
  runScraperForAllCountries,
} from "../src/scheduler/scraperScheduler";
import { extractTravelStatus } from "../src/scraper/extractTravelStatus";
import { cacheJSON, getCachedData } from "../src/caching/caching";
import type { pathKey } from "../types/travelStatusReponse";
import fs from "fs";

jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));

jest.mock("../src/scraper/extractTravelStatus");
jest.mock("../src/caching/caching");
jest.mock("fs");

const mockedExtract = extractTravelStatus as jest.Mock;
const mockedCache = cacheJSON as jest.Mock;

describe("Scraper Cron Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should cache an error message if pathKeys are empty", async () => {
    const emptyKeys: pathKey[] = [];

    (getCachedData as jest.Mock).mockResolvedValue({
      countries: [],
      version: "1.0.0",
      retrievedTime: "",
    });

    await runScraperForAllCountries(emptyKeys);

    expect(mockedCache).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMessage: "No path keys available to run the scraper.",
      }),
    );
  });

  it("should process countries and cache the results", async () => {
    const mockKeys = [
      { code: "FI", english: "Finland", danish: "Finland", pathKey: "finland" },
    ];
    const mockCountryData = { code: "FI", httpCodeUM: 200, travelStatuses: [] };

    (getCachedData as jest.Mock).mockResolvedValue({
      countries: [],
      version: "1.0.0",
      retrievedTime: "",
    });

    mockedExtract.mockResolvedValue(mockCountryData);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledWith("FI");

    expect(mockedCache).toHaveBeenCalledWith(
      expect.objectContaining({
        countries: [mockCountryData],
      }),
    );
  });

  it("should retry up to 3 times if a 500 error occurs", async () => {
    const mockKeys = [
      {
        code: "CH",
        english: "Switzerland",
        danish: "Schweiz",
        pathKey: "schweiz",
      },
    ];

    (getCachedData as jest.Mock).mockResolvedValue({
      countries: [],
      version: "1.0.0",
      retrievedTime: "",
    });

    const errorResponse = { code: "CH", httpCodeUM: 500 };
    mockedExtract.mockResolvedValue(errorResponse);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledTimes(3);
  });

  it("should stop retrying if it receives a successful (non-500) status", async () => {
    const mockKeys = [
      { code: "FI", english: "Finland", danish: "Finland", pathKey: "finland" },
    ];

    (getCachedData as jest.Mock).mockResolvedValue({
      countries: [],
      version: "1.0.0",
      retrievedTime: "",
    });

    const successResponse = { code: "FI", httpCodeUM: 200 };
    mockedExtract.mockResolvedValue(successResponse);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledTimes(1);
  });

  describe("getPathKeys - File Content Validation", () => {
    it("should return the list of keys when the file contains a valid JSON array", () => {
      const mockKeys = [
        {
          code: "FI",
          english: "Finland",
          danish: "Finland",
          pathKey: "finland",
        },
      ];

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockKeys));

      const result = getPathKeys();

      expect(result).toEqual(mockKeys);
      expect(result.length).toBe(1);
    });

    it("should return an empty array if the file exists but is empty", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue("");

      const result = getPathKeys();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
});
