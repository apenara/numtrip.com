import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SupabaseBusinessService from '@/services/business.service.supabase';
import { Business, BusinessSearchParams } from '@contactos-turisticos/types';

// Query keys
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (params: BusinessSearchParams) => [...businessKeys.lists(), params] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
  byCity: (city: string) => [...businessKeys.all, 'city', city] as const,
  verified: () => [...businessKeys.all, 'verified'] as const,
};

// Hooks
export const useBusinessSearch = (params: BusinessSearchParams) => {
  return useQuery({
    queryKey: businessKeys.list(params),
    queryFn: () => SupabaseBusinessService.searchBusinesses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBusiness = (id: string) => {
  return useQuery({
    queryKey: businessKeys.detail(id),
    queryFn: () => SupabaseBusinessService.getBusinessById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useBusinessesByCity = (city: string) => {
  return useQuery({
    queryKey: businessKeys.byCity(city),
    queryFn: () => SupabaseBusinessService.getBusinessesByCity(city),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!city,
  });
};

export const useVerifiedBusinesses = () => {
  return useQuery({
    queryKey: businessKeys.verified(),
    queryFn: () => SupabaseBusinessService.getVerifiedBusinesses(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

export const useValidateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ businessId, validation }: { businessId: string; validation: any }) =>
      SupabaseBusinessService.validateContact(businessId, validation),
    onSuccess: (_, { businessId }) => {
      // Invalidate and refetch business details
      queryClient.invalidateQueries({ queryKey: businessKeys.detail(businessId) });
    },
    onError: (error) => {
      console.error('Failed to validate contact:', error);
    },
  });
};

export const useClaimBusiness = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (businessId: string) => SupabaseBusinessService.claimBusiness(businessId),
    onSuccess: (data) => {
      // Update cache with new data
      queryClient.setQueryData(businessKeys.detail(data.id), data);
      // Invalidate lists that might contain this business
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to claim business:', error);
    },
  });
};