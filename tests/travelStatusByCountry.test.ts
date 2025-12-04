import { getTravelStatusByCountry } from "./../src/travelStatusAPI/travelStatusController";
import mockTravelStatus from "./../mockData/mockTravelStatus";
import { Request, Response } from "express";

describe("getTravelStatusByCountry", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    req = {};
    res = {
      json: jsonMock,
      status: statusMock,
    };
  });

  it("returns the correct travel status for an existing country", () => {
    req.params = { country: "FI" };

    getTravelStatusByCountry(req as Request, res as Response);

    const expectedTravelStatus = mockTravelStatus.countries.find(
      (ts) => ts.country.toLowerCase() === "finland",
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expectedTravelStatus);
  });

  it("returns 404 if the country does not exist", () => {
    req.params = { country: "NonExistingCountry" };

    getTravelStatusByCountry(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Travel status for NonExistingCountry is not available.",
    });
  });
});
