import { runScraperForAllCountries } from "../scheduler/scraperScheduler";
import path from "path";
import fs from "fs";
import type { pathKey } from "../../types/travelStatusReponse";

let jsonPath;
if (process.env.USE_MOCK === "true") {
  jsonPath = path.resolve(__dirname, "../../mockData/mockCountryPathKeys.json");
} else {
  jsonPath = path.resolve(__dirname, "./countryPathKeys.json");
}

const pathKeys: pathKey[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

(async () => {
  try {
    console.log("Running scraper once at", new Date().toISOString());

    await runScraperForAllCountries(pathKeys);

    console.log("Scraper finished successfully");
  } catch (err) {
    console.error("Scraper failed", err);
  }
})();
