'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookieConsent } from '@/hooks/useCookieConsent';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEBUG_GA = true; // Set to false in production

export default function GoogleAnalytics() {
  const { preferences, hasConsent, isLoaded } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Log GA status for debugging
  useEffect(() => {
    if (DEBUG_GA) {
      console.log('[GA Debug] Component mounted', {
        GA_MEASUREMENT_ID,
        hasConsent,
        analyticsConsent: preferences.analytics,
        isLoaded,
        pathname
      });
    }
  }, []);

  // Initialize gtag and dataLayer immediately (before script loads)
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.error('[GA Error] GA_MEASUREMENT_ID is not defined');
      return;
    }

    // Initialize dataLayer and gtag function globally
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Set default consent state
    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted'
    });

    // Configure GA with initial pageview
    window.gtag('js', new Date());

    
    if (DEBUG_GA) {
      console.log('[GA Debug] Initialized gtag and dataLayer');
    }
  }, []); // Run once on mount

  // Update consent when preferences change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !isLoaded) return;

    const consentState = hasConsent && preferences.analytics ? 'granted' : 'denied';
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': preferences.advertising ? 'granted' : 'denied',
        'analytics_storage': consentState,
        'functionality_storage': preferences.functional ? 'granted' : 'denied',
        'personalization_storage': preferences.functional ? 'granted' : 'denied',
        'security_storage': 'granted'
      });

      if (DEBUG_GA) {
        console.log('[GA Debug] Updated consent', {
          analytics_storage: consentState,
          hasConsent,
          preferences
        });
      }

      // If consent is granted, configure GA
      if (consentState === 'granted') {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: pathname,
          debug_mode: !IS_PRODUCTION
        });
        
        if (DEBUG_GA) {
          console.log('[GA Debug] Configured GA with initial pageview', pathname);
        }
      }
    }
  }, [hasConsent, preferences, isLoaded, pathname]);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // Create full URL
    const url = pathname + (searchParams ? `?${searchParams}` : '');
    
    // Only track if we have consent and gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      // Always send pageview, GA will respect consent state
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
        send_to: GA_MEASUREMENT_ID
      });

      if (DEBUG_GA) {
        console.log('[GA Debug] Pageview tracked', {
          url,
          title: document.title,
          consent: hasConsent && preferences.analytics
        });
      }
    }
  }, [pathname, searchParams, hasConsent, preferences.analytics]);

  // Don't render script if no GA ID
  if (!GA_MEASUREMENT_ID) {
    console.error('[GA Error] NEXT_PUBLIC_GA_MEASUREMENT_ID is not configured');
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (DEBUG_GA) {
            console.log('[GA Debug] GA script loaded successfully');
          }
        }}
        onError={(e) => {
          console.error('[GA Error] Failed to load GA script:', e);
        }}
      />
      
      {/* Inline script to ensure gtag is defined before GA script runs */}
      <Script
        id="gtag-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              debug_mode: ${!IS_PRODUCTION}
            });
            ${DEBUG_GA ? "console.log('[GA Debug] Inline script executed');" : ''}
          `,
        }}
      />
    </>
  );
}

// Utility functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
    
    if (DEBUG_GA) {
      console.log('[GA Debug] Event tracked', { action, category, label, value });
    }
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
    
    if (DEBUG_GA) {
      console.log('[GA Debug] Manual pageview tracked', { path, title });
    }
  }
};

// Business-specific tracking functions
export const trackBusinessView = (businessId: string, businessName: string, category?: string) => {
  trackEvent('view_business', 'business', `${businessName} (${businessId})`, 1);
  
  // Enhanced ecommerce tracking for business views
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'COP',
      value: 1,
      items: [
        {
          item_id: businessId,
          item_name: businessName,
          item_category: category || 'business',
          quantity: 1,
        }
      ]
    });
  }
};

export const trackContactClick = (contactType: 'phone' | 'email' | 'whatsapp' | 'website', businessId: string) => {
  trackEvent('contact_click', 'engagement', `${contactType}_${businessId}`, 1);
};

export const trackSearch = (query: string, category?: string, resultsCount?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      search_category: category,
      search_results: resultsCount,
    });
    
    if (DEBUG_GA) {
      console.log('[GA Debug] Search tracked', { query, category, resultsCount });
    }
  }
};

export const trackBusinessClaim = (businessId: string, method: 'email' | 'sms' | 'phone') => {
  trackEvent('business_claim', 'conversion', `${method}_${businessId}`, 1);
};

export const trackUserRegistration = (method: 'email' | 'google' | 'facebook') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method,
    });
  }
};

export const trackUserLogin = (method: 'email' | 'google' | 'facebook') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method,
    });
  }
};