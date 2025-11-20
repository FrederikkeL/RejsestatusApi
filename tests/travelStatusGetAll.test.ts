import { getAllTravelStatuses } from "../src/travelStatusAPI/travelStatusController.ts";
import mockTravelStatus from "../mockData/mockTravelStatus.ts";
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

it("return the correct error message when status code is 500", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;
  getAllTravelStatuses(req, res);
  expect(res.json).toHaveBeenCalledWith({
    message:
      "Udenrigsministeriet's website is down, can't show travel statuses currently.",
  });
});

it("returns the correct error message when status code is undefined", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
    status: undefined,
  } as unknown as Response;
  getAllTravelStatuses(req, res);
  expect(res.json).toHaveBeenCalledWith({
    message: "An unexpected error occurred.",
  });
  expect(res.status).toBe(500);
});

it("return the correct error message when status code is 503", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
    status: 503,
  } as unknown as Response;
  getAllTravelStatuses(req, res);
  expect(res.json).toHaveBeenCalledWith({
    message:
      "Travel status service is down, can't show travel statuses currently.",
  });
});

it("return the correct error message when status code is 404", () => {
  const req = {} as Request;
  const res = {
    json: jest.fn(),
    status: 404,
  } as unknown as Response;
  getAllTravelStatuses(req, res);
  expect(res.json).toHaveBeenCalledWith({
    message: "Travel statuses are not available.",
  });
});
