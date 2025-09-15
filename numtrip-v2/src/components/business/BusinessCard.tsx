'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  CheckCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ThumbsUp,
  Star
} from 'lucide-react';
import { BusinessCardProps } from '@/types/business';
import { BusinessService } from '@/lib/business.service';
import { cn } from '@/lib/utils';
import { ContactButtons } from './ContactButtons';

export function BusinessCard({
  business,
  showDistance = false,
  compact = false,
  className = '',
  onClick
}: BusinessCardProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a[href]')) {
      return;
    }

    if (onClick) {
      onClick(business);
    } else {
      // Generate SEO-friendly slug and navigate
      const slug = BusinessService.generateBusinessSlug(business, locale);
      router.push(`/${locale}/business/${slug}`);
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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      HOTEL: '🏨',
      TOUR: '🗺️',
      TRANSPORT: '🚗',
      RESTAURANT: '🍽️',
      ATTRACTION: '🎯',
      OTHER: '📍',
    };
    return icons[category] || icons.OTHER;
  };

  if (compact) {
    return (
      <div
        className={cn(
          "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer p-4",
          className
        )}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
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
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium border",
                getCategoryColor(business.category)
              )}>
                {getCategoryLabel(business.category)}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {business.city}
              </div>
              {showDistance && business.distance && (
                <div className="text-sm text-gray-500">
                  • {business.distance.toFixed(1)} km
                </div>
              )}
            </div>

            <ContactButtons
              business={business}
              size="sm"
              variant="icon"
              className="gap-3"
            />
          </div>

          {business.validationRatio !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{business.validationRatio}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      {/* Business Image/Header */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">
              {getCategoryIcon(business.category)}
            </div>
            <div className="text-sm font-medium opacity-90">
              {getCategoryLabel(business.category)}
            </div>
          </div>
        </div>

        {/* Verification Badge */}
        {business.verified && (
          <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        )}

        {/* Claimed Badge */}
        {business.ownerId && (
          <div className="absolute top-3 right-14 bg-white rounded-full p-2 shadow-sm">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
        )}

        {/* Validation Score */}
        {business.validationRatio !== undefined && (
          <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
            <ThumbsUp className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">{business.validationRatio}%</span>
          </div>
        )}

        {/* View Count */}
        {business.viewCount && business.viewCount > 0 && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white rounded-full px-2 py-1 text-xs">
            {business.viewCount} vistas
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
              {business.name}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium border",
                getCategoryColor(business.category)
              )}>
                {getCategoryLabel(business.category)}
              </span>
            </div>
          </div>
        </div>

        {business.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {business.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{business.city}</span>
            {business.address && (
              <span className="ml-1 truncate max-w-[150px]">• {business.address}</span>
            )}
            {showDistance && business.distance && (
              <span className="ml-1">• {business.distance.toFixed(1)} km</span>
            )}
          </div>
        </div>

        {/* Contact Buttons */}
        <ContactButtons
          business={business}
          size="md"
          variant="button"
          className="gap-2"
        />

        {/* Claim section for non-owned businesses */}
        {!business.ownerId && !business.verified && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">¿Es tu negocio?</p>
                <p className="text-xs text-gray-500">Reclámalo gratis y obtén beneficios exclusivos</p>
              </div>
              <button className="text-sm px-3 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors">
                Reclamar
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}