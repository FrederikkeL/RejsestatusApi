import type { CountryListResponse } from "../../types/travelStatusReponse";
import { getCachedData, deleteCachedData } from "../caching/caching";
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
  validateCachedData();
});

export async function validateCachedData() {
  const countryListResponse: CountryListResponse = getCachedData();

  if (has24HoursPassed(countryListResponse.retrievedTime)) {
    await deleteCachedData();
  }
}

function has24HoursPassed(input: string): boolean {
  const [datePart, timePart] = input.split(", ");

  const [day, month, year] = datePart.split(".").map(Number);
  const [hour, minute, second] = timePart.split(".").map(Number);

  const parsedDate = new Date(year, month - 1, day, hour, minute, second);

  return Date.now() >= parsedDate.getTime() + 24 * 60 * 60 * 1000;
}
