import { getAllTravelStatuses } from "../src/travelStatusAPI/travelStatusController.ts";
import mockTravelStatus from "../mockData/mockTravelStatus.ts";
import type { Request, Response } from "express";

it("getAllTravelStatuses uses mock data correctly", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
  } as unknown as Response;

  getAllTravelStatuses(req, res);

  expect(res.json).toHaveBeenCalledWith(mockTravelStatus);
});
