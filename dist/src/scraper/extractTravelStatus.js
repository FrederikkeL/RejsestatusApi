"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTravelStatus = extractTravelStatus;
const cheerio_1 = require("cheerio");
const fetchPage_1 = require("./fetchPage");
const pathKeysHelpers_1 = require("../helpers/pathKeysHelpers");
async function extractTravelStatus(countryCode) {
    const html = await (0, fetchPage_1.fetchPage)(countryCode);
    if (html === "notfound") {
        return {
            httpCodeUM: 404,
            errorMessage: `Country is not registered on Ministry of Foreign Affairs' website so there is no available travel advice for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(countryCode)}.`,
        };
    }
    if (html === "servererror") {
        return {
            httpCodeUM: 500,
            errorMessage: `Server error when fetching travel advice for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(countryCode)}.`,
        };
    }
    if (html === "emptykey") {
        return {
            httpCodeUM: 404,
            errorMessage: `Country code ${(0, pathKeysHelpers_1.findEnglishNameByCode)(countryCode)} doesn't have a path key defined.`,
        };
    }
    const $ = (0, cheerio_1.load)(html);
    const pageTitle = extractPageTitle($);
    const travelStatuses = extractStatuses($);
    if (pageTitle.toLowerCase().includes("vi har ingen rejsevejledning") ||
        travelStatuses.length === 0) {
        return {
            httpCodeUM: 404,
            errorMessage: `No travel advice available for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(countryCode)}.`,
        };
    }
    const text = $(".col-8").text().trim();
    const updatedTimeUM = extractTime(text);
    const updatedDateUM = extractDate(text);
    if (!pageTitle ||
        !updatedDateUM ||
        !updatedTimeUM ||
        !validateTravelStatuses(travelStatuses)) {
        return {
            httpCodeUM: 500,
            errorMessage: `Failed to extract complete travel advice data for ${(0, pathKeysHelpers_1.findEnglishNameByCode)(countryCode)}.`,
        };
    }
    return {
        httpCodeUM: 200,
        country: pageTitle,
        pathKey: (0, pathKeysHelpers_1.findPathKeyByCode)(countryCode),
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
    return $(".module-text-accordion-content.module-travel-advice-labels")
        .children("h2")
        .toArray()
        .map((h2) => {
        const heading = $(h2);
        const match = heading
            .attr("class")
            ?.match(/module-travel-advice-(minimal|low|medium|high)/);
        const travelStatus = match?.[1] ?? null;
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
    if (!match)
        return "";
    return match[1].replace(/[.\-/]/g, ".");
}
function extractTime(input) {
    const match = input.match(/[Kk][Ll]\.?\s*(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)/);
    if (!match)
        return "";
    return match[1].replace(/[:]/g, ".");
}
function validateTravelStatuses(statuses) {
    return statuses.every((s) => s.travelStatus && s.headingText && s.contentText);
}
