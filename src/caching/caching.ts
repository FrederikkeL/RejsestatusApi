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
  try {
    if (!fsSync.existsSync(dataPath)) {
      return createEmptyResponse("No cache file exists");
    }

    const rawContent = fsSync.readFileSync(dataPath, "utf-8");
    const content = JSON.parse(rawContent);

    if (!content || !Array.isArray(content.countries)) {
      return createEmptyResponse("Cached data is malformed or empty");
    }

    return content as CountryListResponse;
  } catch (error) {
    return createEmptyResponse(
      "Error reading or parsing cache. " + error.message,
    );
  }
}

function createEmptyResponse(message: string): CountryListResponse {
  return {
    retrievedTime: new Date().toLocaleString("da-DK", {
      timeZone: "Europe/Copenhagen",
    }),
    errorMessage: message,
    version: "1.0.0",
    countries: [],
  };
}
