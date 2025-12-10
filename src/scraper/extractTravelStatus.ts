import { load, CheerioAPI } from "cheerio";
import { fetchPage } from "./fetchPage";
import type {
  CountryResponse,
  TravelStatus,
} from "../../types/travelStatusReponse";

export async function extractTravelStatus(
  countryCode: string,
  useMock: boolean,
) {
  let errorMessage = "";
  let httpCodeUM = 0;
  let travelStatuses: TravelStatus[] = [];
  let updatedTimeUM = "";
  let updatedDateUM = "";

  const html = await fetchPage(countryCode, useMock);

  if (html === "notfound") {
    httpCodeUM = 404;
    errorMessage = `Travel advice for ${countryCode} not found (404).`;
    return {
      httpCodeUM,
      errorMessage,
    } as CountryResponse;
  }

  if (html === "servererror") {
    httpCodeUM = 500;
    errorMessage = `Server error when fetching travel advice for ${countryCode} (500).`;
    return {
      httpCodeUM,
      errorMessage,
    } as CountryResponse;
  }

  if (html === "emptykey") {
    httpCodeUM = 400;
    errorMessage = `Country code ${countryCode} doesn't have a path key defined (400).`;
    return {
      httpCodeUM,
      errorMessage,
    } as CountryResponse;
  }

  const $ = load(html);

  const pageTitle = extractPageTitle($);
  travelStatuses = extractStatuses($);
  updatedTimeUM = extractTime($(".col-8").text().trim());
  updatedDateUM = extractDate($(".col-8").text().trim());

  if (
    pageTitle.toLowerCase().includes("vi har ingen rejsevejledning for") ||
    !pageTitle
  ) {
    httpCodeUM = 204;
    errorMessage = `No travel advice available for ${countryCode}.`;
    return {
      httpCodeUM,
      errorMessage,
    } as CountryResponse;
  }

  return {
    httpCodeUM: 200,
    country: pageTitle,
    updatedDateUM,
    updatedTimeUM,
    travelStatuses,
  } as CountryResponse;
}

function extractPageTitle($: CheerioAPI): string {
  const name = $(".page-title").text().trim();
  return cleanString(name);
}

function extractStatuses($: CheerioAPI): TravelStatus[] {
  const container = $(
    ".module-text-accordion-content.module-travel-advice-labels",
  );

  return container
    .children("h2")
    .toArray()
    .map((h2) => {
      const heading = $(h2);

      const travelStatus = cleanString(
        heading
          .attr("class")
          ?.match(/module-travel-advice-(minimal|low|high)/)?.[1] ?? null,
      );

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

function cleanString(input: string): string {
  if (!input) return "";
  return input.replace(/\r?\n+/g, "").replace(/ {2,}/g, " ");
}

function extractDate(input: string): string {
  const match = input.match(/(\d{1,2}[.\-/]\d{1,2}[.\-/]\d{4})/);
  return match ? match[1] : "";
}

function extractTime(input: string): string {
  const match = input.match(/[Kk][Ll]\.?\s*(\d{1,2}:\d{2}(?::\d{2})?)/);
  return match ? match[1] : "";
}
