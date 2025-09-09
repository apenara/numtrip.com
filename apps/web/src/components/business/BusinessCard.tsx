'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  MapPin, 
  CheckCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  Star,
  ThumbsUp,
  Shield
} from 'lucide-react';
import { ClaimButton } from './ClaimButton';
import SupabaseBusinessService from '@/services/business.service.supabase';
import { Business as BusinessType } from '@contactos-turisticos/types';

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
  website?: string;
  ownerId?: string;
  _count?: {
    validations: number;
  };
  validations?: Array<{
    isCorrect: boolean;
  }>;
}

interface BusinessCardProps {
  business: Business;
  showDistance?: boolean;
  compact?: boolean;
  className?: string;
}

export function BusinessCard({ 
  business, 
  showDistance = false, 
  compact = false, 
  className = '' 
}: BusinessCardProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a[href]')) {
      return;
    }
    // Generate SEO-friendly slug and navigate
    const slug = SupabaseBusinessService.generateBusinessSlug(business as BusinessType, locale);
    router.push(`/${locale}/business/${slug}`);
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

  // Calculate positive validation ratio
  const getValidationRatio = () => {
    if (!business.validations || business.validations.length === 0) {
      return null;
    }
    const positive = business.validations.filter(v => v.isCorrect).length;
    return Math.round((positive / business.validations.length) * 100);
  };

  const validationRatio = getValidationRatio();

  if (compact) {
    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer p-4 ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {business.name}
              </h3>
              {business.verified && (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              )}
              {business.ownerId && (
                <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
                {getCategoryLabel(business.category)}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {business.city}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {business.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="sr-only">Phone available</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="sr-only">Email available</span>
                </div>
              )}
              {business.whatsapp && (
                <div className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span className="sr-only">WhatsApp available</span>
                </div>
              )}
            </div>
          </div>

          {validationRatio !== null && (
            <div className="flex items-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{validationRatio}%</span>
            </div>
          )}
        </div>

        {/* Claim prompt for non-owned businesses */}
        {!business.ownerId && !business.verified && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">¿Es tu negocio?</p>
                <p className="text-xs text-gray-500">Reclámalo gratis</p>
              </div>
              <ClaimButton
                businessId={business.id}
                businessName={business.name}
                isOwned={!!business.ownerId}
                className="text-xs px-2 py-1 h-7"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {/* Placeholder for business image */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">
              {business.category === 'HOTEL' && '🏨'}
              {business.category === 'TOUR' && '🗺️'}
              {business.category === 'TRANSPORT' && '🚗'}
              {business.category === 'RESTAURANT' && '🍽️'}
              {business.category === 'ATTRACTION' && '🎯'}
              {business.category === 'OTHER' && '📍'}
            </div>
          </div>
        </div>
        
        {business.verified && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-1">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        )}

        {business.ownerId && (
          <div className="absolute top-3 right-12 bg-white rounded-full p-1">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
        )}

        {validationRatio !== null && (
          <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">{validationRatio}%</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
              {business.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(business.category)}`}>
                {getCategoryLabel(business.category)}
              </span>
            </div>
          </div>
        </div>

        {business.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {business.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{business.city}</span>
            {business.address && (
              <span className="ml-1 truncate max-w-[150px]">• {business.address}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {business.phone && (
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4" />
              </div>
            )}
            {business.email && (
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
            )}
            {business.whatsapp && (
              <div className="flex items-center text-gray-400">
                <MessageCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>

        {/* Claim section for non-owned businesses */}
        {!business.ownerId && !business.verified && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">¿Es tu negocio?</p>
                <p className="text-xs text-gray-500">Reclámalo gratis y obtén beneficios exclusivos</p>
              </div>
              <ClaimButton
                businessId={business.id}
                businessName={business.name}
                isOwned={!!business.ownerId}
                className="text-sm px-3 py-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}