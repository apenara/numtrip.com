'use client';

import { useState } from 'react';
import { useBusinessView } from '@/hooks/useBusinessViews';
import { Header } from '@/components/layout/Header';
import { Breadcrumbs, generateBusinessBreadcrumbs } from '@/components/layout/Breadcrumbs';
import { SimilarBusinesses } from '@/components/business/SimilarBusinesses';
import { ValidationButtons } from '@/components/validation/ValidationButtons';
import { ValidationStats } from '@/components/validation/ValidationStats';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { AdInContent } from '@/components/ads/AdInContent';
import { ClaimButton } from '@/components/business/ClaimButton';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Globe, 
  MapPin, 
  CheckCircle,
  Copy,
  ExternalLink,
  Tag,
  Shield
} from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description?: string;
  category: string;
  verified: boolean;
  active: boolean;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  validations?: any[];
  promoCodes?: any[];
}

interface BusinessDetailClientProps {
  business: Business;
  translations: any;
}

export function BusinessDetailClient({ business, translations: t }: BusinessDetailClientProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Track business page view
  useBusinessView(business.id);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const breadcrumbs = generateBusinessBreadcrumbs({
    name: business.name,
    category: business.category,
    city: business.city,
    id: business.id
  });

  return (
    <>
      <Header showBackButton={true} title={business.name} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Top Banner Ad - Only for non-verified businesses */}
        {!business.verified && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <AdBanner 
              slot="top-banner"
              className="w-full"
              format="horizontal"
              style={{ minHeight: '90px' }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Número de contacto {business.name}</h1>
                {business.verified && (
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-800">Verified</span>
                  </div>
                )}
                {business.ownerId && (
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-800">Owner Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
                  {business.category}
                </span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {business.city}
                </div>
                {business.address && (
                  <div className="flex items-center">
                    <span>{business.address}</span>
                  </div>
                )}
              </div>

              {/* Community Validation Stats */}
              <div className="mb-4">
                <ValidationStats 
                  businessId={business.id} 
                  layout="horizontal"
                />
              </div>

              {business.description && (
                <p className="text-gray-600">{business.description}</p>
              )}
            </div>

            {/* Claim Button - Show only for non-owned businesses */}
            {!business.ownerId && (
              <div className="flex-shrink-0 ml-4">
                <ClaimButton
                  businessId={business.id}
                  businessName={business.name}
                  isOwned={!!business.ownerId}
                  onClaimSuccess={() => {
                    // Optional: Could trigger a page refresh or show success message
                    window.location.reload();
                  }}
                  className="shadow-md"
                />
              </div>
            )}
          </div>

          {/* Business Claim Notice for unverified businesses */}
          {!business.verified && !business.ownerId && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    ¿Es tu negocio?
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Reclama la propiedad para obtener un perfil verificado sin anuncios, panel de administración y más beneficios.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-blue-600">
                    <span>✓ Sin anuncios</span>
                    <span>✓ Panel de control</span>
                    <span>✓ Códigos promocionales</span>
                    <span>✓ Estadísticas detalladas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Número de contacto y información de {business.name}</h2>
          
          <div className="space-y-4">
            {/* Phone */}
            {business.phone && (
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{business.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(business.phone!, 'phone')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <a
                      href={`tel:${business.phone}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </div>
                
                {/* Community Validation */}
                <div className="mt-3 pt-3 border-t">
                  <ValidationButtons
                    businessId={business.id}
                    contactType="phone"
                    contactValue={business.phone}
                    size="sm"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            {business.email && (
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{business.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(business.email!, 'email')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'email' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <a
                      href={`mailto:${business.email}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </div>
                
                {/* Community Validation */}
                <div className="mt-3 pt-3 border-t">
                  <ValidationButtons
                    businessId={business.id}
                    contactType="email"
                    contactValue={business.email}
                    size="sm"
                  />
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {business.whatsapp && (
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-medium text-gray-900">{business.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(business.whatsapp!, 'whatsapp')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'whatsapp' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </div>
                
                {/* Community Validation */}
                <div className="mt-3 pt-3 border-t">
                  <ValidationButtons
                    businessId={business.id}
                    contactType="whatsapp"
                    contactValue={business.whatsapp}
                    size="sm"
                  />
                </div>
              </div>
            )}

            {/* Website */}
            {business.website && (
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="font-medium text-gray-900">{business.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(business.website!, 'website')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'website' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            )}
            </div>
            </div>

            {/* In-content Ad - Only for non-verified businesses */}
            {!business.verified && (
              <AdInContent 
                slot="in-content"
                format="rectangle"
                className="my-6"
              />
            )}

            {/* Promo Codes */}
            {business.promoCodes && business.promoCodes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Promo Codes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.promoCodes.map((promo: any) => (
                <div key={promo.id} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-lg text-gray-900">{promo.code}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{promo.description}</p>
                      <p className="text-sm font-medium text-blue-600">{promo.discount}</p>
                      {promo.validUntil && (
                        <p className="text-xs text-gray-500 mt-2">
                          Valid until: {new Date(promo.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(promo.code, `promo-${promo.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === `promo-${promo.id}` ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}

            {/* Similar Businesses */}
            <SimilarBusinesses currentBusiness={business} />
            
            </div>
            
            {/* Sidebar - Only for non-verified businesses */}
            {!business.verified && (
              <AdSidebar 
                slot="sidebar"
                className="flex-shrink-0"
                sticky={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}