export interface GooglePlaceResult {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

export interface GooglePlaceSearchResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

export interface GooglePlaceDetailsResponse {
  result: GooglePlaceResult;
  status: string;
  error_message?: string;
}

export interface PlaceSearchParams {
  query: string;
  location?: string;
  radius?: number;
  type?: string;
  pagetoken?: string;
}

export interface NearbySearchParams {
  location: string; // lat,lng
  radius: number;
  type?: string;
  keyword?: string;
  pagetoken?: string;
}