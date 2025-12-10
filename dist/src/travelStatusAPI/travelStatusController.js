"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravelStatusByCountry = exports.getAllTravelStatuses = void 0;
const pathKeysHelpers_1 = require("../helpers/pathKeysHelpers");
const mockTravelStatus_1 = __importDefault(require("../../mockData/mockTravelStatus"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dataPath = path_1.default.resolve(__dirname, "../caching/data.json");
const getAllTravelStatuses = (req, res) => {
    let countryListResponse;
    if (process.env.JEST_WORKER_ID !== undefined) {
        countryListResponse = mockTravelStatus_1.default;
    }
    else {
        countryListResponse = JSON.parse(fs_1.default.readFileSync(dataPath, "utf-8"));
    }
    if (!countryListResponse) {
        return res.status(404).json({
            message: "Travel statuses are not available.",
        });
    }
    switch (countryListResponse.httpCode) {
        case 200:
            return res.status(200).json(countryListResponse);
        case 500:
            return res.status(500).json({
                message: "Udenrigsministeriet's website is down, can't show travel statuses currently.",
            });
        case 503:
            return res.status(503).json({
                message: "Travel status service is down, can't show travel statuses currently.",
            });
        case 404:
            return res.status(404).json({
                message: "Travel statuses are not available.",
            });
        default:
            return res.status(500).json({
                message: "An unexpected error occurred.",
            });
    }
};
exports.getAllTravelStatuses = getAllTravelStatuses;
const getTravelStatusByCountry = async (req, res) => {
    let countryResponse;
    let country = "";
    if (process.env.JEST_WORKER_ID !== undefined) {
        country = (0, pathKeysHelpers_1.findMockDanishNameByCode)(req.params.country);
        countryResponse = mockTravelStatus_1.default.countries.find((ts) => ts.country?.toLowerCase() === country?.toLowerCase());
    }
    else {
        country = (0, pathKeysHelpers_1.findDanishNameByCode)(req.params.country);
        const countryListResponse = JSON.parse(fs_1.default.readFileSync(dataPath, "utf-8"));
        countryResponse = countryListResponse.countries.find((ts) => ts.country?.toLowerCase() === country?.toLowerCase());
    }
    if (!countryResponse) {
        return res.status(404).json({
            message: `Travel status for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)} is not available.`,
        });
    }
    switch (countryResponse.httpCodeUM) {
        case 200:
            res.status(200).json(countryResponse);
            break;
        case 204:
            res.status(204).json({
                message: `No travel advice available for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)}.`,
            });
            break;
        case 500:
            res.status(500).json({
                message: `Udenrigsministeriet's website is down, can't show travel status for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)} currently.`,
            });
            break;
        case 503:
            res.status(503).json({
                message: `Travel status service is down, can't show travel status for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)} currently.`,
            });
            break;
        case 404:
            res.status(404).json({
                message: `Travel status for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)} is not available.`,
            });
            break;
        default:
            res.status(500).json({
                message: `Unexpected error occurred for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(req.params.country)}.`,
            });
    }
};
exports.getTravelStatusByCountry = getTravelStatusByCountry;
