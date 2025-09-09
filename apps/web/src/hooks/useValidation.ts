import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

// Types
export interface ValidationDto {
  type: 'PHONE_WORKS' | 'PHONE_INCORRECT' | 'EMAIL_WORKS' | 'EMAIL_INCORRECT' | 'WHATSAPP_WORKS' | 'WHATSAPP_INCORRECT' | 'GENERAL_CORRECT' | 'GENERAL_INCORRECT';
  isCorrect: boolean;
  comment?: string;
}

export interface ValidationStats {
  businessId: string;
  totalValidations: number;
  positiveValidations: number;
  negativeValidations: number;
  validationPercentage: number;
  byType: {
    phone: { total: number; positive: number; negative: number; percentage: number };
    email: { total: number; positive: number; negative: number; percentage: number };
    whatsapp: { total: number; positive: number; negative: number; percentage: number };
    general: { total: number; positive: number; negative: number; percentage: number };
  };
  trustLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';
  lastValidation: Date | null;
}

export interface UserValidationStats {
  userId: string;
  totalValidations: number;
  helpfulValidations: number;
  reputationScore: number;
  userLevel: 'NOVATO' | 'EXPERTO' | 'SUPER_VALIDADOR';
  points: number;
  badges: string[];
}

interface ValidationHistory {
  data: Array<{
    id: string;
    type: string;
    isCorrect: boolean;
    comment?: string;
    createdAt: Date;
    user?: { id: string };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Functions
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const validationApi = {
  async validateBusiness(businessId: string, validationDto: ValidationDto) {
    const response = await fetch(`${API_BASE}/validations/${businessId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationDto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate business');
    }

    return response.json();
  },

  async reportBusiness(businessId: string, reportDto: { type: string; comment: string }) {
    const response = await fetch(`${API_BASE}/validations/${businessId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportDto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to report business');
    }

    return response.json();
  },

  async getValidationStats(businessId: string): Promise<ValidationStats> {
    const response = await fetch(`${API_BASE}/validations/${businessId}/stats`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch validation stats');
    }

    return response.json();
  },

  async getValidationHistory(businessId: string, params?: { page?: number; limit?: number; type?: string }): Promise<ValidationHistory> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.type) searchParams.set('type', params.type);

    const response = await fetch(`${API_BASE}/validations/${businessId}/history?${searchParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch validation history');
    }

    return response.json();
  },

  async getUserValidationStats(): Promise<UserValidationStats> {
    const response = await fetch(`${API_BASE}/validations/user/stats`, {
      headers: {
        // Include auth headers when implemented
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user stats');
    }

    return response.json();
  },
};

// Hooks
export function useValidateContact(businessId: string, contactType: string) {
  const queryClient = useQueryClient();
  const [lastValidation, setLastValidation] = useState<{ isCorrect: boolean; type: string } | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<Date | null>(null);

  // Check if user can validate (cooldown logic)
  const canValidate = !cooldownEnd || new Date() > cooldownEnd;
  const cooldownRemaining = cooldownEnd ? cooldownEnd.getTime() - Date.now() : 0;

  const { mutateAsync: validateContact, isPending: isValidating } = useMutation({
    mutationFn: (validationDto: ValidationDto) => validationApi.validateBusiness(businessId, validationDto),
    onSuccess: (data, variables) => {
      // Invalidate and refetch validation stats
      queryClient.invalidateQueries({ 
        queryKey: ['validationStats', businessId] 
      });
      
      // Set last validation and cooldown
      setLastValidation({ 
        isCorrect: variables.isCorrect, 
        type: variables.type 
      });
      
      // Set 24-hour cooldown
      const cooldownTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setCooldownEnd(cooldownTime);
      
      // Store in localStorage for persistence
      const cooldownKey = `validation_cooldown_${businessId}_${contactType}`;
      localStorage.setItem(cooldownKey, cooldownTime.toISOString());
    },
  });

  // Check localStorage for existing cooldown on mount
  useEffect(() => {
    const cooldownKey = `validation_cooldown_${businessId}_${contactType}`;
    const storedCooldown = localStorage.getItem(cooldownKey);
    
    if (storedCooldown) {
      const cooldownTime = new Date(storedCooldown);
      if (cooldownTime > new Date()) {
        setCooldownEnd(cooldownTime);
      } else {
        localStorage.removeItem(cooldownKey);
      }
    }
  }, [businessId, contactType]);

  return {
    validateContact,
    isValidating,
    lastValidation,
    canValidate,
    cooldownRemaining,
  };
}

export function useValidationStats(businessId: string) {
  return useQuery({
    queryKey: ['validationStats', businessId],
    queryFn: () => validationApi.getValidationStats(businessId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useValidationHistory(businessId: string, params?: { page?: number; limit?: number; type?: string }) {
  return useQuery({
    queryKey: ['validationHistory', businessId, params],
    queryFn: () => validationApi.getValidationHistory(businessId, params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUserValidationStats() {
  return useQuery({
    queryKey: ['userValidationStats'],
    queryFn: () => validationApi.getUserValidationStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useReportBusiness(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportDto: { type: string; comment: string }) => 
      validationApi.reportBusiness(businessId, reportDto),
    onSuccess: () => {
      // Invalidate validation stats
      queryClient.invalidateQueries({ 
        queryKey: ['validationStats', businessId] 
      });
    },
  });
}