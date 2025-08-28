import apiClient from '@/lib/api-client';
import { Business, BusinessSearchParams, BusinessSearchResponse, ValidationRequest } from '@contactos-turisticos/types';

export class BusinessService {
  static async searchBusinesses(params: BusinessSearchParams): Promise<BusinessSearchResponse> {
    const { data } = await apiClient.get('/businesses', { params });
    // Map API response to expected format
    return {
      items: data.data || [],
      total: data.pagination?.total || 0,
      page: data.pagination?.page || 1,
      limit: data.pagination?.limit || 20,
      totalPages: data.pagination?.pages || 1
    };
  }

  static async getBusinessById(id: string): Promise<Business> {
    const { data } = await apiClient.get(`/businesses/${id}`);
    return data;
  }

  static async validateContact(businessId: string, validation: ValidationRequest): Promise<void> {
    await apiClient.post(`/businesses/${businessId}/validate`, validation);
  }

  static async claimBusiness(businessId: string): Promise<Business> {
    const { data } = await apiClient.post(`/businesses/${businessId}/claim`);
    return data;
  }

  static async getBusinessesByCity(city: string): Promise<Business[]> {
    const { data } = await apiClient.get('/businesses', {
      params: { city, limit: 100 }
    });
    return data.items || [];
  }

  static async getVerifiedBusinesses(): Promise<Business[]> {
    const { data } = await apiClient.get('/businesses', {
      params: { verified: true, limit: 100 }
    });
    return data.items || [];
  }
}

export default BusinessService;