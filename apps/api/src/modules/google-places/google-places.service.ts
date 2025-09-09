import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';
import { 
  GooglePlaceResult, 
  GooglePlaceSearchResponse, 
  GooglePlaceDetailsResponse,
  PlaceSearchParams,
  NearbySearchParams 
} from './interfaces/places.interface';
import { BusinessCategory } from '@prisma/client';

@Injectable()
export class GooglePlacesService {
  private readonly logger = new Logger(GooglePlacesService.name);
  private readonly client: Client;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('Google Places API key not found. Service will not work properly.');
    }
    this.client = new Client({});
  }

  /**
   * Search for places using text query
   */
  async textSearch(params: PlaceSearchParams): Promise<GooglePlaceSearchResponse> {
    if (!this.apiKey) {
      throw new BadRequestException('Google Places API key not configured');
    }

    try {
      this.logger.log(`Text search: ${params.query}`);
      
      const searchParams: any = {
        query: params.query,
        key: this.apiKey,
        type: params.type as any,
        pagetoken: params.pagetoken,
      };

      // Only add location and radius if location is provided
      if (params.location) {
        searchParams.location = params.location;
        searchParams.radius = params.radius;
      }

      const response = await this.client.textSearch({
        params: searchParams,
      });

      this.logger.log(`Found ${response.data.results.length} results`);
      
      return {
        results: response.data.results as GooglePlaceResult[],
        status: response.data.status,
        error_message: response.data.error_message,
        next_page_token: response.data.next_page_token,
      };
    } catch (error) {
      this.logger.error(`Text search failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Places search failed: ${error.message}`);
    }
  }

  /**
   * Search for places near a location
   */
  async nearbySearch(params: NearbySearchParams): Promise<GooglePlaceSearchResponse> {
    if (!this.apiKey) {
      throw new BadRequestException('Google Places API key not configured');
    }

    try {
      this.logger.log(`Nearby search at ${params.location}, radius: ${params.radius}m`);
      
      const response = await this.client.placesNearby({
        params: {
          location: params.location,
          radius: params.radius,
          key: this.apiKey,
          type: params.type as any,
          keyword: params.keyword,
          pagetoken: params.pagetoken,
        },
      });

      this.logger.log(`Found ${response.data.results.length} nearby results`);
      
      return {
        results: response.data.results as GooglePlaceResult[],
        status: response.data.status,
        error_message: response.data.error_message,
        next_page_token: response.data.next_page_token,
      };
    } catch (error) {
      this.logger.error(`Nearby search failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Nearby search failed: ${error.message}`);
    }
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetailsResponse> {
    if (!this.apiKey) {
      throw new BadRequestException('Google Places API key not configured');
    }

    try {
      this.logger.log(`Fetching details for place: ${placeId}`);
      
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'geometry',
            'types',
            'business_status',
            'rating',
            'user_ratings_total',
            'price_level',
            'formatted_phone_number',
            'international_phone_number',
            'website',
            'opening_hours',
            'photos'
          ],
        },
      });

      return {
        result: response.data.result as GooglePlaceResult,
        status: response.data.status,
        error_message: response.data.error_message,
      };
    } catch (error) {
      this.logger.error(`Place details failed: ${error.message}`, error.stack);
      throw new BadRequestException(`Place details failed: ${error.message}`);
    }
  }

  /**
   * Map Google Place types to our Category enum
   */
  mapGoogleTypesToCategory(types: string[]): BusinessCategory {
    // Priority mapping - check most specific types first
    for (const type of types) {
      switch (type) {
        case 'lodging':
        case 'rv_park':
          return BusinessCategory.HOTEL;
        
        case 'travel_agency':
        case 'tourist_attraction':
        case 'amusement_park':
        case 'aquarium':
        case 'art_gallery':
        case 'museum':
        case 'zoo':
          return BusinessCategory.TOUR;
        
        case 'taxi_stand':
        case 'bus_station':
        case 'subway_station':
        case 'airport':
        case 'car_rental':
        case 'moving_company':
          return BusinessCategory.TRANSPORT;
        
        case 'restaurant':
        case 'meal_takeaway':
        case 'meal_delivery':
        case 'food':
        case 'bar':
        case 'cafe':
        case 'night_club':
          return BusinessCategory.RESTAURANT;
        
        case 'park':
        case 'campground':
        case 'natural_feature':
          return BusinessCategory.ATTRACTION;
      }
    }
    
    // Fallback based on keywords in types
    const typeString = types.join(' ').toLowerCase();
    if (typeString.includes('hotel') || typeString.includes('accommodation')) {
      return BusinessCategory.HOTEL;
    }
    if (typeString.includes('tour') || typeString.includes('attraction')) {
      return BusinessCategory.TOUR;
    }
    if (typeString.includes('transport') || typeString.includes('rental')) {
      return BusinessCategory.TRANSPORT;
    }
    if (typeString.includes('food') || typeString.includes('restaurant')) {
      return BusinessCategory.RESTAURANT;
    }
    
    return BusinessCategory.OTHER;
  }

  /**
   * Map Google Place data to our Business model format
   */
  async mapGooglePlaceToBusiness(place: GooglePlaceResult, city: string, cityId: string) {
    const category = this.mapGoogleTypesToCategory(place.types || []);
    
    // Extract website
    const website = place.website || null;

    return {
      name: place.name || 'Unknown Business',
      description: `${category.toLowerCase().replace('_', ' ')} in ${city}`,
      category,
      address: place.formatted_address || null,
      cityId: cityId,
      latitude: place.geometry?.location.lat || null,
      longitude: place.geometry?.location.lng || null,
      googlePlaceId: place.place_id || null,
      website: website,
      verified: false,
      claimed: false,
    };
  }

  /**
   * Get search queries for different business categories in a city
   */
  getCategorySearchQueries(city: string): Record<string, string> {
    return {
      hotels: `hotels in ${city}`,
      restaurants: `restaurants in ${city}`,
      tours: `tourist tours ${city}`,
      transport: `transportation services ${city}`,
      attractions: `tourist attractions ${city}`,
    };
  }

  /**
   * Validate if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}