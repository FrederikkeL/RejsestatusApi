const { extractTravelStatus } = require("./extractTravelStatus");
const { cacheJSON } = require("./caching");
import type { CountryListResponse } from "../../types/travelStatusReponse";
import "../scheduler/scraperScheduler";

async function main(useMock) {
    console.log("scraper has started");
  var countryListResponse: CountryListResponse = null;
  if (useMock) {
    const country = await extractTravelStatus("FI", useMock);
    const country2 = await extractTravelStatus("FI", useMock);
    countryListResponse = {
      httpCode: 200,
      retrievedTime: new Date().toISOString(),
      version: "1.0.0",
      countries: [country, country2],
    };
  } else {
    countryListResponse = await extractTravelStatus("FI", useMock);
    cacheJSON(countryListResponse);
  }
}
main(true);
