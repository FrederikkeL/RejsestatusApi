"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScraperForAllCountries = runScraperForAllCountries;
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const extractTravelStatus_1 = require("../scraper/extractTravelStatus");
const caching_1 = require("../caching/caching");
const jsonPath = path_1.default.resolve(__dirname, "../scraper/countryPathKeys.json");
const pathKeys = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
node_cron_1.default.schedule("30 * * * * *", async () => {
    //"*/30 * * * * *" for every 30 seconds
    //"0 * * * *" for every hour at minute 0
    runScraperForAllCountries(pathKeys);
});
async function runScraperForAllCountries(pathKeys) {
    const countryListResponse = {
        retrievedTime: new Date().toLocaleString("da-DK", {
            timeZone: "Europe/Copenhagen",
        }),
        version: "1.0.0",
        countries: [],
    };
    if (pathKeys.length === 0) {
        countryListResponse.errorMessage =
            "No path keys available to run the scraper.";
        (0, caching_1.cacheJSON)(countryListResponse);
        return;
    }
    countryListResponse.countries = [];
    const maxRetries = 3;
    for (const pathKey of pathKeys) {
        let country;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            country = await (0, extractTravelStatus_1.extractTravelStatus)(pathKey.code);
            if (country.httpCodeUM !== 500) {
                break;
            }
        }
        countryListResponse.countries.push(country);
    }
    console.log(countryListResponse);
    if (validateTravelStatuses(countryListResponse.countries)) {
        console.log("Valid travel statuses found, caching data...");
        (0, caching_1.cacheJSON)(countryListResponse);
    }
}
function validateTravelStatuses(countries) {
    return countries.some((country) => country.httpCodeUM === 200);
}
