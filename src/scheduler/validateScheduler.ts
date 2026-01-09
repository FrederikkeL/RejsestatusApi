import type { CountryListResponse } from "../../types/travelStatusReponse";
import { getCachedData, deleteCachedData } from "../caching/caching";
import cron from "node-cron";

cron.schedule("30 0 * * *", async () => {
  validateCachedData();
});

export async function validateCachedData() {
  const countryListResponse: CountryListResponse = await getCachedData();
  if (has24HoursPassed(countryListResponse.retrievedTime)) {
    await deleteCachedData();
  }
}

function has24HoursPassed(time: string): boolean {
  const [datePart, timePart] = time.split(", ");

  const [day, month, year] = datePart.split(".").map(Number);
  const [hours, minutes, seconds] = timePart.split(".").map(Number);

  const targetDate = new Date(year, month - 1, day, hours, minutes, seconds);

  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
  const thresholdDate = targetDate.getTime() + twentyFourHoursInMs;

  return Date.now() >= thresholdDate;
}
