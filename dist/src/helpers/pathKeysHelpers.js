"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPathKeyByCode = findPathKeyByCode;
exports.findDanishNameByCode = findDanishNameByCode;
exports.findEnglishNameByCode = findEnglishNameByCode;
exports.findMockDanishNameByCode = findMockDanishNameByCode;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findPathKeyByCode(countryCode) {
    const jsonPath = path_1.default.resolve(__dirname, "../scraper/countryPathKeys.json");
    const countries = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
    return countries.find((key) => key.code.toLowerCase() === countryCode.toLowerCase())?.pathKey;
}
function findDanishNameByCode(countryCode) {
    const jsonPath = path_1.default.resolve(__dirname, "../scraper/countryPathKeys.json");
    const countries = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
    return countries.find((key) => key.code.toLowerCase() === countryCode.toLowerCase())?.danish;
}
function findEnglishNameByCode(countryCode) {
    const jsonPath = path_1.default.resolve(__dirname, "../scraper/countryPathKeys.json");
    const countries = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
    const englishName = countries.find((key) => key.code.toLowerCase() === countryCode.toLowerCase())?.english;
    if (!englishName) {
        return countryCode;
    }
    return englishName;
}
function findMockDanishNameByCode(countryCode) {
    const jsonPath = path_1.default.resolve(__dirname, "../../mockData/mockCountryPathKeys.json");
    const countries = JSON.parse(fs_1.default.readFileSync(jsonPath, "utf-8"));
    return countries.find((key) => key.code.toLowerCase() === countryCode.toLowerCase())?.danish;
}
