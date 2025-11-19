import { load } from "cheerio";
import { fetchPage } from "./fetchPage.ts";

export async function extractTravelStatus() {
  const html = await fetchPage(true);
  const $ = load(html);

  const time = $(".col-8").text();

  const contryName = $(".page-title").text();

  const container = $(
    ".module-text-accordion-content.module-travel-advice-labels",
  );
  const sections = [];

  container.children("h2").each((i, h2) => {
    const heading = $(h2);

    const classList = heading.attr("class") || "";
    const match = classList.match(/module-travel-advice-(minimal|low|high)/);
    const status = match ? match[1] : null;
    let sibling = heading.next();
    while (sibling.length && sibling[0].type !== "tag") {
      sibling = sibling.next();
    }

    sections.push({
      status,
      headingText: heading.text().trim() || "",
      contentText: sibling.text().trim() || "",
    });
  });
  const travelResponse = {
    country: contryName.trim(),
    travelStatus: sections,
    statusCode: 200,
    timestamp: time,
    version: "1.0.0",
  };
  return travelResponse;
}
