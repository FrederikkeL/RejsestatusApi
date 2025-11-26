import type { Request, Response } from "express";
import mockTravelStatus from "../../mockData/mockTravelStatus.ts";

export const getAllTravelStatuses = (req: Request, res: Response) => {
  //missing logic for get all travel statuses

  if (!mockTravelStatus) {
    res.status(404).json({
      message: "Travel statuses are not available.",
    });
  }
  switch (mockTravelStatus.httpCode) {
    case 200:
      res.status(200).json(mockTravelStatus);
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

export const getTravelStatusByCountry = (req: Request, res: Response) => {
  const country = req.params.country.toLowerCase();
  //missing logic for get all travel statuses
  const status = mockTravelStatus.countries.find(
    (ts) => ts.country.toLowerCase() === country,
  );
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
