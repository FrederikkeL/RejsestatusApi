import {
  getAllTravelStatuses,
  getTravelStatusByCountry,
} from "../src/routes/travelStatusAPI/travelStatusController";
import * as helpers from "../src/helpers/pathKeysHelpers";
import fs from "fs";
import type { Request, Response } from "express";

jest.mock("fs");
jest.mock("../src/helpers/pathKeysHelpers");

describe("Travel Status Controller", () => {
  let mockReq: Partial<Request> & { params: Record<string, string> };
  let mockRes: Partial<Response>;
  
  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllTravelStatuses", () => {
    it("should return 404 if data file is empty or missing", () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ countries: [] }),
      );

      getAllTravelStatuses(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Travel statuses are not available.",
      });
    });

    it("should return the specific pathkeys missing message when errorMessage includes 'No path keys'", () => {
      const mockData = {
        countries: [],
        errorMessage: "No path keys available to run the scraper.",
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      getAllTravelStatuses(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Travel statuses unavailable: pathkeys missing.",
      });
    });

    it("should return 200 and data when file exists", () => {
      const mockData = { countries: [{ country: "Finland" }] };
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      getAllTravelStatuses(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });

    it("should return 500 when the file system fails to read the file", () => {
      (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Cache read failure");
      });

      getAllTravelStatuses(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message:
          "Internal server error while fetching travel statuses. Cache read failure",
      });
    });
  });

  describe("getTravelStatusByCountry", () => {
    it("should return 200 when country is found", async () => {
      mockReq.params.country = "FI";
      const mockData = { countries: [{ country: "Finland", httpCodeUM: 200 }] };

      (helpers.findDanishNameByCode as jest.Mock).mockReturnValue("Finland");
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      await getTravelStatusByCountry(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it("should return 404 with English name if country is not found", async () => {
      mockReq.params.country = "unknown";
      (helpers.findDanishNameByCode as jest.Mock).mockReturnValue(undefined);
      (helpers.findEnglishNameByCode as jest.Mock).mockReturnValue(
        "Unknown Country",
      );
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ countries: [] }),
      );

      await getTravelStatusByCountry(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Travel status for Unknown Country is not available.",
      });
    });

    it("should return 500 if the cached data contains a 500 HTTP-code from UM", async () => {
      const mockData = {
        countries: [
          {
            httpCodeUM: 500,
            errorMessage:
              "Server error when fetching travel advice for Unknown Country.",
          },
        ],
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      await getTravelStatusByCountry(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message:
          "Server error when fetching travel advice for Unknown Country.",
      });
    });

    it("should return 404 if the cached data contains a 404 HTTP-code", async () => {
      const mockData = {
        countries: [
          {
            httpCodeUM: 404,
            errorMessage:
              "Country is not registered on Ministry of Foreign Affairs' website so there is no available travel advice for Finland.",
          },
        ],
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      await getTravelStatusByCountry(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message:
          "Country is not registered on Ministry of Foreign Affairs' website so there is no available travel advice for Finland.",
      });
    });

    it("should return 500 if unexpected HTTP-code is returned", async () => {
      mockReq.params.country = "FI";

      (helpers.findDanishNameByCode as jest.Mock).mockReturnValue("Finland");
      (helpers.findEnglishNameByCode as jest.Mock).mockReturnValue("Finland");

      const mockData = {
        countries: [
          {
            country: "Finland",
            httpCodeUM: 0,
            errorMessage: "An unexpected error occurred.",
          },
        ],
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      await getTravelStatusByCountry(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Unexpected error occurred for Finland.",
      });
    });
  });
});
