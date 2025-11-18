import { fetchPage } from "../src/scraperAPI/scraperapi";
//import axios from "axios";

jest.mock("axios");
//const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchPage", () => {
  it("returns mock HTML when useMock is true", async () => {
    const html: string = await fetchPage(true);
    expect(html).toContain("<!doctype html>");
  });

  /*   it("fetches real data when useMock is false", async () => {
    // Type-safe mock: just tell TypeScript this is an AxiosResponse
    const mockHtml = "<html><body>Real page</body></html>";
    mockedAxios.get.mockResolvedValue({ data: mockHtml });

    const html: string = await fetchPage(false);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/cambodja",
    ); 
    expect(html).toBe(mockHtml);
  });*/
});
