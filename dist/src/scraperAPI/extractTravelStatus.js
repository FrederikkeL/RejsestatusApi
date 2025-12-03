"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTravelStatus = extractTravelStatus;
const cheerio_1 = require("cheerio");
const fetchPage_1 = require("./fetchPage");
async function extractTravelStatus(countryCode, useMock) {
    const html = await (0, fetchPage_1.fetchPage)(countryCode, useMock);
    const $ = (0, cheerio_1.load)(html);
    const time = $(".col-8").text();
    const contryName = $(".page-title").text();
    const container = $(".module-text-accordion-content.module-travel-advice-labels");
    const sections = [];
    container.children("h2").each((i, h2) => {
        const heading = $(h2);
        const classList = heading.attr("class") || "";
        const match = classList.match(/module-travel-advice-(minimal|low|high)/);
        const travelStatus = match ? match[1] : null;
        let sibling = heading.next();
        while (sibling.length && sibling[0].type !== "tag") {
            sibling = sibling.next();
        }
        sections.push({
            travelStatus,
            headingText: heading.text().trim() || "",
            contentText: sibling.text().trim() || "",
        });
    });
    const countryResponse = {
        country: contryName.trim(),
        travelStatuses: sections,
        httpCodeUM: 200,
        updatedTimeUM: time,
    };
    return countryResponse;
}
