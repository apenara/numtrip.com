import { createClient } from '@/lib/supabase';
import { Business, BusinessCategory, BusinessSearchParams, BusinessSearchResponse } from '@/types/business';
import { Database } from '@/types/database';
import { generateBusinessSlug } from '@/lib/utils';

type BusinessRow = Database['public']['Tables']['businesses']['Row'];
type ContactRow = Database['public']['Tables']['contacts']['Row'];
type CityRow = Database['public']['Tables']['cities']['Row'];

interface BusinessWithRelations extends BusinessRow {
  cities: CityRow | null;
  contacts: ContactRow[];
}

export class BusinessService {

  /**
   * Generates SEO-friendly slug for business
   * Uses the shared utility function
   */
  static generateBusinessSlug(business: Business, locale: string = 'es'): string {
    return generateBusinessSlug(business, locale);
  }

  /**
   * Parses business slug to extract search criteria
   * Supports both Spanish and English formats, with optional city
   */
  private static parseBusinessSlug(slug: string): { name: string; city?: string; verified?: boolean } | null {
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
      const lastTwoParts = parts.slice(-2).join('-');
      if (lastTwoParts === 'no-verificado') {
        verified = false;
        nameEnd = parts.length - 2;
      } else if (parts[parts.length - 1] === 'verificado') {
        verified = true;
        nameEnd = parts.length - 1;
      }
    } else {
      const lastTwoParts = parts.slice(-2).join('-');
      if (lastTwoParts === 'not-verified') {
        verified = false;
        nameEnd = parts.length - 2;
      } else if (parts[parts.length - 1] === 'verified') {
        verified = true;
        nameEnd = parts.length - 1;
      }
    }

    // Known cities for pattern detection
    const knownCities = ['cartagena', 'bogota', 'medellin', 'barranquilla', 'cali', 'bucaramanga'];
    const knownCountries = ['colombia', 'mexico', 'peru', 'ecuador', 'panama'];

    // Look for city patterns
    if (nameEnd >= 2) {
      const possibleCountry = parts[nameEnd - 1];
      const possibleCity = parts[nameEnd - 2];

      if (knownCountries.includes(possibleCountry.toLowerCase()) &&
          knownCities.includes(possibleCity.toLowerCase())) {
        city = possibleCity;
        const name = parts.slice(0, nameEnd - 2).join(' ');
        return { name, city, verified };
      }

      if (knownCities.includes(parts[nameEnd - 1].toLowerCase())) {
        city = parts[nameEnd - 1];
        const name = parts.slice(0, nameEnd - 1).join(' ');
        return { name, city, verified };
      }
    }

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

    return {
      items: businesses,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
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
      return this.getBusinessById(slug);
    }

    console.log('Parsed slug info:', slugInfo);
    const supabase = createClient();

    // Strategy: Search by name and city if available
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
      .ilike('name', `%${slugInfo.name}%`);

    if (slugInfo.city) {
      queryBuilder = queryBuilder.eq('cities.name', slugInfo.city);
    }

    if (slugInfo.verified !== undefined) {
      queryBuilder = queryBuilder.eq('verified', slugInfo.verified);
    }

    const { data, error } = await queryBuilder.limit(1).single();

    if (error || !data) {
      console.error('Error finding business by slug:', error);
      throw new Error('Business not found');
    }

    return this.transformBusinessData(data as BusinessWithRelations);
  }

  static async getMostViewedBusinesses(limit: number = 6, daysBack: number = 30): Promise<Business[]> {
    const supabase = createClient();
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysBack);

    // First get the business IDs from the view stats
    const { data: viewStats, error: viewError } = await supabase
      .from('business_view_stats')
      .select('business_id, total_views, last_viewed_at')
      .gte('last_viewed_at', dateThreshold.toISOString())
      .order('total_views', { ascending: false })
      .limit(limit);

    if (viewError) {
      console.error('Error fetching view stats:', viewError);
      return [];
    }

    if (!viewStats || viewStats.length === 0) {
      // Fallback: get recent businesses if no view stats
      return this.searchBusinesses({ limit, page: 1 }).then(result => result.items);
    }

    // Get the full business data for these business IDs
    const businessIds = viewStats.map(stat => stat.business_id).filter(id => id !== null);

    const { data: businesses, error: businessError } = await supabase
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
      .in('id', businessIds);

    if (businessError) {
      console.error('Error fetching businesses:', businessError);
      return [];
    }

    // Transform and sort by view count
    const transformedBusinesses = (businesses || []).map(business => {
      const stats = viewStats.find(stat => stat.business_id === business.id);
      const transformed = this.transformBusinessData(business as BusinessWithRelations);
      return {
        ...transformed,
        viewCount: stats?.total_views || 0
      };
    });

    // Sort by view count (highest first)
    return transformedBusinesses.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }

  static async incrementBusinessViews(businessId: string, metadata?: {
    userAgent?: string;
    referrer?: string;
    viewerIp?: string;
  }): Promise<void> {
    const supabase = createClient();

    // Record the view
    await supabase
      .from('business_views')
      .insert({
        business_id: businessId,
        viewer_ip: metadata?.viewerIp,
        user_agent: metadata?.userAgent,
        referrer: metadata?.referrer,
        viewed_at: new Date().toISOString(),
      });
  }
}