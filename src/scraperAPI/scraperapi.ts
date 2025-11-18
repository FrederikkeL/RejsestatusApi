// fetchPage.js
import axios from "axios";
import fs from "fs";

const mockdata = fs.readFileSync("mockData/mockFinland.html", "utf-8");

export async function fetchPage(useMock = true) {
  if (useMock) {
    console.log("➡ Using mock HTML instead of real API call");
    return mockdata;
  }

  const url =
    "https://um.dk/rejse-og-ophold/rejse-til-udlandet/rejsevejledninger/cambodja";
  const response = await axios.get(url);
  return response.data;
}
