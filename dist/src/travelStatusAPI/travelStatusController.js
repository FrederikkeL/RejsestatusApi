"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTravelStatusByCountry = exports.getAllTravelStatuses = void 0;
const mockTravelStatus_1 = __importDefault(require("../../mockData/mockTravelStatus"));
const extractTravelStatus_1 = require("../scraper/extractTravelStatus");
const mock = false;
const getAllTravelStatuses = (req, res) => {
    //missing logic for get all travel statuses
    if (!mockTravelStatus_1.default) {
        res.status(404).json({
            message: "Travel statuses are not available.",
        });
    }
    switch (mockTravelStatus_1.default.httpCode) {
        case 200:
            res.status(200).json(mockTravelStatus_1.default);
            break;
        case 500:
            res.status(500).json({
                message: "Udenrigsministeriet's website is down, can't show travel statuses currently.",
            });
            break;
        case 503:
            res.status(503).json({
                message: "Travel status service is down, can't show travel statuses currently.",
            });
            break;
        case 404:
            res.status(404).json({
                message: "Travel statuses are not available.",
            });
            break;
        default:
            res.status(500).json({
                message: "An unexpected error occurred.",
            });
    }
};
exports.getAllTravelStatuses = getAllTravelStatuses;
const getTravelStatusByCountry = async (req, res) => {
    const country = req.params.country.toLowerCase();
    var status = null;
    if (mock) {
        status = mockTravelStatus_1.default.countries.find((ts) => ts.country.toLowerCase() === country);
    }
    else {
        status = await (0, extractTravelStatus_1.extractTravelStatus)(country, false);
    }
    if (!status) {
        return res.status(404).json({
            message: `Travel status for ${req.params.country} is not available.`,
        });
    }
    switch (status.httpCodeUM) {
        case 200:
            res.status(200).json(status);
            break;
        case 500:
            res.status(500).json({
                message: `Udenrigsministeriet's website is down, can't show travel status for ${req.params.country} currently.`,
            });
            break;
        case 503:
            res.status(503).json({
                message: `Travel status service is down, can't show travel status for ${req.params.country} currently.`,
            });
            break;
        case 404:
            res.status(404).json({
                message: `Travel status for ${req.params.country} is not available.`,
            });
            break;
        default:
            res.status(500).json({
                message: `Unexpected error occurred for ${req.params.country}.`,
            });
    }
};
exports.getTravelStatusByCountry = getTravelStatusByCountry;
