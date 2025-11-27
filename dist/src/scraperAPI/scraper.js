"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractTravelStatus_1 = require("./extractTravelStatus");
async function main() {
    console.log(await (0, extractTravelStatus_1.extractTravelStatus)("KZ"));
}
main();
