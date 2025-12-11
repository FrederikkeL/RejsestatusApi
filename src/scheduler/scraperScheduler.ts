import cron from "node-cron";
import path from "path";
import fs from "fs";
import { extractTravelStatus } from "../scraper/extractTravelStatus";
import type { CountryListResponse } from "../../types/travelStatusReponse";
import { cacheJSON } from "../caching/caching";

const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");
// load mock path keys "../../../mockData/mockCountryPathKeys.json"
const pathKeys = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const countryListResponse: CountryListResponse = {
  retrievedTime: new Date().toLocaleString("da-DK", {
    timeZone: "Europe/Copenhagen",
  }),
  version: "1.0.0",
  countries: [],
} as CountryListResponse;

cron.schedule("*/30 * * * * *", async () => {
  //"*/30 * * * * *" for every 30 seconds

  countryListResponse.countries = [];
  for (const pathKey of pathKeys) {
    const country = await runScraperHourly(pathKey.code);
    countryListResponse.countries.push(country);
  }
  cacheJSON(countryListResponse);
});

function runScraperHourly(countryCode: string) {
  return extractTravelStatus(countryCode, false);
}
