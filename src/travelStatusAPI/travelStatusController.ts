import type { Request, Response } from "express";
import mockTravelStatus from "../../mockData/mockTravelStatus.ts";

export const getAllTravelStatuses = (req: Request, res: Response) => {
  res.json(mockTravelStatus);
};
