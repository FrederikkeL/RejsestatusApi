import { extractTravelStatus } from "../src/scraperAPI/extractTravelStatus";
import { fetchPage } from "../src/scraperAPI/fetchPage";

// Mock fetchPage
jest.mock("../src/scraperAPI/fetchPage");

const mockedFetchPage = fetchPage as jest.MockedFunction<typeof fetchPage>;

describe("extractTravelStatus", () => {
  it("should parse travel status sections correctly", async () => {
    // Sample HTML to test
    const sampleHtml = `
      <div class="col-8">Updated: 19 November 2025</div>
      <h1 class="page-title">Thailand</h1>
      <div class="module-text-accordion-content module-travel-advice-labels">
        <h2 class="module-travel-advice-low">Vær ekstra forsigtig:<br><span>Hele landet</span></h2>
        <div class="module-text-accordion-content-section">
          <p>Hold dig opdateret via myndighederne.</p>
        </div>
        <h2 class="module-travel-advice-high">Vi fraråder alle rejser til:<br><span>Grænseområdet</span></h2>
        <div class="module-text-accordion-content-section">
          <p>Meget høj sikkerhedsrisiko.</p>
        </div>
      </div>
    `;

    mockedFetchPage.mockResolvedValue(sampleHtml);

    const result = await extractTravelStatus("test", true);

    expect(result.country).toBe("Thailand");
    expect(result.updatedTimeUM).toBe("Updated: 19 November 2025");
    expect(result.httpCodeUM).toBe(200);

    expect(result.travelStatuses).toHaveLength(2);

    expect(result.travelStatuses[0]).toEqual({
      travelStatus: "low",
      headingText: "Vær ekstra forsigtig:Hele landet",
      contentText: "Hold dig opdateret via myndighederne.",
    });

    expect(result.travelStatuses[1]).toEqual({
      travelStatus: "high",
      headingText: "Vi fraråder alle rejser til:Grænseområdet",
      contentText: "Meget høj sikkerhedsrisiko.",
    });
  });
});
