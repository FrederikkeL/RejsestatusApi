import fs from "fs";
import path from "path";
import type { CountryListResponse } from "../../types/travelStatusReponse";

const dataPath = path.resolve(__dirname, "../caching/data.json");

export function getCachedData(): CountryListResponse {
  const content = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  if (!content) {
    throw new Error("No cached data found");
  }
  return content as CountryListResponse;
}
