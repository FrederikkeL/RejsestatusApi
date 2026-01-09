import * as caching from "../src/caching/caching";
import fs from "fs/promises";
import fsSync from "fs";
import { CountryListResponse } from "../types/travelStatusReponse";

describe("caching.ts", () => {
  const mockData: CountryListResponse = {
    retrievedTime: "2023-01-01",
    version: "1.0.0",
    countries: [{ country: "Denmark", httpCodeUM: 200 }],
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully cache data (writeFile)", async () => {
    const spy = jest.spyOn(fs, "writeFile").mockResolvedValue(undefined);

    await caching.cacheJSON(mockData);

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("data.json"),
      expect.stringContaining("Denmark"),
      "utf-8",
    );
  });

  it("should throw an error if the file system fails", async () => {
    const spy = jest.spyOn(fs, "writeFile");

    spy.mockRejectedValue(new Error("Disk Full"));

    await expect(
      caching.cacheJSON(mockData as CountryListResponse),
    ).rejects.toThrow("Failed to cache country data");
  });

  it("should successfully delete/reset data", async () => {
    const spy = jest.spyOn(fs, "writeFile").mockResolvedValue(undefined);

    await caching.deleteCachedData();

    const callArgs = spy.mock.calls[0][1] as string;
    expect(JSON.parse(callArgs).countries).toEqual([]);
  });

  it("should return parsed data from getCachedData", async () => {
    jest
      .spyOn(fsSync, "readFileSync")
      .mockReturnValue(JSON.stringify(mockData));

    const result = await caching.getCachedData();

    expect(result.version).toBe("1.0.0");
    expect(result.retrievedTime).toBe("2023-01-01");
    expect(result.countries[0].country).toBe("Denmark");
  });
});
