import cron from "node-cron";
import path from "path";
import fs from "fs";
import { extractTravelStatus } from "../scraperAPI/extractTravelStatus";
import type { CountryListResponse } from "../../types/travelStatusReponse";
import { cacheJSON } from "../scraperAPI/caching";

const jsonPath = path.resolve(
  __dirname,
  "../../../mockData/mockCountryPathKeys.json",
);
const pathKeys = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const countryListResponse: CountryListResponse = {} as CountryListResponse;

cron.schedule("*/30 * * * * *", async () => {
  //"*/30 * * * * *" for every 30 seconds

  countryListResponse.countries = [];
  for (const pathKey of pathKeys) {
    const country = await runScraperHourly(pathKey.code);
    countryListResponse.countries.push(country);
  }
  countryListResponse.httpCode = 200;
  countryListResponse.retrievedTime = new Date().toISOString();
  countryListResponse.version = "1.0.0";
  cacheJSON(countryListResponse);
  return countryListResponse;
});

function runScraperHourly(countryCode: string) {
  return extractTravelStatus(countryCode, true);
}
