'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CheckCircle, Eye, Loader2, MapPin, TrendingUp, Shield } from 'lucide-react';
import { BusinessService } from '@/lib/business.service';
import { Business } from '@/types/business';
import { cn } from '@/lib/utils';

interface PopularBusinessesProps {
  limit?: number;
  daysBack?: number;
  showTitle?: boolean;
  className?: string;
  variant?: 'grid' | 'compact';
}

export function PopularBusinesses({
  limit = 6,
  daysBack = 30,
  showTitle = true,
  className = '',
  variant = 'grid'
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

      const data = await BusinessService.getMostViewedBusinesses(limit, daysBack);
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
      HOTEL: 'bg-blue-100 text-blue-800 border-blue-200',
      TOUR: 'bg-green-100 text-green-800 border-green-200',
      TRANSPORT: 'bg-purple-100 text-purple-800 border-purple-200',
      RESTAURANT: 'bg-orange-100 text-orange-800 border-orange-200',
      ATTRACTION: 'bg-pink-100 text-pink-800 border-pink-200',
      OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || colors.OTHER;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      HOTEL: 'Hotel',
      TOUR: 'Tour',
      TRANSPORT: 'Transporte',
      RESTAURANT: 'Restaurante',
      ATTRACTION: 'Atracción',
      OTHER: 'Otro',
    };
    return labels[category] || category;
  };

  const handleBusinessClick = (business: Business) => {
    const slug = BusinessService.generateBusinessSlug(business, locale);
    router.push(`/${locale}/business/${slug}`);
  };

  if (loading) {
    return (
      <div className={cn(className)}>
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
      <div className={cn(className)}>
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

  if (variant === 'compact') {
    return (
      <div className={cn(className)}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Más Visitados</h3>
            <span className="text-xs text-gray-500">({daysBack}d)</span>
          </div>
        )}

        <div className="space-y-3">
          {businesses.map((business, index) => (
            <div
              key={business.id}
              onClick={() => handleBusinessClick(business)}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {business.name}
                  </h4>
                  {business.verified && (
                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                  )}
                  {business.ownerId && (
                    <Shield className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                    getCategoryColor(business.category)
                  )}>
                    {getCategoryLabel(business.category)}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {business.city}
                  </div>
                </div>
              </div>

              {business.viewCount && (
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <Eye className="h-3 w-3" />
                  <span>{business.viewCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Negocios Más Visitados</h2>
          <span className="text-sm text-gray-500">({daysBack} días)</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business, index) => (
          <article
            key={business.id}
            onClick={() => handleBusinessClick(business)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 p-4 cursor-pointer"
          >
            {/* Header with ranking */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex items-center gap-1">
                  {business.verified && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {business.ownerId && (
                    <Shield className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
              {business.viewCount && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
                  <Eye className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600 font-medium">{business.viewCount}</span>
                </div>
              )}
            </div>

            {/* Business name and category */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 line-clamp-1">
                {business.name}
              </h3>
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-sm font-medium border",
                getCategoryColor(business.category)
              )}>
                {getCategoryLabel(business.category)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{business.city}</span>
              {business.address && (
                <span className="ml-1 truncate max-w-[120px]">• {business.address}</span>
              )}
            </div>

            {/* Description (truncated) */}
            {business.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {business.description}
              </p>
            )}

            {/* Validation Score */}
            {business.validationRatio !== undefined && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span className="font-medium">{business.validationRatio}% validado</span>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {businesses.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => router.push(`/${locale}/search`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
          >
            Ver todos los negocios
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}