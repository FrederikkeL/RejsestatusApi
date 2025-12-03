import fs from "fs";
import axios from "axios";
import path from "path";

// Helper to get the mock file path depending on environment
function getMockFilePath() {
  if (process.env.JEST_WORKER_ID !== undefined) {
    // Running in Jest — mock file relative to test file
    return "mockData/mockCambodja.html";
  } else {
    // Running normally — back out a few directories
    return "mockData/mockCambodja.html";
  }
}

// Load mock data once
const mockFilePath = getMockFilePath();
const mockdata = fs.readFileSync(mockFilePath, "utf-8");

// Main function
export async function fetchPage(countryCode: string, useMock: boolean) {
  if (useMock) {
    console.log("➡ Using mock HTML instead of real API call");
    return mockdata;
  }

  const countrypathKey = findCountryPathKey(countryCode);

  if (!countrypathKey) {
    return "emptykey";
  }

  try {
    const url =
      "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/" +
      countrypathKey;

    const response = await axios.get(url);
    console.log("➡ Fetched real HTML from:", url);
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return "notfound";
      }
      if (err.response?.status === 500) {
        return "servererror";
      }
      console.error("Unexpected error:", err);
      throw err;
    }
  }
}

export function findCountryPathKey(countryCode: string) {
  const jsonPath = path.resolve(__dirname, "countryPathKeys.json");
  const pathKeys = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return pathKeys.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.pathKey;
}
