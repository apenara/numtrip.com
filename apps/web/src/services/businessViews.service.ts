import { createClient } from '@/lib/supabase';

export interface BusinessViewsService {
  recordView: (businessId: string) => Promise<boolean>;
  getMostViewed: (limit?: number, daysBack?: number) => Promise<MostViewedBusiness[]>;
}

export interface MostViewedBusiness {
  business_id: string;
  view_count: number;
  name: string;
  category: string;
  city_name: string;
  verified: boolean;
  description?: string;
  address?: string;
  latest_view: string;
}

class SupabaseBusinessViewsService implements BusinessViewsService {
  private supabase = createClient();

  /**
   * Record a view for a business profile
   * Automatically handles rate limiting (1 view per IP per hour per business)
   */
  async recordView(businessId: string): Promise<boolean> {
    try {
      // Get client IP (this works in browser context)
      const ipResponse = await fetch('/api/get-client-ip', { 
        method: 'GET',
        cache: 'no-store'
      });
      
      let clientIP = '127.0.0.1'; // fallback
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        clientIP = ipData.ip || clientIP;
      }

      // Get user agent
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      const referrer = typeof window !== 'undefined' ? document.referrer : '';

      // Call the Supabase function to record view
      const { data, error } = await this.supabase
        .rpc('record_business_view', {
          p_business_id: businessId,
          p_viewer_ip: clientIP,
          p_user_agent: userAgent,
          p_referrer: referrer
        });

      if (error) {
        console.warn('Failed to record business view:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.warn('Error recording business view:', error);
      return false;
    }
  }

  /**
   * Get most viewed businesses
   * @param limit Number of businesses to return (default: 10)
   * @param daysBack Number of days to look back (default: 30)
   */
  async getMostViewed(limit: number = 10, daysBack: number = 30): Promise<MostViewedBusiness[]> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_most_viewed_businesses', {
          limit_count: limit,
          days_back: daysBack
        });

      if (error) {
        console.error('Failed to get most viewed businesses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting most viewed businesses:', error);
      return [];
    }
  }

  /**
   * Get view stats for a specific business
   */
  async getBusinessStats(businessId: string) {
    try {
      const { data, error } = await this.supabase
        .from('business_view_stats')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Failed to get business stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting business stats:', error);
      return null;
    }
  }
}

// Create and export the service instance
export const businessViewsService = new SupabaseBusinessViewsService();
export default businessViewsService;