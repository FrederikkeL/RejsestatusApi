import { cacheJSON } from "../src/caching/caching";
import fs from "fs/promises";
import { CountryListResponse } from "../types/travelStatusReponse";

jest.mock("fs/promises");

describe("cacheJSON", () => {
  const mockData = {
    retrievedTime: "2023-01-01T00:00:00Z",
    version: "1.0.0",
    countries: [{ country: "Canada", httpCodeUM: 200 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should write data to the correct path", async () => {
    await cacheJSON(mockData as CountryListResponse);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("data.json"),
      JSON.stringify(mockData, null, 2),
      "utf-8",
    );
  });

  it("should throw an error if the file system fails", async () => {
    (fs.writeFile as jest.Mock).mockRejectedValue(new Error("Disk Full"));

    await expect(cacheJSON(mockData as CountryListResponse)).rejects.toThrow(
      "Failed to cache country data",
    );
  });
});
