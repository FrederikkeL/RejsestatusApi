import fs from "fs";
import path from "path";

export function findPathKeyByCode(countryCode: string) {
  const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");
  const countries = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return countries.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.pathKey;
}

export function findDanishNameByCode(countryCode: string) {
  const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");
  const countries = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const danishName = countries.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.danish;

  if (!danishName) {
    return countryCode;
  }
  return danishName;
}

export function findEnglishNameByCode(countryCode: string) {
  const jsonPath = path.resolve(__dirname, "../scraper/countryPathKeys.json");
  const countries = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const englishName = countries.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.english;

  if (!englishName) {
    return countryCode;
  }
  return englishName;
}

export function findMockDanishNameByCode(countryCode: string) {
  const jsonPath = path.resolve(
    __dirname,
    "../../mockData/mockCountryPathKeys.json",
  );
  const countries = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return countries.find(
    (key) => key.code.toLowerCase() === countryCode.toLowerCase(),
  )?.danish;
}
