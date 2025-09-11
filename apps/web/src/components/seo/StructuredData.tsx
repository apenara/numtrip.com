interface StructuredDataProps {
  type: 'website' | 'business' | 'organization';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema = {};

  switch (type) {
    case 'website':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NumTrip',
        description: 'Directorio verificado de contactos turísticos en Cartagena, Colombia',
        url: 'https://numtrip.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://numtrip.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: 'NumTrip',
          url: 'https://numtrip.com',
        },
        inLanguage: ['es-ES', 'en-US'],
      };
      break;

    case 'organization':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NumTrip',
        description: 'Directorio verificado de contactos turísticos',
        url: 'https://numtrip.com',
        logo: 'https://numtrip.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'English'],
        },
        areaServed: {
          '@type': 'City',
          name: 'Cartagena',
          addressCountry: 'CO',
        },
        serviceType: 'Tourism Directory',
      };
      break;

    case 'business':
      schema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        ...data,
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}