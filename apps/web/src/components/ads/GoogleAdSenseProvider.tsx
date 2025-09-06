'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleAdSenseProviderProps {
  children: React.ReactNode;
}

export function GoogleAdSenseProvider({ children }: GoogleAdSenseProviderProps) {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  
  // Only load AdSense in production
  const shouldLoadAds = process.env.NODE_ENV === 'production' && adSenseClientId;

  useEffect(() => {
    // Initialize ads after component mount
    if (shouldLoadAds && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.warn('AdSense initialization error:', error);
      }
    }
  }, [shouldLoadAds]);

  return (
    <>
      {shouldLoadAds && (
        <>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            onError={(error) => {
              console.warn('AdSense script loading error:', error);
            }}
          />
          
          {/* Auto Ads - Let Google optimize ad placement */}
          <Script
            id="adsense-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (adsbygoogle = window.adsbygoogle || []).push({
                  google_ad_client: "${adSenseClientId}",
                  enable_page_level_ads: true
                });
              `
            }}
          />
        </>
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