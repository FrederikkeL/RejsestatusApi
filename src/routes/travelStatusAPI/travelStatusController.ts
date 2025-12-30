import type { Request, Response } from "express";
import {
  findDanishNameByCode,
  findMockDanishNameByCode,
  findEnglishNameByCode,
} from "../../helpers/pathKeysHelpers";
import mockTravelStatus from "../../../mockData/mockTravelStatus";
import path from "path";
import fs from "fs";
import {
  CountryListResponse,
  CountryResponse,
} from "../../../types/travelStatusReponse";

const dataPath = path.resolve(__dirname, "../../caching/data.json");

export const getAllTravelStatuses = (req: Request, res: Response) => {
  try {
    const countryListResponse: CountryListResponse | null =
      process.env.JEST_WORKER_ID !== undefined
        ? mockTravelStatus
        : JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    if (!countryListResponse) {
      return res.status(404).json({
        message: "Travel statuses are not available.",
      });
    }

    if (countryListResponse.countries.length === 0) {
      const message = countryListResponse.errorMessage?.includes("No path keys")
        ? "Travel statuses are not available due to not being able to load pathkeys."
        : "Travel statuses are not available";

      return res.status(404).json({ message });
    }

    return res.status(200).json(countryListResponse);
  } catch (error) {
    console.error("Failed to retrieve travel statuses:", error);
    return res.status(500).json({
      message: "Internal server error while fetching travel statuses.",
    });
  }
};

export const getTravelStatusByCountry = async (req: Request, res: Response) => {
  let countryResponse: CountryResponse;

  let country = "";

  if (process.env.JEST_WORKER_ID !== undefined) {
    country = findMockDanishNameByCode(req.params.country);
    countryResponse = mockTravelStatus.countries.find(
      (ts) => ts.country?.toLowerCase() === country?.toLowerCase(),
    );
  } else {
    country = findDanishNameByCode(req.params.country);
    const countryListResponse: CountryListResponse = JSON.parse(
      fs.readFileSync(dataPath, "utf-8"),
    );
    countryResponse = countryListResponse.countries.find(
      (ts) => ts.country?.toLowerCase() === country?.toLowerCase(),
    );
  }
  if (!countryResponse) {
    return res.status(404).json({
      message: `Travel status for ${findEnglishNameByCode(req.params.country)} is not available.`,
    });
  }
  switch (countryResponse.httpCodeUM) {
    case 200:
      res.status(200).json(countryResponse);
      break;
    case 500:
      res.status(500).json({
        message: countryResponse.errorMessage,
      });
      break;
    case 404:
      res.status(404).json({
        message: countryResponse.errorMessage,
      });
      break;
    default:
      res.status(500).json({
        message: `Unexpected error occurred for ${findEnglishNameByCode(req.params.country)}.`,
      });
  }
};
