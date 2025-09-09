import { createClient } from '@/lib/supabase';
import { Business, BusinessCategory, BusinessSearchParams, BusinessSearchResponse } from '@contactos-turisticos/types';
import { Database } from '@/types/database';
import { textFormatters } from '@/../../packages/utils/src/formatters/text';

type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type ContactRow = Database['public']['Tables']['contacts']['Row'];
type CityRow = Database['public']['Tables']['cities']['Row'];

interface BusinessWithRelations extends BusinessRow {
  cities: CityRow | null;
  contacts: ContactRow[];
}

export class SupabaseBusinessService {
  
  /**
   * Generates SEO-friendly slug for business
   * Format: contacto-de-business-name-city-verificado/no-verificado (Spanish)
   * Format: contact-for-business-name-city-verified/not-verified (English)
   * If no city, omits city part: contacto-de-business-name-verificado
   */
  static generateBusinessSlug(business: Business, locale: string = 'es'): string {
    const nameSlug = textFormatters.toSlug(business.name);
    
    // Handle cases where city is missing, empty, or "Unknown"
    const hasValidCity = business.city && 
                        business.city.toLowerCase() !== 'unknown' && 
                        business.city.trim() !== '';
    const citySlug = hasValidCity ? textFormatters.toSlug(business.city) : '';
    
    const isSpanish = locale === 'es';
    const prefix = isSpanish ? 'contacto-de' : 'contact-for';
    const verificationStatus = isSpanish 
      ? (business.verified ? 'verificado' : 'no-verificado')
      : (business.verified ? 'verified' : 'not-verified');
    
    // Build slug parts, excluding empty city
    const parts = [prefix, nameSlug];
    if (citySlug) {
      parts.push(citySlug);
    }
    parts.push(verificationStatus);
    
    return parts.join('-');
  }

  /**
   * Parses business slug to extract search criteria
   * Supports both Spanish and English formats, with optional city
   */
  private static parseBusinessSlug(slug: string): { name: string; city?: string; verified?: boolean } | null {
    // Expected formats:
    // Spanish: contacto-de-business-name-city-verificado/no-verificado
    // Spanish (no city): contacto-de-business-name-verificado/no-verificado
    // English: contact-for-business-name-city-verified/not-verified
    // English (no city): contact-for-business-name-verified/not-verified
    
    let isSpanish = false;
    let parts: string[] = [];
    
    if (slug.startsWith('contacto-de-')) {
      isSpanish = true;
      parts = slug.replace('contacto-de-', '').split('-');
    } else if (slug.startsWith('contact-for-')) {
      isSpanish = false;
      parts = slug.replace('contact-for-', '').split('-');
    } else {
      return null;
    }
    
    if (parts.length < 2) {
      return null;
    }
    
    // Get verification status from end (language-specific)
    let verified: boolean | undefined;
    let city: string | undefined;
    let nameEnd = parts.length;
    
    if (isSpanish) {
      // Check for "no-verificado" as a compound word
      const lastTwoParts = parts.slice(-2).join('-');
      if (lastTwoParts === 'no-verificado') {
        verified = false;
        nameEnd = parts.length - 2;
      } else if (parts[parts.length - 1] === 'verificado') {
        verified = true;
        nameEnd = parts.length - 1;
      }
    } else {
      // Check for "not-verified" as a compound word
      const lastTwoParts = parts.slice(-2).join('-');
      if (lastTwoParts === 'not-verified') {
        verified = false;
        nameEnd = parts.length - 2;
      } else if (parts[parts.length - 1] === 'verified') {
        verified = true;
        nameEnd = parts.length - 1;
      }
    }
    
    // For city detection, check for known city patterns
    // Common cities we know: cartagena, bogota, medellin, etc.
    const knownCities = ['cartagena', 'bogota', 'medellin', 'barranquilla', 'cali', 'bucaramanga'];
    const knownCountries = ['colombia', 'mexico', 'peru', 'ecuador', 'panama'];
    
    // Look for city and country pattern (e.g., "cartagena-colombia")
    if (nameEnd >= 2) {
      const possibleCountry = parts[nameEnd - 1];
      const possibleCity = parts[nameEnd - 2];
      
      // Check if we have a city-country pattern
      if (knownCountries.includes(possibleCountry.toLowerCase()) && 
          knownCities.includes(possibleCity.toLowerCase())) {
        city = possibleCity;
        // Include both city and country in the name search for better matching
        const name = parts.slice(0, nameEnd - 2).join(' ');
        return { name, city, verified };
      }
      
      // Check if the last part is just a city
      if (knownCities.includes(parts[nameEnd - 1].toLowerCase())) {
        city = parts[nameEnd - 1];
        const name = parts.slice(0, nameEnd - 1).join(' ');
        return { name, city, verified };
      }
    }
    
    // If no city pattern is detected, include everything as the name
    // This helps with businesses that have cities in their names
    const name = parts.slice(0, nameEnd).join(' ');
    return { name, verified };
  }

