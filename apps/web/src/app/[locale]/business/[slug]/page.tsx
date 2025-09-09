import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BusinessDetailClient } from './business-detail-client';
import SupabaseBusinessService from '@/services/business.service.supabase';

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const business = await SupabaseBusinessService.getBusinessBySlug(params.slug);
    
    if (!business) {
      return {
        title: 'Business not found',
      };
    }

    // Create SEO-optimized title: "Número de contacto" + Business Name + Location
    const seoTitle = `Número de contacto ${business.name} - ${business.city} | NumTrip`;

    // Enhanced description with contact info for SEO
    const contactInfo = [
      business.phone && `Teléfono: ${business.phone}`,
      business.whatsapp && `WhatsApp: ${business.whatsapp}`,
      business.email && `Email: ${business.email}`
    ].filter(Boolean).join(' • ');

    const seoDescription = business.description 
      ? `${business.description} ${contactInfo ? `| ${contactInfo}` : ''} | Contactos verificados en ${business.city}`
      : `Información de contacto verificada para ${business.name} en ${business.city}. ${contactInfo}`;

    return {
      title: seoTitle,
      description: seoDescription,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: 'website',
        locale: params.locale,
        siteName: 'NumTrip',
        url: `https://numtrip.com/${params.locale}/business/${params.slug}`,
        images: [
          {
            url: '/og-business-default.jpg',
            width: 1200,
            height: 630,
            alt: `${business.name} - NumTrip`,
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: ['/og-business-default.jpg'],
      },
      keywords: [
        business.name,
        business.city,
        business.category.toLowerCase(),
        'contacto',
        'teléfono',
        'whatsapp',
        'cartagena',
        'colombia',
        'turismo',
        ...(business.phone ? [business.phone] : []),
        ...(business.whatsapp ? [business.whatsapp] : [])
      ].join(', '),
      alternates: {
        canonical: `https://numtrip.com/${params.locale}/business/${params.slug}`,
        languages: {
          'es-CO': `https://numtrip.com/es/business/${params.slug}`,
          'en-US': `https://numtrip.com/en/business/${params.slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Business - NumTrip',
    };
  }
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const t = await getTranslations('Business');
  
  let business;
  try {
    business = await SupabaseBusinessService.getBusinessBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!business) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': business.category === 'HOTEL' ? 'Hotel' : 
            business.category === 'RESTAURANT' ? 'Restaurant' :
            business.category === 'TOUR' ? 'TouristAttraction' :
            business.category === 'TRANSPORT' ? 'TaxiService' : 'LocalBusiness',
    name: business.name,
    description: business.description || `Información de contacto para ${business.name} en ${business.city}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressCountry: 'CO'
    },
    telephone: business.phone,
    email: business.email,
    url: business.website,
    priceRange: business.category === 'HOTEL' ? '$$' : '$',
    aggregateRating: business.verified ? {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '1',
      bestRating: '5',
      worstRating: '1'
    } : undefined,
    geo: business.latitude && business.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    } : undefined,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios',
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: business.category === 'HOTEL' ? 'Alojamiento' :
                business.category === 'RESTAURANT' ? 'Comidas' :
                business.category === 'TOUR' ? 'Tours y Actividades' :
                business.category === 'TRANSPORT' ? 'Transporte' : 'Servicios'
        }
      }]
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: business.phone,
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English']
    }],
    sameAs: business.whatsapp ? [`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`] : []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessDetailClient business={business} translations={t.raw('detail')} />
    </>
  );
}