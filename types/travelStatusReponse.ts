export interface TravelStatusReponse {
  country: string;
  travelStatus: string;
  text: { travelAdvice: string; accordionText: string };
  statusCode: number;
  timestamp: string;
  version: string;
}
