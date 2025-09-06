import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BusinessDetailClient } from './business-detail-client';
import BusinessService from '@/services/business.service';

interface PageProps {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const business = await BusinessService.getBusinessById(params.id);
    
    if (!business) {
      return {
        title: 'Business not found',
      };
    }

    return {
      title: `${business.name} - NumTrip`,
      description: business.description || `Contact information for ${business.name} in ${business.city}`,
      openGraph: {
        title: business.name,
        description: business.description || `Verified contact information for ${business.name}`,
        type: 'website',
        locale: params.locale,
        siteName: 'NumTrip',
      },
      twitter: {
        card: 'summary',
        title: business.name,
        description: business.description || `Verified contact information for ${business.name}`,
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
    business = await BusinessService.getBusinessById(params.id);
  } catch (error) {
    notFound();
  }

  if (!business) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': business.category === 'HOTEL' ? 'Hotel' : 
            business.category === 'RESTAURANT' ? 'Restaurant' : 'LocalBusiness',
    name: business.name,
    description: business.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
    },
    telephone: business.phone,
    email: business.email,
    geo: business.latitude && business.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    } : undefined,
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