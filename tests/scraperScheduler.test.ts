import { runScraperForAllCountries } from "../src/scheduler/scraperScheduler";
import { extractTravelStatus } from "../src/scraper/extractTravelStatus";
import { cacheJSON } from "../src/caching/caching";
import type { pathKey } from "../types/travelStatusReponse";

jest.mock("../src/scraper/extractTravelStatus");
jest.mock("../src/caching/caching");

const mockedExtract = extractTravelStatus as jest.Mock;
const mockedCache = cacheJSON as jest.Mock;

describe("Scraper Cron Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should cache an error message if pathKeys are empty", async () => {
    const emptyKeys: pathKey[] = [];

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

    mockedExtract.mockResolvedValue(mockCountryData);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledWith("FI", false);

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

    const errorResponse = { code: "CH", httpCodeUM: 500 };
    mockedExtract.mockResolvedValue(errorResponse);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledTimes(3);
  });

  it("should stop retrying if it receives a successful (non-500) status", async () => {
    const mockKeys = [
      { code: "FI", english: "Finland", danish: "Finland", pathKey: "finland" },
    ];

    const successResponse = { code: "FI", httpCodeUM: 200 };
    mockedExtract.mockResolvedValue(successResponse);

    await runScraperForAllCountries(mockKeys);

    expect(mockedExtract).toHaveBeenCalledTimes(1);
  });
});
