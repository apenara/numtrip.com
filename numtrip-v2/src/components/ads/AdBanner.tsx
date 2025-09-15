'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {}
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load ads if user has consented to marketing cookies
    const consent = localStorage.getItem('numtrip-cookie-consent');
    let hasMarketingConsent = false;

    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        hasMarketingConsent = parsed.preferences?.marketing || false;
      } catch {
        hasMarketingConsent = false;
      }
    }

    if (!hasMarketingConsent) {
      // Show placeholder instead of ad
      if (adRef.current) {
        adRef.current.innerHTML = `
          <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p class="text-gray-500 text-sm">
              Espacio publicitario disponible
              <br />
              <span class="text-xs">Acepta cookies de marketing para ver anuncios</span>
            </p>
          </div>
        `;
      }
      return;
    }

    // Load AdSense if consent is given and not already loaded
    if (typeof window !== 'undefined' && window.adsbygoogle && !isLoaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense loading error:', error);

        // Show fallback content
        if (adRef.current) {
          adRef.current.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p class="text-blue-800 text-sm">
                ¿Eres un negocio turístico en Cartagena?
                <br />
                <a href="/es/add-business" class="font-medium underline hover:no-underline">
                  Regístrate gratis en nuestro directorio
                </a>
              </p>
            </div>
          `;
        }
      }
    }
  }, [slot]);

  const getAdSize = () => {
    switch (format) {
      case 'rectangle':
        return { width: 300, height: 250 };
      case 'horizontal':
        return { width: 728, height: 90 };
      case 'vertical':
        return { width: 160, height: 600 };
      default:
        return responsive ? { width: '100%', height: 'auto' } : { width: 320, height: 100 };
    }
  };

  const adSize = getAdSize();

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    // Development/no AdSense fallback
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500 text-sm">AdSense Placeholder</p>
        <p className="text-xs text-gray-400">Slot: {slot}</p>
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ minHeight: '100px', ...style }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: adSize.width,
          height: adSize.height,
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// Utility component for common ad sizes
export function AdBannerTop({ className }: { className?: string }) {
  return (
    <AdBanner
      slot="1234567890" // Replace with actual slot ID
      format="horizontal"
      className={className}
    />
  );
}

export function AdBannerSidebar({ className }: { className?: string }) {
  return (
    <AdBanner
      slot="1234567891" // Replace with actual slot ID
      format="rectangle"
      className={className}
    />
  );
}

export function AdBannerInFeed({ className }: { className?: string }) {
  return (
    <AdBanner
      slot="1234567892" // Replace with actual slot ID
      format="auto"
      responsive={true}
      className={className}
    />
  );
}