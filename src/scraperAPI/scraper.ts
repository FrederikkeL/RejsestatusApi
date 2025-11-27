import { extractTravelStatus } from "./extractTravelStatus";

async function main(useMock) {
  console.log(await extractTravelStatus("KZ", useMock));
}
