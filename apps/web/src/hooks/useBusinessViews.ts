import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import businessViewsService, { MostViewedBusiness } from '@/services/businessViews.service';

/**
 * Hook to track business profile views
 * Automatically records a view when called with a business ID
 */
export function useBusinessView(businessId?: string) {
  const recordView = useCallback(async (id: string) => {
    if (!id) return false;
    
    try {
      const success = await businessViewsService.recordView(id);
      if (success) {
        console.debug(`Successfully recorded view for business ${id}`);
      } else {
        console.debug(`View recording was rate-limited for business ${id}`);
      }
      return success;
    } catch (error) {
      console.warn('Failed to record business view:', error);
      return false;
    }
  }, []);

  // Auto-record view when businessId changes
  useEffect(() => {
    if (businessId) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        recordView(businessId);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [businessId, recordView]);

  return {
    recordView
  };
}

/**
 * Hook to get most viewed businesses
 */
export function useMostViewedBusinesses(options: {
  limit?: number;
  daysBack?: number;
  enabled?: boolean;
} = {}) {
  const { limit = 10, daysBack = 30, enabled = true } = options;

  return useQuery({
    queryKey: ['most-viewed-businesses', limit, daysBack],
    queryFn: () => businessViewsService.getMostViewed(limit, daysBack),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * Hook to get view statistics for a specific business
 */
export function useBusinessStats(businessId?: string) {
  return useQuery({
    queryKey: ['business-stats', businessId],
    queryFn: () => businessId ? businessViewsService.getBusinessStats(businessId) : null,
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform most viewed business data to match the existing Business interface
 */
export function transformMostViewedToBusiness(mostViewed: MostViewedBusiness[]) {
  return mostViewed.map(item => ({
    id: item.business_id,
    name: item.name,
    category: item.category,
    city: item.city_name || 'Unknown',
    verified: item.verified,
    description: item.description,
    address: item.address,
    active: true,
    // These fields might not be available from the view function
    // They could be fetched separately if needed for the component
    phone: null,
    email: null,
    whatsapp: null,
    website: null,
    googlePlaceId: null,
    ownerId: null,
    createdAt: new Date().toISOString(),
    updatedAt: item.latest_view,
    claimedAt: null,
    // Additional fields for analytics
    viewCount: item.view_count,
    latestView: item.latest_view
  }));
}