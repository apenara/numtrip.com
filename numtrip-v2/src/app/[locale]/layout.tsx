import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter } from 'next/font/google';
import { generateMetadata as generateMetaTags } from '@/components/seo/MetaTags';
import CookieConsent from '@/components/ads/CookieConsent';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const baseUrl = 'https://numtrip.com';

  const title = locale === 'es'
    ? 'NumTrip - Directorio de Contactos Turísticos Verificados en Cartagena'
    : 'NumTrip - Verified Tourism Contacts Directory in Cartagena';

  const description = locale === 'es'
    ? 'Encuentra números de WhatsApp, teléfonos y emails verificados de hoteles, tours, restaurantes y transporte en Cartagena, Colombia. Contactos turísticos verificados por la comunidad.'
    : 'Find verified WhatsApp numbers, phones and emails for hotels, tours, restaurants and transport in Cartagena, Colombia. Community-verified tourism contacts.';

  return generateMetaTags({
    title,
    description,
    url: `${baseUrl}/${locale}`,
    locale,
    keywords: locale === 'es'
      ? ['cartagena turismo', 'hoteles cartagena', 'tours cartagena', 'contactos verificados', 'whatsapp turismo']
      : ['cartagena tourism', 'cartagena hotels', 'cartagena tours', 'verified contacts', 'tourism whatsapp'],
  });
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}