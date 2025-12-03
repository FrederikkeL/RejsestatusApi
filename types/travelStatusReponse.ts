export interface CountryListResponse {
  httpCode: number;
  retrievedTime: string;
  version: string;
  countries: CountryResponse[];
}

export interface CountryResponse {
  country: string;
  httpCodeUM: number;
  errorMessage?: string;
  updatedTimeUM: string;
  travelStatuses: TravelStatus[];
}

export interface TravelStatus {
  travelStatus: string;
  headingText: string;
  contentText: string;
}
