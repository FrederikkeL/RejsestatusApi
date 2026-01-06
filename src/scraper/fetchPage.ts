import fs from "fs";
import axios from "axios";
import { findPathKeyByCode } from "../helpers/pathKeysHelpers";

const useMock = process.env.USE_MOCK === "true";

export async function fetchPage(countryCode: string) {
  if (useMock) {
    const mockdata = fs.readFileSync("mockData/mockCambodja.html", "utf-8");
    return mockdata;
  }

  const countrypathKey = findPathKeyByCode(countryCode);

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
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return "notfound";
      }
      if (err.response?.status === 500) {
        return "servererror";
      }
      throw new Error(`Failed to fetch page: ${err.message}`);
    }
  }
}
