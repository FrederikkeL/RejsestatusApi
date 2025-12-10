"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheJSON = cacheJSON;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
async function cacheJSON(jsonCountryListResponse) {
    try {
        const filePath = path_1.default.join(__dirname, "data.json");
        const data = JSON.stringify(jsonCountryListResponse, null, 2);
        await promises_1.default.writeFile(filePath, data, "utf-8");
    }
    catch (error) {
        console.error("Error writing file:", error);
    }
}
