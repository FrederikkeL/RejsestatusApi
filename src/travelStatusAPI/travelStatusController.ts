import type { Request, Response } from "express";
import {
  findDanishNameByCode,
  findMockDanishNameByCode,
  findEnglishNameByCode,
} from "../helpers/pathKeysHelpers";
import mockTravelStatus from "../../mockData/mockTravelStatus";
import path from "path";
import fs from "fs";
import {
  CountryListResponse,
  CountryResponse,
} from "../../types/travelStatusReponse";

const dataPath = path.resolve(__dirname, "../caching/data.json");

export const getAllTravelStatuses = (req: Request, res: Response) => {
  let countryListResponse: CountryListResponse;

  if (process.env.JEST_WORKER_ID !== undefined) {
    countryListResponse = mockTravelStatus;
  } else {
    countryListResponse = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  }

  if (!countryListResponse) {
    return res.status(404).json({
      message: "Travel statuses are not available.",
    });
  }

  switch (countryListResponse.httpCode) {
    case 200:
      return res.status(200).json(countryListResponse);

    case 500:
      return res.status(500).json({
        message:
          "Udenrigsministeriet's website is down, can't show travel statuses currently.",
      });

    case 503:
      return res.status(503).json({
        message:
          "Travel status service is down, can't show travel statuses currently.",
      });

    case 404:
      return res.status(404).json({
        message: "Travel statuses are not available.",
      });

    default:
      return res.status(500).json({
        message: "An unexpected error occurred.",
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
    case 204:
      res.status(204).json({
        message: `No travel advice available for ${findEnglishNameByCode(req.params.country)}.`,
      });
      break;
    case 500:
      res.status(500).json({
        message: `Udenrigsministeriet's website is down, can't show travel status for ${findEnglishNameByCode(req.params.country)} currently.`,
      });
      break;
    case 503:
      res.status(503).json({
        message: `Travel status service is down, can't show travel status for ${findEnglishNameByCode(req.params.country)} currently.`,
      });
      break;
    case 404:
      res.status(404).json({
        message: `Travel status for ${findEnglishNameByCode(req.params.country)} is not available.`,
      });
      break;
    default:
      res.status(500).json({
        message: `Unexpected error occurred for ${findEnglishNameByCode(req.params.country)}.`,
      });
  }
};
