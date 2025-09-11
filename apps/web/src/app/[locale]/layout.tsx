import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { QueryProvider } from '@/components/providers/query-provider';
import { GoogleAdSenseProvider } from '@/components/ads/GoogleAdSenseProvider';
import { GoogleAdSenseScript } from '@/components/ads/GoogleAdSense';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import CookieConsentBanner from '@/components/gdpr/CookieConsentBanner';
import type { Metadata } from 'next';

const locales = ['es', 'en'];

export async function generateMetadata({ 
  params: { locale } 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  const isSpanish = locale === 'es';
  
  const baseUrl = 'https://numtrip.com';
  const currentUrl = `${baseUrl}/${locale}`;
  
  if (isSpanish) {
    return {
      title: 'NumTrip - Directorio Verificado de Contactos Turísticos en Cartagena',
      description: 'Encuentra contactos verificados (teléfono, email, WhatsApp) de hoteles, tours y transporte en Cartagena, Colombia. Información turística confiable y actualizada.',
      keywords: 'turismo Cartagena, hoteles Cartagena, tours Cartagena, transporte Cartagena, contactos turísticos, directorio turístico, viajes Colombia',
      openGraph: {
        title: 'NumTrip - Directorio Verificado de Contactos Turísticos',
        description: 'Encuentra contactos verificados de hoteles, tours y transporte en Cartagena, Colombia.',
        url: currentUrl,
        locale: 'es_ES',
      },
      alternates: {
        canonical: currentUrl,
        languages: {
          'es-ES': `${baseUrl}/es`,
          'en-US': `${baseUrl}/en`,
        },
      },
    };
  } else {
    return {
      title: 'NumTrip - Verified Tourism Contact Directory in Cartagena',
      description: 'Find verified contacts (phone, email, WhatsApp) for hotels, tours and transportation in Cartagena, Colombia. Reliable and updated tourist information.',
      keywords: 'Cartagena tourism, Cartagena hotels, Cartagena tours, Cartagena transportation, tourist contacts, tourism directory, Colombia travel',
      openGraph: {
        title: 'NumTrip - Verified Tourism Contact Directory',
        description: 'Find verified contacts for hotels, tours and transportation in Cartagena, Colombia.',
        url: currentUrl,
        locale: 'en_US',
      },
      alternates: {
        canonical: currentUrl,
        languages: {
          'es-ES': `${baseUrl}/es`,
          'en-US': `${baseUrl}/en`,
        },
      },
    };
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <GoogleAdSenseProvider>
          <GoogleAnalytics />
          <GoogleAdSenseScript />
          {children}
          <CookieConsentBanner />
        </GoogleAdSenseProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}