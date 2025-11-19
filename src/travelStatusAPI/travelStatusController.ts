import type { Request, Response } from "express";
import mockTravelStatus from "../../mockData/mockTravelStatus.ts";

export const getAllTravelStatuses = (req: Request, res: Response) => {
  res.json(mockTravelStatus);
};

export const getTravelStatusByCountry = (req: Request, res: Response) => {
  const country = req.params.country.toLowerCase();
  const status = mockTravelStatus.find(
    (ts) => ts.country.toLowerCase() === country,
  );
  if (status) {
    res.json(status);
  } else {
    res
      .status(404)
      .json({ message: `travel status not found for ${country}.` });
  }
};
