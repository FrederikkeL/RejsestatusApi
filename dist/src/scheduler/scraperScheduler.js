"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const extractTravelStatus_1 = require("../scraper/extractTravelStatus");
const caching_1 = require("../caching/caching");
const jsonPath = path_1.default.resolve(__dirname, "../scraper/countryPathKeys.json");
// load mock path keys "../../../mockData/mockCountryPathKeys.json"
const pathKeys = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
const countryListResponse = {
    httpCode: 200,
    retrievedTime: new Date().toLocaleString("da-DK", {
        timeZone: "Europe/Copenhagen",
    }),
    version: "1.0.0",
    countries: [],
};
node_cron_1.default.schedule("*/30 * * * * *", async () => {
    //"*/30 * * * * *" for every 30 seconds
    countryListResponse.countries = [];
    for (const pathKey of pathKeys) {
        const country = await runScraperHourly(pathKey.code);
        countryListResponse.countries.push(country);
    }
    (0, caching_1.cacheJSON)(countryListResponse);
});
function runScraperHourly(countryCode) {
    return (0, extractTravelStatus_1.extractTravelStatus)(countryCode, false);
}
