import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://numtrip.com'),
  title: {
    default: 'NumTrip - Directorio Verificado de Contactos Turísticos',
    template: '%s | NumTrip',
  },
  description: 'Encuentra contactos verificados (teléfono, email, WhatsApp) de hoteles, tours y transporte en Cartagena, Colombia. Información turística confiable y actualizada.',
  keywords: 'turismo Cartagena, hoteles Cartagena, tours Cartagena, transporte Cartagena, contactos turísticos, directorio turístico, viajes Colombia',
  authors: [{ name: 'NumTrip' }],
  creator: 'NumTrip',
  publisher: 'NumTrip',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://numtrip.com',
    siteName: 'NumTrip',
    title: 'NumTrip - Directorio Verificado de Contactos Turísticos',
    description: 'Encuentra contactos verificados de hoteles, tours y transporte en Cartagena, Colombia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NumTrip - Directorio Turístico Verificado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NumTrip - Directorio Verificado de Contactos Turísticos',
    description: 'Encuentra contactos verificados de hoteles, tours y transporte en Cartagena, Colombia.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://numtrip.com',
    languages: {
      'es-ES': 'https://numtrip.com/es',
      'en-US': 'https://numtrip.com/en',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}