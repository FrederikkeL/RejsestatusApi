"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockTravelStatus = {
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
                    contentText: "Brug din sunde fornuft og vær opmærksom på mistænkelig adfærd som du ville være det, hvis du var i Danmark.",
                },
            ],
            httpCodeUM: 200,
            updatedTimeUM: "12:00:00",
            updatedDateUM: "01-10-2023",
        },
        {
            country: "Sverige",
            travelStatuses: [
                {
                    travelStatus: "low",
                    headingText: "Vær opmærksom: Hele landet",
                    contentText: "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau.",
                },
            ],
            httpCodeUM: 200,
            updatedTimeUM: "12:05:00",
            updatedDateUM: "01-10-2023",
        },
        {
            country: "Ukraine",
            travelStatuses: [
                {
                    travelStatus: "high",
                    headingText: "Vi fraråder alle rejser til: Hele landet.",
                    contentText: "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning.",
                },
            ],
            httpCodeUM: 200,
            updatedTimeUM: "12:10:00",
            updatedDateUM: "01-10-2023",
        },
        {
            country: "Cambodja",
            travelStatuses: [
                {
                    travelStatus: "low",
                    headingText: "Vær ekstra forsigtig: Hele landet undtagen området i den røde bjælke.",
                    contentText: "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau.",
                },
                {
                    travelStatus: "high",
                    headingText: "Vi fraråder alle rejser til: Grænseområdet til Thailand i en zone på 20 km fra grænsen.",
                    contentText: "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning.",
                },
            ],
            httpCodeUM: 200,
            updatedTimeUM: "12:38",
            updatedDateUM: "10-11-2025",
        },
    ],
};
exports.default = mockTravelStatus;
