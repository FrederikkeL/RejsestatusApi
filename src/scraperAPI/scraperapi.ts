import fs from "fs";
import axios from "axios";

// Helper to get the mock file path depending on environment
function getMockFilePath() {
  if (process.env.JEST_WORKER_ID !== undefined) {
    // Running in Jest — mock file relative to test file
    return "mockData/mockFinland.html";
  } else {
    // Running normally — back out a few directories
    return "../../mockData/mockFinland.html";
  }
}

// Load mock data once
const mockFilePath = getMockFilePath();
const mockdata = fs.readFileSync(mockFilePath, "utf-8");
fetchPage(true);

// Main function
export async function fetchPage(useMock = true) {
  if (useMock) {
    console.log("➡ Using mock HTML instead of real API call");
    console.log(mockdata.slice(0, 100));
    return mockdata;
  }

  const url =
    "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/cambodja";
  const response = await axios.get(url);
  console.log("➡ Fetched real HTML from:", url);
  return response.data;
}
