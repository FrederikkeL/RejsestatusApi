"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTravelStatus = extractTravelStatus;
const cheerio_1 = require("cheerio");
const fetchPage_1 = require("./fetchPage");
async function extractTravelStatus(countryCode, useMock) {
    let errorMessage = "";
    let httpCodeUM = 0;
    let travelStatuses = [];
    let updatedTimeUM = "";
    let updatedDateUM = "";
    const html = await (0, fetchPage_1.fetchPage)(countryCode, useMock);
    if (html === "notfound") {
        httpCodeUM = 404;
        errorMessage = `Travel advice for ${countryCode} not found (404).`;
        return {
            httpCodeUM,
            errorMessage,
        };
    }
    if (html === "servererror") {
        httpCodeUM = 500;
        errorMessage = `Server error when fetching travel advice for ${countryCode} (500).`;
        return {
            httpCodeUM,
            errorMessage,
        };
    }
    if (html === "emptykey") {
        httpCodeUM = 400;
        errorMessage = `Country code ${countryCode} doesn't have a path key defined (400).`;
        return {
            httpCodeUM,
            errorMessage,
        };
    }
    const $ = (0, cheerio_1.load)(html);
    const pageTitle = extractPageTitle($);
    travelStatuses = extractStatuses($);
    updatedTimeUM = extractTime($(".col-8").text().trim());
    updatedDateUM = extractDate($(".col-8").text().trim());
    if (pageTitle.toLowerCase().includes("vi har ingen rejsevejledning for") ||
        !pageTitle) {
        httpCodeUM = 204;
        errorMessage = `No travel advice available for ${countryCode}.`;
        return {
            httpCodeUM,
            errorMessage,
        };
    }
    return {
        httpCodeUM: 200,
        country: pageTitle,
        updatedDateUM,
        updatedTimeUM,
        travelStatuses,
    };
}
function extractPageTitle($) {
    const name = $(".page-title").text().trim();
    return cleanString(name);
}
function extractStatuses($) {
    const container = $(".module-text-accordion-content.module-travel-advice-labels");
    return container
        .children("h2")
        .toArray()
        .map((h2) => {
        const heading = $(h2);
        const travelStatus = cleanString(heading
            .attr("class")
            ?.match(/module-travel-advice-(minimal|low|high)/)?.[1] ?? null);
        const sibling = heading
            .nextAll()
            .filter((_, el) => el.type === "tag")
            .first();
        return {
            travelStatus,
            headingText: cleanString(heading.text().trim()),
            contentText: cleanString(sibling.text().trim()),
        };
    });
}
function cleanString(input) {
    if (!input)
        return "";
    return input.replace(/\r?\n+/g, "").replace(/ {2,}/g, " ");
}
function extractDate(input) {
    const match = input.match(/(\d{1,2}[.\-/]\d{1,2}[.\-/]\d{4})/);
    return match ? match[1] : "";
}
function extractTime(input) {
    const match = input.match(/[Kk][Ll]\.?\s*(\d{1,2}:\d{2}(?::\d{2})?)/);
    return match ? match[1] : "";
}
