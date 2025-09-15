interface StructuredDataProps {
  type: 'website' | 'business' | 'organization' | 'searchAction' | 'breadcrumb' | 'custom';
  data: any;
  locale?: string;
}

export default function StructuredData({ type, data, locale = 'es' }: StructuredDataProps) {
  let schema = {};

  switch (type) {
    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NumTrip',
        description: locale === 'es'
          ? 'Directorio verificado de contactos turísticos en Cartagena, Colombia'
          : 'Verified directory of tourism contacts in Cartagena, Colombia',
        url: 'https://numtrip.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `https://numtrip.com/${locale}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: 'NumTrip',
          url: 'https://numtrip.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://numtrip.com/logo.png',
            width: 60,
            height: 60,
          },
        },
        inLanguage: ['es-ES', 'en-US'],
        sameAs: [
          'https://www.facebook.com/numtrip',
          'https://www.instagram.com/numtrip',
          'https://twitter.com/numtrip'
        ],
      };
      break;

    case 'organization':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NumTrip',
        description: locale === 'es'
          ? 'Directorio verificado de contactos turísticos'
          : 'Verified directory of tourism contacts',
        url: 'https://numtrip.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://numtrip.com/logo.png',
          width: 60,
          height: 60,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'English'],
          url: 'https://numtrip.com/contact',
        },
        areaServed: [
          {
            '@type': 'City',
            name: 'Cartagena',
            addressCountry: 'CO',
            addressRegion: 'Bolívar',
          }
        ],
        serviceType: 'Tourism Directory',
        foundingDate: '2024',
        sameAs: [
          'https://www.facebook.com/numtrip',
          'https://www.instagram.com/numtrip',
          'https://twitter.com/numtrip'
        ],
      };
      break;

    case 'business':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: data.name,
        description: data.description,
        url: data.website || `https://numtrip.com/${locale}/business/${data.slug}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.address,
          addressLocality: data.city,
          addressCountry: 'CO',
        },
        geo: data.latitude && data.longitude ? {
          '@type': 'GeoCoordinates',
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
        telephone: data.contacts?.find((c: any) => c.type === 'PHONE')?.value,
        email: data.contacts?.find((c: any) => c.type === 'EMAIL')?.value,
        priceRange: data.priceRange || '$$',
        openingHours: data.openingHours || [],
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating.average,
          reviewCount: data.rating.count,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
        isVerified: data.verified,
        additionalType: data.category === 'HOTEL' ? 'https://schema.org/LodgingBusiness' :
                        data.category === 'RESTAURANT' ? 'https://schema.org/Restaurant' :
                        data.category === 'TOUR' ? 'https://schema.org/TravelAgency' :
                        data.category === 'TRANSPORT' ? 'https://schema.org/TaxiService' :
                        'https://schema.org/LocalBusiness',
        serviceArea: {
          '@type': 'City',
          name: data.city,
          addressCountry: 'CO',
        },
        ...data,
      };
      break;

    case 'searchAction':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `https://numtrip.com/${locale}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      };
      break;

    case 'breadcrumb':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      break;

    case 'custom':
      schema = data;
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}