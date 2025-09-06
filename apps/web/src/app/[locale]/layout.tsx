import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { QueryProvider } from '@/components/providers/query-provider';
import { GoogleAdSenseProvider } from '@/components/ads/GoogleAdSenseProvider';

const locales = ['es', 'en'];

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
          {children}
        </GoogleAdSenseProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}