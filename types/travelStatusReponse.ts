export interface CountryListResponse {
  retrievedTime: string;
  errorMessage?: string;
  version: string;
  countries: CountryResponse[];
}

export interface CountryResponse {
  country?: string;
  pathKey?: string;
  httpCodeUM: number;
  errorMessage?: string;
  updatedTimeUM?: string;
  updatedDateUM?: string;
  travelStatuses?: TravelStatus[];
}

export interface TravelStatus {
  travelStatus: TravelStatusLevel;
  headingText: string;
  contentText: string;
}

export type TravelStatusLevel = "minimal" | "low" | "medium" | "high" | null;

export interface pathKey {
  code: string;
  english: string;
  danish: string;
  pathKey: string;
}
