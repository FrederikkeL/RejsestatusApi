import type { TravelStatusReponse } from "../types/travelStatusReponse";

const mockTravelStatus: TravelStatusReponse[] = [
  {
    country: "Finland",
    travelStatus: "GRØN",
    text: {
      travelAdvice: "Vær opmærksom: Hele landet",
      accordionText:
        "Brug din sunde fornuft og vær opmærksom på mistænkelig adfærd som du ville være det, hvis du var i Danmark.",
    },
    statusCode: 200,
    timestamp: "2023-10-01T12:00:00Z",
    version: "1.0.0",
  },
  {
    country: "Sverige",
    travelStatus: "GUL",
    text: {
      travelAdvice: "Vær ekstra forsigtig: Hele landet",
      accordionText:
        "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau.",
    },
    statusCode: 200,
    timestamp: "2023-10-01T12:05:00Z",
    version: "1.0.0",
  },
  {
    country: "Ukraine",
    travelStatus: "RØD",
    text: {
      travelAdvice: "Vi fraråder alle rejser til: Hele landet.",
      accordionText:
        "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning.",
    },
    statusCode: 200,
    timestamp: "2023-10-01T12:10:00Z",
    version: "1.0.0",
  },
];

export default mockTravelStatus;
