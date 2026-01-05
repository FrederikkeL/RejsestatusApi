import type { Request, Response } from "express";
import {
  findDanishNameByCode,
  findEnglishNameByCode,
} from "../../helpers/pathKeysHelpers";
import {
  CountryListResponse,
  CountryResponse,
} from "../../../types/travelStatusReponse";
import { getCachedData } from "../../helpers/cachedDataHelpers";  

export const getAllTravelStatuses = (req: Request, res: Response) => {
  try {
    const countryListResponse: CountryListResponse = getCachedData();

    if (!countryListResponse || countryListResponse.countries.length === 0) {
      const isPathKeyError =
        countryListResponse?.errorMessage?.includes("No path keys");
      return res.status(404).json({
        message: isPathKeyError
          ? "Travel statuses unavailable: pathkeys missing."
          : "Travel statuses are not available.",
      });
    }

    return res.status(200).json(countryListResponse);
  } catch (error) {
    return res.status(500).json({
      message:
        "Internal server error while fetching travel statuses. " +
        error.message,
    });
  }
};

export const getTravelStatusByCountry = async (req: Request, res: Response) => {
  const country = findDanishNameByCode(req.params.country);
  const countryListResponse: CountryListResponse = getCachedData();

  const countryResponse: CountryResponse = countryListResponse.countries.find(
    (ts) => ts.country?.toLowerCase() === country?.toLowerCase(),
  );

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
