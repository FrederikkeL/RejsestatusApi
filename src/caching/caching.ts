import type { CountryListResponse } from "../../types/travelStatusReponse";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

const dataPath = path.resolve(__dirname, "data.json");

export async function cacheJSON(jsonCountryListResponse: CountryListResponse) {
  try {
    const filePath = path.join(__dirname, "data.json");
    const data = JSON.stringify(jsonCountryListResponse, null, 2);
    await fs.writeFile(filePath, data, "utf-8");
  } catch (error) {
    throw new Error(`Failed to cache country data: ${error.message}`);
  }
}

export async function deleteCachedData() {
  try {
    const emptyCountryListResponse: CountryListResponse = {
      retrievedTime: new Date().toLocaleString("da-DK", {
        timeZone: "Europe/Copenhagen",
      }),
      version: "1.0.0",
      errorMessage: "Cached data deleted due to expiration.",
      countries: [],
    };
    const filePath = path.join(__dirname, "./data.json");
    await fs.writeFile(
      filePath,
      JSON.stringify(emptyCountryListResponse, null, 2),
      "utf-8",
    );
  } catch (error) {
    throw new Error(`Failed to delete cached country data: ${error.message}`);
  }
}

export async function getCachedData(): Promise<CountryListResponse> {
  const content = JSON.parse(fsSync.readFileSync(dataPath, "utf-8"));
  if (!content) {
    throw new Error("No cached data found");
  }
  return content as CountryListResponse;
}
