import { extractTravelStatus } from "../src/scraper/extractTravelStatus";
import { fetchPage } from "../src/scraper/fetchPage";
import * as helpers from "../src/helpers/pathKeysHelpers";

jest.mock("../src/scraper/fetchPage");
jest.mock("../src/helpers/pathKeysHelpers");

describe("extractTravelStatus", () => {
  const countryCode = "FI";

  beforeEach(() => {
    jest.clearAllMocks();
    (helpers.findEnglishNameByCode as jest.Mock).mockReturnValue("Finland");
  });

  describe("Error Scenarios (Network/Mapping)", () => {
    it("should return 404 for 'notfound' response", async () => {
      (fetchPage as jest.Mock).mockResolvedValue("notfound");

      const result = await extractTravelStatus(countryCode);

      expect(result.httpCodeUM).toBe(404);
      expect(result.errorMessage).toContain("is not registered");
    });

    it("should return 500 for 'servererror' response", async () => {
      (fetchPage as jest.Mock).mockResolvedValue("servererror");

      const result = await extractTravelStatus(countryCode);

      expect(result.httpCodeUM).toBe(500);
      expect(result.errorMessage).toContain("Server error");
    });

    it("should return 404 for 'emptykey' response", async () => {
      (fetchPage as jest.Mock).mockResolvedValue("emptykey");

      const result = await extractTravelStatus(countryCode);

      expect(result.httpCodeUM).toBe(404);
      expect(result.errorMessage).toContain("doesn't have a path key defined");
    });
  });

  describe("HTML Parsing Scenarios", () => {
    it("should return 404 if page title says no travel advice exists", async () => {
      const mockHtml = `<h1 class="page-title">Vi har ingen rejsevejledning for Finland</h1>`;
      (fetchPage as jest.Mock).mockResolvedValue(mockHtml);

      const result = await extractTravelStatus(countryCode);

      expect(result.httpCodeUM).toBe(404);
      expect(result.errorMessage).toContain("No travel advice available");
    });

    it("should return 200 and parsed data for valid HTML", async () => {
      const sampleHtml = `
      <div class="col-8">Rejsevejledning opdateret: 29.10.2025 Kl. 14:21</div>
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

      (fetchPage as jest.Mock).mockResolvedValue(sampleHtml);

      const result = await extractTravelStatus("test");

      expect(result.country).toBe("Thailand");
      expect(result.updatedTimeUM).toBe("14.21");
      expect(result.updatedDateUM).toBe("29.10.2025");
      expect(result.httpCodeUM).toBe(200);

      expect(result.travelStatuses).toHaveLength(2);

      expect(result.travelStatuses?.[0]).toEqual({
        travelStatus: "low",
        headingText: "Vær ekstra forsigtig:Hele landet",
        contentText: "Hold dig opdateret via myndighederne.",
      });

      expect(result.travelStatuses?.[1]).toEqual({
        travelStatus: "high",
        headingText: "Vi fraråder alle rejser til:Grænseområdet",
        contentText: "Meget høj sikkerhedsrisiko.",
      });
    });

    it("should return 500 if critical data (like date) is missing from HTML", async () => {
      const mockHtml = `
      <div class="col-8">No date</div>
      <h1 class="page-title">Finland</h1>
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
      (fetchPage as jest.Mock).mockResolvedValue(mockHtml);

      const result = await extractTravelStatus(countryCode);

      expect(result.httpCodeUM).toBe(500);
      expect(result.errorMessage).toContain(
        "Failed to extract complete travel advice data for Finland",
      );
    });
  });
});
