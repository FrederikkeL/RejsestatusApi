import type { CountryListResponse } from "../../types/travelStatusReponse";
import path from "path";
import fs from "fs/promises";

export async function cacheJSON(jsonCountryListResponse: CountryListResponse) {
  try {
    const filePath = path.join(__dirname, "data.json");
    const data = JSON.stringify(jsonCountryListResponse, null, 2);
    await fs.writeFile(filePath, data, "utf-8");
  } catch (error) {
    throw new Error(`Failed to cache country data: ${error.message}`);
  }
}
