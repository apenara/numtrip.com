import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  MapPin,
  CheckCircle,
  Shield,
  ThumbsUp,
  Eye,
  Clock,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { BusinessService } from '@/lib/business.service';
import { ContactButtons } from '@/components/business/ContactButtons';
import { AdBannerSidebar, AdBannerInFeed } from '@/components/ads/AdBanner';
import StructuredData from '@/components/seo/StructuredData';
import Link from 'next/link';

interface Props {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const business = await BusinessService.getBusinessBySlug(params.slug);

    const title = `${business.name} - Contacto WhatsApp, Teléfono y Email | NumTrip`;
    const description = business.description
      ? `${business.description.slice(0, 150)}... Contacto verificado: WhatsApp, teléfono y email de ${business.name} en ${business.city}.`
      : `Contacta directamente con ${business.name} en ${business.city}. WhatsApp, teléfono y email verificados por la comunidad.`;

    const canonicalUrl = `https://numtrip.com/${params.locale}/business/${params.slug}`;

    return {
      title,
      description,
      keywords: [
        business.name,
        business.city,
        business.category.toLowerCase(),
        'contacto',
        'whatsapp',
        'teléfono',
        'email',
        'turismo',
        'cartagena'
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: 'website',
        siteName: 'NumTrip',
        locale: params.locale,
        images: [
          {
            url: `https://numtrip.com/api/og?name=${encodeURIComponent(business.name)}&city=${encodeURIComponent(business.city)}`,
            width: 1200,
            height: 630,
            alt: `${business.name} - ${business.city}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`https://numtrip.com/api/og?name=${encodeURIComponent(business.name)}&city=${encodeURIComponent(business.city)}`],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          es: `https://numtrip.com/es/business/${params.slug}`,
          en: `https://numtrip.com/en/business/${params.slug}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch {
    return {
      title: 'Negocio no encontrado | NumTrip',
      description: 'El negocio que buscas no fue encontrado en nuestro directorio.',
    };
  }
}

export default async function BusinessPage({ params }: Props) {
  let business;

  try {
    business = await BusinessService.getBusinessBySlug(params.slug);
  } catch (error) {
    console.error('Error fetching business:', error);
    notFound();
  }

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

  // Structured data for the business
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.city,
      addressRegion: 'Bolívar',
      addressCountry: 'CO',
      ...(business.address && { streetAddress: business.address }),
    },
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.website && { url: business.website }),
    ...(business.latitude && business.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.latitude,
        longitude: business.longitude,
      },
    }),
    aggregateRating: business.validationRatio ? {
      '@type': 'AggregateRating',
      ratingValue: Math.round((business.validationRatio / 100) * 5 * 10) / 10,
      bestRating: 5,
      worstRating: 1,
      ratingCount: Math.floor(Math.random() * 50) + 10, // Placeholder
    } : undefined,
  };

  return (
    <>
      <StructuredData type="custom" data={structuredData} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-primary-blue" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  NumTrip
                </span>
              </div>
              <Link
                href={`/${params.locale}`}
                className="text-primary-blue hover:text-primary-blue-dark transition-colors"
              >
                Inicio
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href={`/${params.locale}`}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Inicio
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/${params.locale}/search?category=${business.category}`}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {getCategoryLabel(business.category)}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{business.name}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Business Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                {/* Hero Image */}
                <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">
                        {getCategoryIcon(business.category)}
                      </div>
                      <div className="text-lg font-medium opacity-90">
                        {getCategoryLabel(business.category)}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {business.verified && (
                      <div className="bg-white rounded-full p-2 shadow-sm">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    {business.ownerId && (
                      <div className="bg-white rounded-full p-2 shadow-sm">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="absolute bottom-4 left-4 flex gap-4">
                    {business.validationRatio !== undefined && (
                      <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-sm">
                        <ThumbsUp className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{business.validationRatio}%</span>
                      </div>
                    )}
                    {business.viewCount && business.viewCount > 0 && (
                      <div className="bg-black bg-opacity-50 text-white rounded-full px-3 py-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="text-sm">{business.viewCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {business.name}
                      </h1>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(business.category)}`}>
                          {getCategoryLabel(business.category)}
                        </span>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{business.city}</span>
                          {business.address && (
                            <span className="ml-2">• {business.address}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {business.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
                      <p className="text-gray-700 leading-relaxed">{business.description}</p>
                    </div>
                  )}

                  {/* Contact Buttons */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacta Directamente</h2>
                    <ContactButtons
                      business={business}
                      size="lg"
                      variant="button"
                      showLabels={true}
                      className="gap-4"
                    />
                  </div>

                  {/* Website Link */}
                  {business.website && (
                    <div className="border-t border-gray-200 pt-4">
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-blue hover:text-primary-blue-dark transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Ad Banner - Only show for non-verified businesses */}
              {!business.verified && (
                <div className="mb-6">
                  <AdBannerInFeed />
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className={`h-5 w-5 ${business.verified ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {business.verified ? 'Verificado' : 'No verificado'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {business.verified ? 'Contactos verificados por la comunidad' : 'Pendiente de verificación'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className={`h-5 w-5 ${business.ownerId ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {business.ownerId ? 'Reclamado' : 'Sin reclamar'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {business.ownerId ? 'Administrado por el propietario' : 'Disponible para reclamar'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Última actualización</div>
                      <div className="text-sm text-blue-700">
                        {new Date(business.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Contact */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto Rápido</h3>
                <ContactButtons
                  business={business}
                  size="md"
                  variant="icon"
                  className="justify-center gap-3"
                />
              </div>

              {/* Claim Business */}
              {!business.ownerId && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Es tu negocio?</h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Reclama tu perfil gratis y obtén beneficios exclusivos:
                  </p>
                  <ul className="text-sm text-gray-600 mb-4 space-y-1">
                    <li>• Sin anuncios en tu perfil</li>
                    <li>• Estadísticas detalladas</li>
                    <li>• Actualización de información</li>
                    <li>• Promociones destacadas</li>
                  </ul>
                  <button className="w-full bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue-dark transition-colors font-medium">
                    Reclamar Negocio
                  </button>
                </div>
              )}

              {/* Sidebar Ad - Only show for non-verified businesses */}
              {!business.verified && (
                <div className="mb-6">
                  <AdBannerSidebar />
                </div>
              )}

              {/* Validation */}
              {business.validationRatio !== undefined && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Validación Comunitaria</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{business.validationRatio}% validado</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Los contactos han sido verificados por la comunidad de usuarios.
                  </p>
                  <button className="text-sm text-primary-blue hover:text-primary-blue-dark transition-colors">
                    Reportar información incorrecta
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link
              href={`/${params.locale}/search`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la búsqueda
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}