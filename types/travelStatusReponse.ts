export interface TravelStatusReponse {
  country: string;
  travelStatus: TravelStatus[];
  statusCode: number;
  timestamp: string;
  version: string;
}

export interface TravelStatus {
  status: string;
  headingText: string;
  contentText: string;
}

export interface TravelStatusListResponse {
  statusCode: number;
  timestamp: string;
  countries: TravelStatusReponse[];
}
