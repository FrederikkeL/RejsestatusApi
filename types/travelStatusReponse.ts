export interface CountryListResponse {
  retrievedTime: string;
  version: string;
  countries: CountryResponse[];
}

export interface CountryResponse {
  country?: string;
  httpCodeUM: number;
  errorMessage?: string;
  updatedTimeUM?: string;
  updatedDateUM?: string;
  travelStatuses?: TravelStatus[];
}

export interface TravelStatus {
  travelStatus: string;
  headingText: string;
  contentText: string;
}
