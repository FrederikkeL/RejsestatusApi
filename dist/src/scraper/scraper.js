"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scraperScheduler_1 = require("../scheduler/scraperScheduler");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let jsonPath;
if (process.env.USE_MOCK === "true") {
    jsonPath = path_1.default.resolve(__dirname, "../../mockData/mockCountryPathKeys.json");
}
else {
    jsonPath = path_1.default.resolve(__dirname, "./countryPathKeys.json");
}
const pathKeys = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
(async () => {
    try {
        console.log("Running scraper once at", new Date().toISOString());
        await (0, scraperScheduler_1.runScraperForAllCountries)(pathKeys);
        console.log("Scraper finished successfully");
    }
    catch (err) {
        console.error("Scraper failed", err);
    }
})();
