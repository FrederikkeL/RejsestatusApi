"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTravelStatus = extractTravelStatus;
const cheerio_1 = require("cheerio");
const fetchPage_1 = require("./fetchPage");
async function extractTravelStatus(countryCode, useMock) {
    const countryResponse = {
        country: "",
        travelStatuses: [],
        httpCodeUM: 0,
        updatedTimeUM: "",
    };
    const html = await (0, fetchPage_1.fetchPage)(countryCode, useMock);
    if (html === "notfound") {
        countryResponse.errorMessage = `Travel advice for [${countryCode}] not found (404).`;
        countryResponse.httpCodeUM = 404;
        return countryResponse;
    }
    if (html === "servererror") {
        countryResponse.errorMessage = `Server error when fetching travel advice for [${countryCode}] (500).`;
        countryResponse.httpCodeUM = 500;
        return countryResponse;
    }
    if (html === "emptykey") {
        countryResponse.errorMessage = `Country code [${countryCode}] doesn't have a path key defined (400).`;
        countryResponse.httpCodeUM = 400;
        return countryResponse;
    }
    const $ = (0, cheerio_1.load)(html);
    const pageTitle = extractPageTitle($);
    const travelStatuses = extractStatuses($);
    const updatedTimeUM = $(".col-8").text().trim();
    if (pageTitle.toLowerCase().includes("vi har ingen rejsevejledning for") ||
        !pageTitle) {
        countryResponse.country = "";
        countryResponse.httpCodeUM = 204;
        countryResponse.errorMessage = `No travel advice available for ${countryCode}.`;
        return countryResponse;
    }
    countryResponse.country = pageTitle;
    countryResponse.travelStatuses = travelStatuses;
    countryResponse.updatedTimeUM = updatedTimeUM;
    countryResponse.httpCodeUM = 200;
    return countryResponse;
}
function extractPageTitle($) {
    const name = $(".page-title").text().trim();
    return name;
}
function extractStatuses($) {
    const container = $(".module-text-accordion-content.module-travel-advice-labels");
    return container
        .children("h2")
        .toArray()
        .map((h2) => {
        const heading = $(h2);
        const travelStatus = heading
            .attr("class")
            ?.match(/module-travel-advice-(minimal|low|high)/)?.[1] ?? null;
        const sibling = heading
            .nextAll()
            .filter((_, el) => el.type === "tag")
            .first();
        return {
            travelStatus,
            headingText: heading.text().trim(),
            contentText: sibling.text().trim(),
        };
    });
}
