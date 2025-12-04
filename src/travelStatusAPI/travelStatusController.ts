import type { Request, Response } from "express";
import mockTravelStatus from "../../mockData/mockTravelStatus";
import path from "path";
import fs from "fs";
 const dataPath = path.resolve(__dirname, "../scraper/data.json");
const mock = false;
export const getAllTravelStatuses = (req: Request, res: Response) => {
  var travelStatus;
  if (mock) {
    travelStatus = mockTravelStatus;
  } else {
    travelStatus = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  }
  if (!travelStatus) {
    res.status(404).json({
      message: "Travel statuses are not available.",
    });
  }
  switch (travelStatus.httpCode) {
    case 200:
      res.status(200).json(travelStatus);
      break;
    case 500:
      res.status(500).json({
        message:
          "Udenrigsministeriet's website is down, can't show travel statuses currently.",
      });
      break;
    case 503:
      res.status(503).json({
        message:
          "Travel status service is down, can't show travel statuses currently.",
      });
      break;
    case 404:
      res.status(404).json({
        message: "Travel statuses are not available.",
      });
      break;
    default:
      res.status(500).json({
        message: "An unexpected error occurred.",
      });
  }
};

export const getTravelStatusByCountry = async (req: Request, res: Response) => {
  const country = req.params.country.toLowerCase();
  let status = null;
  if (mock) {
    status = mockTravelStatus.countries.find(
      (ts) => ts.country.toLowerCase() === country,
    );
  } else {

    const countries = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    return countries.find(
      (key) => key.code.toLowerCase() === country.toLowerCase(),
    )?.pathKey;
  }

  if (!status) {
    return res.status(404).json({
      message: `Travel status for ${req.params.country} is not available.`,
    });
  }
  switch (status.httpCodeUM) {
    case 200:
      res.status(200).json(status);
      break;
    case 500:
      res.status(500).json({
        message: `Udenrigsministeriet's website is down, can't show travel status for ${req.params.country} currently.`,
      });
      break;
    case 503:
      res.status(503).json({
        message: `Travel status service is down, can't show travel status for ${req.params.country} currently.`,
      });
      break;
    case 404:
      res.status(404).json({
        message: `Travel status for ${req.params.country} is not available.`,
      });
      break;
    default:
      res.status(500).json({
        message: `Unexpected error occurred for ${req.params.country}.`,
      });
  }
};
