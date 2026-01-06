import cron from "node-cron";
import path from "path";
import fs from "fs";
import { extractTravelStatus } from "../scraper/extractTravelStatus";
import type {
  CountryListResponse,
  CountryResponse,
  pathKey,
} from "../../types/travelStatusReponse";
import { cacheJSON } from "../caching/caching";

const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");
const pathKeys = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

cron.schedule("30 * * * * *", async () => {
  //"*/30 * * * * *" for every 30 seconds
  //"0 * * * *" for every hour at minute 0
  runScraperForAllCountries(pathKeys);
});

export async function runScraperForAllCountries(pathKeys: pathKey[]) {
  const countryListResponse: CountryListResponse = {
    retrievedTime: new Date().toLocaleString("da-DK", {
      timeZone: "Europe/Copenhagen",
    }),
    version: "1.0.0",
    countries: [],
  };

  if (pathKeys.length === 0) {
    countryListResponse.errorMessage =
      "No path keys available to run the scraper.";
    cacheJSON(countryListResponse);
    return;
  }

  countryListResponse.countries = [];
  const maxRetries = 3;

  for (const pathKey of pathKeys) {
    let country;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      country = await extractTravelStatus(pathKey.code);

      if (country.httpCodeUM !== 500) {
        break;
      }
    }
    countryListResponse.countries.push(country);
  }
  console.log(countryListResponse);
  if (validateTravelStatuses(countryListResponse.countries)) {
    cacheJSON(countryListResponse);
  }
}

function validateTravelStatuses(countries: CountryResponse[]): boolean {
  return countries.some((country) => country.httpCodeUM === 200);
}
