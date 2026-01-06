"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPage = fetchPage;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const pathKeysHelpers_1 = require("../helpers/pathKeysHelpers");
const useMock = process.env.USE_MOCK === "true";
async function fetchPage(countryCode) {
    if (useMock) {
        const mockdata = fs_1.default.readFileSync("mockData/mockCambodja.html", "utf-8");
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
            throw new Error(`Failed to fetch page: ${err.message}`);
        }
    }
}
