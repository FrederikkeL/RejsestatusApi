const fs = require("fs").promises;
import type { CountryListResponse } from "../../types/travelStatusReponse";
const path = require("path");

  
async function cacheJSON(jsonCountryListResponse: CountryListResponse) {
  try {
    const filePath = path.join(__dirname, "data.json");
    const data = JSON.stringify(jsonCountryListResponse, null, 2);
    await fs.writeFile(filePath, data, "utf-8");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}
export { cacheJSON };
