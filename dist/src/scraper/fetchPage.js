"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPage = fetchPage;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const pathKeysHelpers_1 = require("../helpers/pathKeysHelpers");
// Helper to get the mock file path depending on environment
function getMockFilePath() {
    if (process.env.JEST_WORKER_ID !== undefined) {
        // Running in Jest — mock file relative to test file
        return "mockData/mockCambodja.html";
    }
    else {
        // Running normally — back out a few directories
        return "mockData/mockCambodja.html";
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
    const countrypathKey = (0, pathKeysHelpers_1.findPathKeyByCode)(countryCode);
    if (!countrypathKey) {
        return "emptykey";
    }
    try {
        const url = "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/" +
            countrypathKey;
        const response = await axios_1.default.get(url);
        console.log("➡ Fetched real HTML from:", url);
        return response.data;
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            if (err.response?.status === 404) {
                return "notfound";
            }
            if (err.response?.status === 500) {
                return "servererror";
            }
            console.error("Unexpected error:", err);
            throw err;
        }
    }
}
