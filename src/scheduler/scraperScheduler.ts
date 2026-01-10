import cron from "node-cron";
import path from "path";
import fs from "fs";
import { extractTravelStatus } from "../scraper/extractTravelStatus";
import type {
  CountryListResponse,
  CountryResponse,
  pathKey,
} from "../../types/travelStatusReponse";
import { cacheJSON, getCachedData } from "../caching/caching";

const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");

cron.schedule("0 * * * *", async () => {
  //"* * * * *" for every minute
  //"0 * * * *" for every hour at minute 0
  const pathKeys: pathKey[] = getPathKeys();
  runScraperForAllCountries(pathKeys);
});

export async function runScraperForAllCountries(pathKeys: pathKey[]) {
  const countryListResponse: CountryListResponse = await getCachedData();

  if (pathKeys.length === 0) {
    countryListResponse.errorMessage =
      "No path keys available to run the scraper.";
    cacheJSON(countryListResponse);
    return;
  }

  const maxRetries = 3;

  for (const pathKey of pathKeys) {
    let country;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      country = await extractTravelStatus(pathKey.code);
      if (country.httpCodeUM !== 500) break;
    }
    countryListResponse.countries.push(country);
  }

  if (validateTravelStatuses(countryListResponse.countries)) {
    countryListResponse.retrievedTime = new Date().toLocaleString("da-DK", {
      timeZone: "Europe/Copenhagen",
    });
    countryListResponse.errorMessage = undefined;
    await cacheJSON(countryListResponse);
  }
}

function validateTravelStatuses(countries: CountryResponse[]): boolean {
  return countries.some((country) => country.httpCodeUM === 200);
}

export function getPathKeys(): pathKey[] {
  try {
    if (!fs.existsSync(jsonPath)) return [];

    const rawContent = fs.readFileSync(jsonPath, "utf-8");
    const content = JSON.parse(rawContent);

    return Array.isArray(content) ? (content as pathKey[]) : [];
  } catch {
    return [];
  }
}
