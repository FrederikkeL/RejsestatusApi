import { load } from "cheerio";
import { fetchPage } from "./fetchPage.ts";
import type {
  CountryResponse,
  TravelStatus,
} from "../../types/travelStatusReponse.ts";

export async function extractTravelStatus(countryCode: string, useMock = true) {
  const html = await fetchPage(countryCode, useMock);
  const $ = load(html);

  const time = $(".col-8").text();

  const contryName = $(".page-title").text();

  const container = $(
    ".module-text-accordion-content.module-travel-advice-labels",
  );
  const sections: TravelStatus[] = [];

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
  const countryResponse: CountryResponse = {
    country: contryName.trim(),
    travelStatuses: sections,
    httpCodeUM: 200,
    updatedTimeUM: time,
  };
  return countryResponse;
}
