'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, Eye, Loader2, MapPin, TrendingUp } from 'lucide-react';
import SupabaseBusinessService from '@/services/business.service.supabase';
import { Business as BusinessType } from '@contactos-turisticos/types';

interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  verified: boolean;
  description?: string;
  address?: string;
  viewCount?: number;
}

interface PopularBusinessesProps {
  limit?: number;
  daysBack?: number;
  showTitle?: boolean;
  className?: string;
}

export function PopularBusinesses({ 
  limit = 6, 
  daysBack = 30, 
  showTitle = true,
  className = '' 
}: PopularBusinessesProps) {
  const router = useRouter();
  const locale = useLocale();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMostViewed();
  }, [limit, daysBack]);

  const loadMostViewed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await SupabaseBusinessService.getMostViewedBusinesses(limit, daysBack);
      setBusinesses(data);
    } catch (err) {
      console.error('Error loading most viewed businesses:', err);
      setError('Failed to load popular businesses');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      HOTEL: 'bg-blue-100 text-blue-800',
      TOUR: 'bg-green-100 text-green-800',
      TRANSPORT: 'bg-purple-100 text-purple-800',
      RESTAURANT: 'bg-orange-100 text-orange-800',
      ATTRACTION: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.OTHER;
  };

  const handleBusinessClick = (business: Business) => {
    const slug = SupabaseBusinessService.generateBusinessSlug(business as BusinessType, locale);
    router.push(`/${locale}/business/${slug}`);
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Negocios Populares</h2>
          </div>
        )}
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Cargando negocios populares...</span>
        </div>
      </div>
    );
  }

  if (error || businesses.length === 0) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Negocios Destacados</h2>
          </div>
        )}
        <div className="text-center p-8">
          <p className="text-gray-500">
            {error || 'No hay datos de popularidad disponibles aún.'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Los negocios aparecerán aquí cuando reciban más visitas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Negocios Más Visitados</h2>
          <span className="text-sm text-gray-500">({daysBack} días)</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business, index) => (
          <div
            key={business.id}
            onClick={() => handleBusinessClick(business)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200 hover:border-blue-300"
          >
            {/* Header with ranking */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                  {index + 1}
                </div>
                {business.verified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              {business.viewCount && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>{business.viewCount}</span>
                </div>
              )}
            </div>

            {/* Business name and category */}
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                {business.name}
              </h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
                {business.category}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span>{business.city}</span>
            </div>

            {/* Description (truncated) */}
            {business.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {business.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {businesses.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/search')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos los negocios →
          </button>
        </div>
      )}
    </div>
  );
}