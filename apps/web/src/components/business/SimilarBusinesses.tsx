'use client';

import { useBusinessesByCity } from '@/hooks/useBusinesses';
import { BusinessCard } from './BusinessCard';
import { Loader2 } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  verified: boolean;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  _count?: {
    validations: number;
  };
  validations?: Array<{
    isCorrect: boolean;
  }>;
}

interface SimilarBusinessesProps {
  currentBusiness: Business;
  maxResults?: number;
}

export function SimilarBusinesses({ 
  currentBusiness, 
  maxResults = 4 
}: SimilarBusinessesProps) {
  const { data: allBusinesses, isLoading, error } = useBusinessesByCity(currentBusiness.city);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Negocios Similares
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show section if there's an error
  }

  if (!allBusinesses || allBusinesses.length === 0) {
    return null;
  }

  // Filter and sort similar businesses
  const similarBusinesses = allBusinesses
    .filter(business => 
      business.id !== currentBusiness.id && // Exclude current business
      business.category === currentBusiness.category && // Same category
      business.active // Only active businesses
    )
    .sort((a, b) => {
      // Prioritize verified businesses
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      
      // Then by validation count (if available)
      const aValidations = a._count?.validations || 0;
      const bValidations = b._count?.validations || 0;
      if (aValidations !== bValidations) {
        return bValidations - aValidations;
      }
      
      // Finally by name
      return a.name.localeCompare(b.name);
    })
    .slice(0, maxResults);

  if (similarBusinesses.length === 0) {
    return null;
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      HOTEL: 'hoteles',
      TOUR: 'tours',
      TRANSPORT: 'servicios de transporte',
      RESTAURANT: 'restaurantes',
      ATTRACTION: 'atracciones',
      OTHER: 'negocios',
    };
    return labels[category] || 'negocios';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Otros {getCategoryLabel(currentBusiness.category)} en {currentBusiness.city}
        </h2>
        {similarBusinesses.length >= maxResults && (
          <button 
            onClick={() => window.open(`/search?city=${encodeURIComponent(currentBusiness.city)}&category=${currentBusiness.category}`, '_blank')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {similarBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            compact={true}
            className="hover:scale-[1.02] transition-transform"
          />
        ))}
      </div>

      {similarBusinesses.length < 2 && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            No hay suficientes {getCategoryLabel(currentBusiness.category)} similares en {currentBusiness.city} para mostrar.
          </p>
          <button
            onClick={() => window.open(`/search?category=${currentBusiness.category}`, '_blank')}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Buscar {getCategoryLabel(currentBusiness.category)} en otras ciudades
          </button>
        </div>
      )}
    </div>
  );
}