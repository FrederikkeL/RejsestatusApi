"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPage = fetchPage;
exports.findCountryPathKey = findCountryPathKey;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
// Helper to get the mock file path depending on environment
function getMockFilePath() {
    if (process.env.JEST_WORKER_ID !== undefined) {
        // Running in Jest — mock file relative to test file
        return "mockData/mockCambodja.html";
    }
    else {
        // Running normally — back out a few directories
        return "mockData/mockAndorra.html";
    }
}
// Load mock data once
const mockFilePath = getMockFilePath();
const mockdata = fs_1.default.readFileSync(mockFilePath, "utf-8");
// Main function
async function fetchPage(countryCode, useMock) {
    if (useMock) {
        console.log("➡ Using mock HTML instead of real API call");
        return mockdata;
    }
    const countrypathKey = findCountryPathKey("AD");
    const url = "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/" +
        countrypathKey;
    const response = await axios_1.default.get(url);
    console.log("➡ Fetched real HTML from:", url);
    console.log(response.data);
    return response.data;
}
function findCountryPathKey(countryCode) {
    const jsonPath = path_1.default.resolve(__dirname, "countryPathKeys.json");
    const pathKeys = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
    return pathKeys.find((key) => key.code.toLowerCase() === countryCode.toLowerCase())?.pathKey;
}
