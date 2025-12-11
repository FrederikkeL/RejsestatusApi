"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractTravelStatus_1 = require("./extractTravelStatus");
const caching_1 = require("../caching/caching");
require("../scheduler/scraperScheduler");
async function main(useMock) {
    console.log("scraper has started");
    let countryListResponse = null;
    if (useMock) {
        const country = await (0, extractTravelStatus_1.extractTravelStatus)("FI", useMock);
        const country2 = await (0, extractTravelStatus_1.extractTravelStatus)("FI", useMock);
        countryListResponse = {
            retrievedTime: new Date().toISOString(),
            version: "1.0.0",
            countries: [country, country2],
        };
    }
    else {
        const country = await (0, extractTravelStatus_1.extractTravelStatus)("FI", useMock);
        countryListResponse = {
            retrievedTime: new Date().toISOString(),
            version: "1.0.0",
            countries: [country],
        };
        (0, caching_1.cacheJSON)(countryListResponse);
    }
}
main(true);
