import type { TravelStatusListResponse } from "../types/travelStatusReponse";

const mockTravelStatus: TravelStatusReponse[] = [
  {
    country: "Finland",
    travelStatus: [
      {
        status: "minimal",
        headingText: "Vær opmærksom: Hele landet",
        contentText:
          "Brug din sunde fornuft og vær opmærksom på mistænkelig adfærd som du ville være det, hvis du var i Danmark.",
      },
    ],
    statusCode: 200,
    timestamp: "2023-10-01T12:00:00Z",
    version: "1.0.0",
  },
  {
    country: "Sverige",
    travelStatus: [
      {
        status: "low",
        headingText: "Vær opmærksom: Hele landet",
        contentText:
          "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau.",
      },
    ],
    statusCode: 200,
    timestamp: "2023-10-01T12:05:00Z",
    version: "1.0.0",
  },
  {
    country: "Ukraine",
    travelStatus: [
      {
        status: "high",
        headingText: "Vi fraråder alle rejser til: Hele landet.",
        contentText:
          "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning.",
      },
    ],
    statusCode: 200,
    timestamp: "2023-10-01T12:10:00Z",
    version: "1.0.0",
  },
];

export default mockTravelStatus;
