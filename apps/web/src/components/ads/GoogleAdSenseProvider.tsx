'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useEffect, useState } from 'react';

interface GoogleAdSenseProviderProps {
  children: React.ReactNode;
}

export function GoogleAdSenseProvider({ children }: GoogleAdSenseProviderProps) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const { preferences, hasConsent, isLoaded } = useCookieConsent();
  const [adsInitialized, setAdsInitialized] = useState(false);
  
  // Only load AdSense if we have consent and it's not already initialized
  const shouldLoadAds = adSenseClientId && isLoaded && hasConsent && preferences.advertising && !adsInitialized;

  useEffect(() => {
    // Initialize ads only once when we have consent
    if (shouldLoadAds && typeof window !== 'undefined' && !adsInitialized) {
      try {
        // Wait for script to load before initializing
        const checkAdSenseLoaded = () => {
          if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: adSenseClientId,
              enable_page_level_ads: true
            });
            setAdsInitialized(true);
          } else {
            // Retry after a short delay
            setTimeout(checkAdSenseLoaded, 100);
          }
        };
        
        // Start checking after a brief delay
        setTimeout(checkAdSenseLoaded, 500);
      } catch (error) {
        console.warn('AdSense initialization error:', error);
      }
    }
  }, [shouldLoadAds, adSenseClientId, adsInitialized]);

  return (
    <>
      {shouldLoadAds && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('AdSense script loaded successfully');
          }}
          onError={(error) => {
            console.warn('AdSense script loading error:', error);
          }}
        />
      )}
      {children}
    </>
  );
}

// Hook to check if ads should be shown
export function useAdSense() {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const shouldLoadAds = process.env.NODE_ENV === 'production' && adSenseClientId;
  
  return {
    shouldLoadAds,
    adSenseClientId,
  };
}