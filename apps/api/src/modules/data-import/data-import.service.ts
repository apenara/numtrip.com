import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GooglePlacesService } from '../google-places/google-places.service';
import { ImportCategory } from '../google-places/dto/google-places.dto';
import { BusinessCategory } from '@prisma/client';

export interface ImportResult {
  success: boolean;
  imported: number;
  duplicates: number;
  errors: number;
  details: {
    created: string[];
    duplicateIds: string[];
    errorMessages: string[];
  };
}

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingId?: string;
  confidence: number;
}

@Injectable()
export class DataImportService {
  private readonly logger = new Logger(DataImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googlePlacesService: GooglePlacesService
  ) {}

  /**
   * Import businesses from Google Places for a specific city and category
   */
  async importBusinesses(
    city: string,
    category: ImportCategory,
    limit: number = 100,
    skipDuplicates: boolean = false
  ): Promise<ImportResult> {
    this.logger.log(`Starting import for ${category} in ${city}, limit: ${limit}`);
    
    const result: ImportResult = {
      success: false,
      imported: 0,
      duplicates: 0,
      errors: 0,
      details: {
        created: [],
        duplicateIds: [],
        errorMessages: []
      }
    };

    try {
      // Get search queries based on category
      const queries = this.getSearchQueries(city, category);
      
      for (const query of queries) {
        if (result.imported >= limit) break;
        
        this.logger.log(`Searching: ${query}`);
        
        // Search places
        const searchResponse = await this.googlePlacesService.textSearch({
          query,
          location: this.getCityCoordinates(city),
          radius: 50000 // 50km radius
        });

        if (searchResponse.status !== 'OK') {
          this.logger.error(`Search failed: ${searchResponse.error_message}`);
          result.details.errorMessages.push(`Search failed: ${searchResponse.error_message}`);
          continue;
        }

        // Process each place
        for (const place of searchResponse.results) {
          if (result.imported >= limit) break;

          try {
            // Get detailed information
            const detailsResponse = await this.googlePlacesService.getPlaceDetails(place.place_id);
            
            if (detailsResponse.status !== 'OK') {
              this.logger.warn(`Failed to get details for ${place.name}: ${detailsResponse.error_message}`);
              result.errors++;
              result.details.errorMessages.push(`Details failed for ${place.name}: ${detailsResponse.error_message}`);
              continue;
            }

            const placeDetails = detailsResponse.result;

            // Check for duplicates
            if (!skipDuplicates) {
              const duplicateCheck = await this.checkForDuplicates(placeDetails);
              if (duplicateCheck.isDuplicate) {
                this.logger.log(`Duplicate found: ${placeDetails.name} (existing: ${duplicateCheck.existingId})`);
                result.duplicates++;
                result.details.duplicateIds.push(duplicateCheck.existingId!);
                continue;
              }
            }

            // Get or create city
            const cityId = await this.getOrCreateCity(city);
            
            // Map and create business
            const businessData = await this.googlePlacesService.mapGooglePlaceToBusiness(placeDetails, city, cityId);
            
            const createdBusiness = await this.prisma.business.create({
              data: businessData
            });

            // Create contacts if available
            await this.createContactsForBusiness(createdBusiness.id, placeDetails);

            result.imported++;
            result.details.created.push(createdBusiness.id);
            
            this.logger.log(`Imported: ${businessData.name} (${createdBusiness.id})`);

            // Add small delay to respect rate limits
            await this.delay(100);

          } catch (error) {
            this.logger.error(`Failed to import ${place.name}: ${error.message}`, error.stack);
            result.errors++;
            result.details.errorMessages.push(`Import failed for ${place.name}: ${error.message}`);
          }
        }

        // Handle pagination if available and needed
        if (searchResponse.next_page_token && result.imported < limit) {
          this.logger.log('Fetching next page...');
          await this.delay(2000); // Google requires 2s delay before using next_page_token
          
          const nextPageResponse = await this.googlePlacesService.textSearch({
            query,
            pagetoken: searchResponse.next_page_token
          });

          // Process next page results (similar logic)
          // Note: This is simplified - in production you might want to extract this into a separate method
        }
      }

      result.success = result.imported > 0;
      
      this.logger.log(`Import completed. Imported: ${result.imported}, Duplicates: ${result.duplicates}, Errors: ${result.errors}`);
      
      return result;

    } catch (error) {
      this.logger.error(`Import process failed: ${error.message}`, error.stack);
      result.details.errorMessages.push(`Process failed: ${error.message}`);
      return result;
    }
  }

  /**
   * Check if a place already exists in our database
   */
  private async checkForDuplicates(place: any): Promise<DuplicateCheckResult> {
    // First, check by Google Place ID (most reliable)
    if (place.place_id) {
      const existingByPlaceId = await this.prisma.business.findFirst({
        where: { googlePlaceId: place.place_id }
      });

      if (existingByPlaceId) {
        return {
          isDuplicate: true,
          existingId: existingByPlaceId.id,
          confidence: 1.0
        };
      }
    }

    // Check by name and address similarity
    const nameWords = place.name.toLowerCase().split(' ').filter(w => w.length > 2);
    
    if (nameWords.length > 0) {
      const similarBusinesses = await this.prisma.business.findMany({
        where: {
          OR: nameWords.map(word => ({
            name: {
              contains: word,
              mode: 'insensitive'
            }
          }))
        }
      });

      for (const business of similarBusinesses) {
        const similarity = this.calculateSimilarity(place.name, business.name);
        
        // If names are very similar and in same city
        if (similarity > 0.8 && business.address?.toLowerCase().includes(place.formatted_address?.toLowerCase() || '')) {
          return {
            isDuplicate: true,
            existingId: business.id,
            confidence: similarity
          };
        }
      }
    }

    return {
      isDuplicate: false,
      confidence: 0
    };
  }

