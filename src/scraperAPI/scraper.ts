import { extractTravelStatus } from "./extractTravelStatus";

async function main() {
  console.log(await extractTravelStatus("KZ"));
}
main();