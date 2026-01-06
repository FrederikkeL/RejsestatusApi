import { load, CheerioAPI } from "cheerio";
import { fetchPage } from "./fetchPage";
import type {
  CountryResponse,
  TravelStatus,
  TravelStatusLevel,
} from "../../types/travelStatusReponse";
import {
  findEnglishNameByCode,
  findPathKeyByCode,
} from "../helpers/pathKeysHelpers";

export async function extractTravelStatus(
  countryCode: string,
): Promise<CountryResponse> {
  const html = await fetchPage(countryCode);

  if (html === "notfound") {
    return {
      httpCodeUM: 404,
      errorMessage: `Country is not registered on Ministry of Foreign Affairs' website so there is no available travel advice for ${findEnglishNameByCode(countryCode)}.`,
    };
  }

  if (html === "servererror") {
    return {
      httpCodeUM: 500,
      errorMessage: `Server error when fetching travel advice for ${findEnglishNameByCode(countryCode)}.`,
    };
  }

  if (html === "emptykey") {
    return {
      httpCodeUM: 404,
      errorMessage: `Country code ${findEnglishNameByCode(countryCode)} doesn't have a path key defined.`,
    };
  }

  const $ = load(html);

  const pageTitle = extractPageTitle($);
  const travelStatuses = extractStatuses($);

  if (
    pageTitle.toLowerCase().includes("vi har ingen rejsevejledning") ||
    travelStatuses.length === 0
  ) {
    return {
      httpCodeUM: 404,
      errorMessage: `No travel advice available for ${findEnglishNameByCode(countryCode)}.`,
    };
  }

  const text = $(".col-8").text().trim();
  const updatedTimeUM = extractTime(text);
  const updatedDateUM = extractDate(text);

  if (
    !pageTitle ||
    !updatedDateUM ||
    !updatedTimeUM ||
    !validateTravelStatuses(travelStatuses)
  ) {
    return {
      httpCodeUM: 500,
      errorMessage: `Failed to extract complete travel advice data for ${findEnglishNameByCode(countryCode)}.`,
    };
  }

  return {
    httpCodeUM: 200,
    country: pageTitle,
    pathKey: findPathKeyByCode(countryCode),
    updatedDateUM,
    updatedTimeUM,
    travelStatuses,
  };
}

function extractPageTitle($: CheerioAPI): string {
  const name = $(".page-title").text().trim();
  return cleanString(name);
}

function extractStatuses($: CheerioAPI): TravelStatus[] {
  return $(".module-text-accordion-content.module-travel-advice-labels")
    .children("h2")
    .toArray()
    .map((h2): TravelStatus => {
      const heading = $(h2);

      const match = heading
        .attr("class")
        ?.match(/module-travel-advice-(minimal|low|medium|high)/);

      const travelStatus = (match?.[1] as TravelStatusLevel) ?? null;

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
  if (!match) return "";

  return match[1].replace(/[.\-/]/g, ".");
}

function extractTime(input: string): string {
  const match = input.match(/[Kk][Ll]\.?\s*(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)/);
  if (!match) return "";

  return match[1].replace(/[:]/g, ".");
}

function validateTravelStatuses(statuses: TravelStatus[]): boolean {
  return statuses.every(
    (s) => s.travelStatus && s.headingText && s.contentText,
  );
}