  private static transformBusinessData(businessData: BusinessWithRelations): Business {
    // Extract contacts by type
    const phoneContact = businessData.contacts.find(c => c.type === 'PHONE');
    const emailContact = businessData.contacts.find(c => c.type === 'EMAIL');
    const whatsappContact = businessData.contacts.find(c => c.type === 'WHATSAPP');

    return {
      id: businessData.id,
      name: businessData.name,
      description: businessData.description || undefined,
      category: businessData.category as BusinessCategory,
      verified: businessData.verified || false,
      active: true, // Default to true since this field doesn't exist in Supabase
      city: businessData.cities?.name || 'Unknown',
      address: businessData.address || undefined,
      latitude: businessData.latitude || undefined,
      longitude: businessData.longitude || undefined,
      phone: phoneContact?.value || undefined,
      email: emailContact?.value || undefined,
      whatsapp: whatsappContact?.value || undefined,
      website: businessData.website || undefined,
      googlePlaceId: businessData.google_place_id || undefined,
      ownerId: businessData.owner_id || undefined,
      createdAt: businessData.created_at || new Date().toISOString(),
      updatedAt: businessData.updated_at || new Date().toISOString(),
      claimedAt: businessData.claimed ? businessData.created_at || undefined : undefined,
    };
  }

  static async searchBusinesses(params: BusinessSearchParams): Promise<BusinessSearchResponse> {
    const supabase = createClient();
    const {
      query,
      city,
      category,
      verified,
      page = 1,
      limit = 20,
    } = params;

    let queryBuilder = supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `);

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (verified !== undefined) {
      queryBuilder = queryBuilder.eq('verified', verified);
    }

    if (city) {
      queryBuilder = queryBuilder.eq('cities.name', city);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    queryBuilder = queryBuilder
      .range(from, to)
      .order('verified', { ascending: false })
      .order('created_at', { ascending: false });

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Error searching businesses:', error);
      throw new Error('Failed to search businesses');
    }

    // Transform the data
    const businesses = (data || []).map(business => 
      this.transformBusinessData(business as BusinessWithRelations)
    );

    // Get total count
    let totalCount = count || 0;
    if (count === null) {
      const { count: totalCountQuery } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });
      totalCount = totalCountQuery || 0;
    }

    return {
      items: businesses,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  static async getBusinessById(id: string): Promise<Business> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching business:', error);
      throw new Error('Business not found');
    }

    return this.transformBusinessData(data as BusinessWithRelations);
  }

  static async getBusinessBySlug(slug: string): Promise<Business> {
    console.log(`Attempting to resolve slug: ${slug}`);
    
    // First try to parse the slug
    const slugInfo = this.parseBusinessSlug(slug);
    if (!slugInfo) {
      console.log('Slug parsing failed, trying as ID');
      // If slug parsing fails, try to get business by ID (backward compatibility)
      return this.getBusinessById(slug);
    }

    console.log('Parsed slug info:', slugInfo);
    const supabase = createClient();

    // Strategy 1: Exact match with city (if city is provided)
    if (slugInfo.city) {
      console.log(`Trying exact match with city: ${slugInfo.city}`);
      
      let queryBuilder = supabase
        .from('businesses')
        .select(`
          *,
          cities (
            id,
            name,
            country
          ),
          contacts (
            id,
            type,
            value,
            verified,
            primary_contact
          )
        `)
        .ilike('name', `%${slugInfo.name}%`)
        .eq('cities.name', slugInfo.city);

      // Add verification filter if specified in slug
      if (slugInfo.verified !== undefined) {
        queryBuilder = queryBuilder.eq('verified', slugInfo.verified);
      }

      const { data, error } = await queryBuilder.limit(1).single();

      if (!error && data) {
        console.log('Found business with exact city match');
        return this.transformBusinessData(data as BusinessWithRelations);
      }

      console.log('Exact city match failed, trying fuzzy city match');
      
      // Strategy 2: Fuzzy city match
      let fuzzyQueryBuilder = supabase
        .from('businesses')
        .select(`
          *,
          cities (
            id,
            name,
            country
          ),
          contacts (
            id,
            type,
            value,
            verified,
            primary_contact
          )
        `)
        .ilike('name', `%${slugInfo.name}%`)
        .ilike('cities.name', `%${slugInfo.city}%`);

      if (slugInfo.verified !== undefined) {
        fuzzyQueryBuilder = fuzzyQueryBuilder.eq('verified', slugInfo.verified);
      }

      const fuzzyResult = await fuzzyQueryBuilder.limit(1).single();

      if (!fuzzyResult.error && fuzzyResult.data) {
        console.log('Found business with fuzzy city match');
        return this.transformBusinessData(fuzzyResult.data as BusinessWithRelations);
      }
    }

    // Strategy 3: Name-only match (ignore city)
    console.log('Trying name-only match');
    
    let nameOnlyQueryBuilder = supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .ilike('name', `%${slugInfo.name}%`);

    if (slugInfo.verified !== undefined) {
      nameOnlyQueryBuilder = nameOnlyQueryBuilder.eq('verified', slugInfo.verified);
    }

    const nameOnlyResult = await nameOnlyQueryBuilder.limit(1).single();

    if (!nameOnlyResult.error && nameOnlyResult.data) {
      console.log('Found business with name-only match');
      return this.transformBusinessData(nameOnlyResult.data as BusinessWithRelations);
    }

    // Strategy 4: Broader name search without verification filter
    console.log('Trying broader name search without verification filter');
    
    const broadResult = await supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .ilike('name', `%${slugInfo.name}%`)
      .limit(1)
      .single();

    if (!broadResult.error && broadResult.data) {
      console.log('Found business with broad name search');
      return this.transformBusinessData(broadResult.data as BusinessWithRelations);
    }

    // Strategy 5: Fallback to ID-based lookup for backward compatibility
    console.log('All strategies failed, trying ID-based lookup');
    try {
      return this.getBusinessById(slug);
    } catch (idError) {
      console.error('ID-based lookup also failed:', idError);
    }

    console.error('All lookup strategies failed for slug:', slug);
    throw new Error('Business not found');
  }

  static async getBusinessesByCity(city: string): Promise<Business[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        cities!inner (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .eq('cities.name', city)
      .order('verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching businesses by city:', error);
      throw new Error('Failed to fetch businesses');
    }

    return (data || []).map(business => 
      this.transformBusinessData(business as BusinessWithRelations)
    );
  }

  static async getVerifiedBusinesses(): Promise<Business[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .eq('verified', true)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching verified businesses:', error);
      throw new Error('Failed to fetch verified businesses');
    }

    return (data || []).map(business => 
      this.transformBusinessData(business as BusinessWithRelations)
    );
  }

  // Get most viewed businesses from the analytics function
  static async getMostViewedBusinesses(limit: number = 6, daysBack: number = 30): Promise<Business[]> {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .rpc('get_most_viewed_businesses', {
          limit_count: limit,
          days_back: daysBack
        });

      if (error) {
        console.error('Error fetching most viewed businesses:', error);
        return [];
      }

      if (!data || data.length === 0) {
        // Fallback to recent verified businesses if no views data
        return this.getFallbackBusinesses(limit);
      }

      // Transform the data to Business format
      const businesses = await Promise.all(
        data.map(async (item: any) => {
          try {
            // Get full business data with contacts
            const fullBusiness = await this.getBusinessById(item.business_id);
            return {
              ...fullBusiness,
              // Add view analytics data
              viewCount: item.view_count,
              latestView: item.latest_view
            };
          } catch (error) {
            console.warn(`Failed to get full data for business ${item.business_id}:`, error);
            // Return minimal business data if full fetch fails
            return {
              id: item.business_id,
              name: item.name,
              category: item.category as BusinessCategory,
              city: item.city_name || 'Unknown',
              verified: item.verified,
              active: true,
              description: item.description || undefined,
              address: item.address || undefined,
              latitude: undefined,
              longitude: undefined,
              phone: undefined,
              email: undefined,
              whatsapp: undefined,
              website: undefined,
              googlePlaceId: undefined,
              ownerId: undefined,
              createdAt: new Date().toISOString(),
              updatedAt: item.latest_view,
              claimedAt: undefined
            };
          }
        })
      );

      return businesses.filter(Boolean); // Remove any null/undefined entries
    } catch (error) {
      console.error('Error in getMostViewedBusinesses:', error);
      return this.getFallbackBusinesses(limit);
    }
  }

  // Fallback method when no view data is available
  private static async getFallbackBusinesses(limit: number): Promise<Business[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        cities (
          id,
          name,
          country
        ),
        contacts (
          id,
          type,
          value,
          verified,
          primary_contact
        )
      `)
      .eq('verified', true) // Only verified businesses
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching fallback businesses:', error);
      return [];
    }

    return (data || []).map(business => 
      this.transformBusinessData(business as BusinessWithRelations)
    );
  }

  // Note: These methods are kept for compatibility but may not be needed
  // with direct Supabase integration
  static async validateContact(businessId: string, validation: any): Promise<void> {
    // This would require implementing validation logic directly with Supabase
    // For now, we'll just log it
    console.log('Validation feature not implemented in Supabase service:', businessId, validation);
  }

  static async claimBusiness(businessId: string): Promise<Business> {
    // This would require implementing business claiming logic
    // For now, we'll just return the business
    console.log('Claiming feature not implemented in Supabase service:', businessId);
    return this.getBusinessById(businessId);
  }
}

export default SupabaseBusinessService;