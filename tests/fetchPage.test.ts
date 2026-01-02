import axios from "axios";
import * as helpers from "../src/helpers/pathKeysHelpers";
import fs from "fs";

jest.mock("axios");
jest.mock("fs");
jest.mock("../src/helpers/pathKeysHelpers");

const mockHtmlContent = "<html>Mock Content</html>";
(fs.readFileSync as jest.Mock).mockReturnValue(mockHtmlContent);

import { fetchPage } from "../../RejsestatusApi/src/scraper/fetchPage";

describe("fetchPage", () => {
  const countryCode = "KH";
  const mockPathKey = "cambodja";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return mock data when useMock is true", async () => {
    const result = await fetchPage(countryCode, true);

    expect(result).toBe(mockHtmlContent);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("should return 'emptykey' if no path key is found", async () => {
    (helpers.findPathKeyByCode as jest.Mock).mockReturnValue(undefined);

    const result = await fetchPage(countryCode, false);

    expect(result).toBe("emptykey");
  });

  it("should return HTML data on a successful axios call", async () => {
    (helpers.findPathKeyByCode as jest.Mock).mockReturnValue(mockPathKey);
    (axios.get as jest.Mock).mockResolvedValue({
      data: "<html>Real HTML</html>",
    });

    const result = await fetchPage(countryCode, false);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(mockPathKey),
    );
    expect(result).toBe("<html>Real HTML</html>");
  });

  it("should return 'notfound' on a 404 axios error", async () => {
    (helpers.findPathKeyByCode as jest.Mock).mockReturnValue(mockPathKey);

    const error = {
      isAxiosError: true,
      response: { status: 404 },
    };
    (axios.get as jest.Mock).mockRejectedValue(error);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    const result = await fetchPage(countryCode, false);

    expect(result).toBe("notfound");
  });

  it("should return 'servererror' on a 500 axios error", async () => {
    (helpers.findPathKeyByCode as jest.Mock).mockReturnValue(mockPathKey);

    const error = {
      isAxiosError: true,
      response: { status: 500 },
    };
    (axios.get as jest.Mock).mockRejectedValue(error);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

    const result = await fetchPage(countryCode, false);

    expect(result).toBe("servererror");
  });
});
