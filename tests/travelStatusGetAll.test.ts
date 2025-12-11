import { getAllTravelStatuses } from "../src/routes/travelStatusAPI/travelStatusController";
import mockTravelStatus from "../mockData/mockTravelStatus";
import type { Request, Response } from "express";

it("getAllTravelStatuses uses mock data correctly", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  getAllTravelStatuses(req, res);

  expect(res.json).toHaveBeenCalledWith(mockTravelStatus);
});
