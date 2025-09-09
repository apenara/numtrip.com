'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

interface GoogleAdSenseProps {
  className?: string;
  style?: React.CSSProperties;
}

// Main AdSense script loader
export function GoogleAdSenseScript() {
  const { preferences, hasConsent, isLoaded } = useCookieConsent();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Only load AdSense if we have consent for advertising cookies
    if (!ADSENSE_CLIENT_ID || !isLoaded || !hasConsent || !preferences.advertising) {
      return;
    }

    if (!scriptLoaded) {
      setScriptLoaded(true);
    }
  }, [preferences.advertising, hasConsent, isLoaded, scriptLoaded]);

  // Don't render script if no consent or no client ID
  if (!ADSENSE_CLIENT_ID || !isLoaded || !hasConsent || !preferences.advertising) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('AdSense script loaded successfully');
      }}
      onError={(e) => {
        console.error('Failed to load AdSense script:', e);
      }}
    />
  );
}

// Individual ad unit component
interface AdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export function AdUnit({ adSlot, adFormat = 'auto', style, className }: AdUnitProps) {
  const { preferences, hasConsent, isLoaded } = useCookieConsent();
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Only show ads if user has consented to advertising cookies
    if (!ADSENSE_CLIENT_ID || !isLoaded || !hasConsent || !preferences.advertising) {
      return;
    }

    if (!adLoaded && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [preferences.advertising, hasConsent, isLoaded, adLoaded, adSlot]);

  // Show placeholder if no consent for advertising
  if (!ADSENSE_CLIENT_ID || !isLoaded || !hasConsent || !preferences.advertising) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[250px] ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <p className="text-sm font-medium mb-2">Espacio publicitario</p>
          <p className="text-xs">
            Los anuncios aparecerán aquí cuando aceptes las cookies de publicidad
          </p>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}

// Predefined ad components for different sizes
export function BannerAd({ className, style }: GoogleAdSenseProps) {
  return (
    <AdUnit
      adSlot="1234567890" // Replace with actual ad slot
      adFormat="horizontal"
      className={className}
      style={{
        width: '100%',
        height: '90px',
        ...style,
      }}
    />
  );
}

export function RectangleAd({ className, style }: GoogleAdSenseProps) {
  return (
    <AdUnit
      adSlot="0987654321" // Replace with actual ad slot
      adFormat="rectangle"
      className={className}
      style={{
        width: '300px',
        height: '250px',
        ...style,
      }}
    />
  );
}

export function SidebarAd({ className, style }: GoogleAdSenseProps) {
  return (
    <AdUnit
      adSlot="5678901234" // Replace with actual ad slot
      adFormat="vertical"
      className={className}
      style={{
        width: '160px',
        height: '600px',
        ...style,
      }}
    />
  );
}

// Responsive ad component
export function ResponsiveAd({ className, style }: GoogleAdSenseProps) {
  return (
    <AdUnit
      adSlot="4321098765" // Replace with actual ad slot
      adFormat="auto"
      className={className}
      style={{
        display: 'block',
        ...style,
      }}
    />
  );
}

// Business page specific ad
export function BusinessPageAd({ className, style }: GoogleAdSenseProps) {
  const { preferences, hasConsent } = useCookieConsent();

  // Only show on business pages and with advertising consent
  if (!hasConsent || !preferences.advertising) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 my-6 ${className}`}>
        <div className="text-center text-blue-800">
          <p className="text-sm font-medium mb-1">🎯 Publicidad Personalizada</p>
          <p className="text-xs">
            Acepta las cookies de publicidad para ver anuncios relevantes que nos ayudan a mantener NumTrip gratuito
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 ${className}`}>
      <div className="text-center mb-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Publicidad</span>
      </div>
      <AdUnit
        adSlot="1111111111" // Replace with actual ad slot for business pages
        adFormat="auto"
        style={{
          display: 'block',
          minHeight: '250px',
          ...style,
        }}
      />
    </div>
  );
}