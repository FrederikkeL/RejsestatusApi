import fs from "fs";
import axios from "axios";
import { readFileSync } from "fs";

// Helper to get the mock file path depending on environment
function getMockFilePath() {
  if (process.env.JEST_WORKER_ID !== undefined) {
    // Running in Jest — mock file relative to test file
    return "mockData/mockCambodja.html";
  } else {
    // Running normally — back out a few directories
    return "../../mockData/mockCambodja.html";
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

  const url =
    "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/" +
    countrypathKey;
  const response = await axios.get(url);
  console.log("➡ Fetched real HTML from:", url);
  return response.data;
}

export function findCountryPathKey(countryCode: string) {
  const pathKeys = JSON.parse(readFileSync("./countryPathKeys.json", "utf-8"));
  return pathKeys.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.pathKey;
}