  /**
   * Calculate string similarity (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1.0;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Get appropriate search queries for category and city
   */
  private getSearchQueries(city: string, category: ImportCategory): string[] {
    const baseQueries = this.googlePlacesService.getCategorySearchQueries(city);
    
    switch (category) {
      case ImportCategory.HOTELS:
        return [baseQueries.hotels, `accommodation in ${city}`, `hostels in ${city}`];
      
      case ImportCategory.RESTAURANTS:
        return [baseQueries.restaurants, `food in ${city}`, `dining in ${city}`];
      
      case ImportCategory.TOURS:
        return [baseQueries.tours, `tour operators ${city}`, `excursions ${city}`];
      
      case ImportCategory.TRANSPORT:
        return [baseQueries.transport, `taxi services ${city}`, `car rental ${city}`];
      
      case ImportCategory.ATTRACTIONS:
        return [baseQueries.attractions, `museums in ${city}`, `parks in ${city}`];
      
      case ImportCategory.ALL:
        return Object.values(baseQueries);
      
      default:
        return [baseQueries.hotels]; // fallback
    }
  }

  /**
   * Get coordinates for major cities (hardcoded for now)
   */
  private getCityCoordinates(city: string): string {
    const coordinates: Record<string, string> = {
      'Cartagena': '10.3932,-75.4832',
      'Cartagena, Colombia': '10.3932,-75.4832',
      'Bogotá': '4.7110,-74.0721',
      'Medellín': '6.2442,-75.5812',
      'Cali': '3.4516,-76.5320'
    };
    
    return coordinates[city] || coordinates['Cartagena']; // Default to Cartagena
  }

  /**
   * Utility method to add delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalBusinesses: number;
    businessesByCategory: Record<BusinessCategory, number>;
    businessesByCity: Record<string, number>;
    verifiedBusinesses: number;
    withGooglePlaceId: number;
  }> {
    const [
      totalBusinesses,
      businessesByCategory,
      businessesByCityId,
      verifiedBusinesses,
      withGooglePlaceId
    ] = await Promise.all([
      this.prisma.business.count(),
      this.prisma.business.groupBy({
        by: ['category'],
        _count: { id: true }
      }),
      this.prisma.business.groupBy({
        by: ['cityId'],
        _count: { id: true }
      }),
      this.prisma.business.count({ where: { verified: true } }),
      this.prisma.business.count({ where: { googlePlaceId: { not: null } } })
    ]);

    // Get city names for the results
    const cityIds = businessesByCityId.map(item => item.cityId).filter(id => id);
    const cities = await this.prisma.city.findMany({
      where: { id: { in: cityIds } },
      select: { id: true, name: true },
    });

    const cityMap = Object.fromEntries(cities.map(city => [city.id, city.name]));

    const categoryStats = businessesByCategory.reduce((acc, item) => {
      acc[item.category] = item._count.id;
      return acc;
    }, {} as Record<BusinessCategory, number>);

    const cityStats = businessesByCityId.reduce((acc, item) => {
      const cityName = item.cityId ? cityMap[item.cityId] || 'Unknown' : 'No City';
      acc[cityName] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBusinesses,
      businessesByCategory: categoryStats,
      businessesByCity: cityStats,
      verifiedBusinesses,
      withGooglePlaceId
    };
  }

  /**
   * Get existing city or create new one
   */
  private async getOrCreateCity(cityName: string): Promise<string> {
    const cityData = this.extractCityInfo(cityName);
    
    // Try to find existing city
    const existingCity = await this.prisma.city.findFirst({
      where: {
        name: cityData.name,
        country: cityData.country,
      },
    });

    if (existingCity) {
      return existingCity.id;
    }

    // Create new city
    const newCity = await this.prisma.city.create({
      data: cityData,
    });

    this.logger.log(`Created new city: ${cityData.name}, ${cityData.country}`);
    return newCity.id;
  }

  /**
   * Extract city and country from city string
   */
  private extractCityInfo(cityString: string): { name: string; country: string; latitude?: number; longitude?: number } {
    // Handle common formats like "Cartagena, Colombia"
    const parts = cityString.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
      return {
        name: parts[0],
        country: parts[parts.length - 1],
        // Add coordinates for known cities
        ...(parts[0] === 'Cartagena' && parts[1] === 'Colombia' ? {
          latitude: 10.3997,
          longitude: -75.5144,
        } : {}),
      };
    }
    
    // Fallback - assume it's just a city name
    return {
      name: cityString,
      country: 'Unknown',
    };
  }

  /**
   * Create contact records for a business from Google Place data
   */
  private async createContactsForBusiness(businessId: string, placeDetails: any) {
    const contacts = [];

    // Phone contact
    const phone = placeDetails.formatted_phone_number || placeDetails.international_phone_number;
    if (phone) {
      // Clean phone number - remove common formatting
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');
      contacts.push({
        businessId,
        type: 'PHONE' as const,
        value: cleanPhone,
        verified: false,
        primaryContact: true,
      });
    }

    // Website contact
    if (placeDetails.website) {
      contacts.push({
        businessId,
        type: 'WEBSITE' as const,
        value: placeDetails.website,
        verified: false,
        primaryContact: false,
      });
    }

    // Create all contacts
    if (contacts.length > 0) {
      await this.prisma.contact.createMany({
        data: contacts,
        skipDuplicates: true,
      });

      this.logger.log(`Created ${contacts.length} contacts for business ${businessId}`);
    }
  }
}