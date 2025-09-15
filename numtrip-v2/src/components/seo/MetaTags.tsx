import { Metadata } from 'next';

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  locale: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  alternateLanguages?: { [key: string]: string };
}

export function generateMetadata({
  title,
  description,
  url,
  locale,
  type = 'website',
  image = 'https://numtrip.com/og-image.jpg',
  noIndex = false,
  keywords = [],
  alternateLanguages = {},
}: MetaTagsProps): Metadata {
  const siteName = 'NumTrip';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  const defaultKeywords = locale === 'es'
    ? ['contactos turísticos', 'cartagena', 'hoteles', 'tours', 'transporte', 'restaurantes', 'whatsapp', 'teléfonos']
    : ['tourism contacts', 'cartagena', 'hotels', 'tours', 'transport', 'restaurants', 'whatsapp', 'phones'];

  const allKeywords = [...defaultKeywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: 'NumTrip Team' }],
    creator: 'NumTrip',
    publisher: 'NumTrip',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@numtrip',
      site: '@numtrip',
    },
    alternates: {
      canonical: url,
      languages: {
        ...alternateLanguages,
        'es-ES': url.replace(/\/en\//, '/es/'),
        'en-US': url.replace(/\/es\//, '/en/'),
      },
    },
    other: {
      'google-site-verification': 'your-google-verification-code',
      'msvalidate.01': 'your-bing-verification-code',
    },
  };

  return metadata;
}