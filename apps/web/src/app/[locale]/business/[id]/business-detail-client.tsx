'use client';

import { useState } from 'react';
import { useValidateContact } from '@/hooks/useBusinesses';
import { Header } from '@/components/layout/Header';
import { Breadcrumbs, generateBusinessBreadcrumbs } from '@/components/layout/Breadcrumbs';
import { SimilarBusinesses } from '@/components/business/SimilarBusinesses';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { AdInContent } from '@/components/ads/AdInContent';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Globe, 
  MapPin, 
  CheckCircle,
  Copy,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  Tag
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
  const [validationFeedback, setValidationFeedback] = useState<Record<string, boolean>>({});
  const validateContactMutation = useValidateContact();

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleValidation = (field: string, isCorrect: boolean) => {
    setValidationFeedback({ ...validationFeedback, [field]: isCorrect });
    
    // Map field to validation type
    const typeMap: Record<string, string> = {
      phone: isCorrect ? 'PHONE_WORKS' : 'PHONE_INCORRECT',
      email: isCorrect ? 'EMAIL_WORKS' : 'EMAIL_INCORRECT',
      whatsapp: isCorrect ? 'WHATSAPP_WORKS' : 'WHATSAPP_INCORRECT',
    };

    if (typeMap[field]) {
      validateContactMutation.mutate({
        businessId: business.id,
        validation: {
          type: typeMap[field],
          isCorrect,
        },
      });
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
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                {business.verified && (
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-800">Verified</span>
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

              {business.description && (
                <p className="text-gray-600">{business.description}</p>
              )}
            </div>
          </div>
        </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          
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
                
                {/* Validation buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-500">Does this number work?</span>
                  <button
                    onClick={() => handleValidation('phone', true)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.phone === true 
                        ? 'bg-green-100 text-green-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => handleValidation('phone', false)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.phone === false 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    No
                  </button>
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
                
                {/* Validation buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-500">Does this email work?</span>
                  <button
                    onClick={() => handleValidation('email', true)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.email === true 
                        ? 'bg-green-100 text-green-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => handleValidation('email', false)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.email === false 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    No
                  </button>
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
                
                {/* Validation buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <span className="text-sm text-gray-500">Does this WhatsApp work?</span>
                  <button
                    onClick={() => handleValidation('whatsapp', true)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.whatsapp === true 
                        ? 'bg-green-100 text-green-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => handleValidation('whatsapp', false)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      validationFeedback.whatsapp === false 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    No
                  </button>
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