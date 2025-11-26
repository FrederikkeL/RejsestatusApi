import type { CountryListResponse } from "../types/travelStatusReponse";

const mockTravelStatus: CountryListResponse = {
  httpCode: 200,
  retrievedTime: "2023-10-01T12:00:00Z",
  version: "1.0.0",
  countries: [
    {
      country: "Finland",
      travelStatuses: [
        {
          travelStatus: "minimal",
          headingText: "Vær opmærksom: Hele landet",
          contentText:
            "Brug din sunde fornuft og vær opmærksom på mistænkelig adfærd som du ville være det, hvis du var i Danmark.",
        },
      ],
      httpCodeUM: 200,
      updatedTimeUM: "2023-10-01T12:00:00Z",
    },
    {
      country: "Sverige",
      travelStatuses: [
        {
          travelStatus: "low",
          headingText: "Vær opmærksom: Hele landet",
          contentText:
            "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau.",
        },
      ],
      httpCodeUM: 200,
      updatedTimeUM: "2023-10-01T12:05:00Z",
    },
    {
      country: "Ukraine",
      travelStatuses: [
        {
          travelStatus: "high",
          headingText: "Vi fraråder alle rejser til: Hele landet.",
          contentText:
            "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning.",
        },
      ],
      httpCodeUM: 200,
      updatedTimeUM: "2023-10-01T12:10:00Z",
    },
  ],
};

export default mockTravelStatus;
