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

export default function GoogleAnalytics() {
  const { preferences, hasConsent, isLoaded } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only initialize if we have consent for analytics and GA ID is configured
    if (!GA_MEASUREMENT_ID || !isLoaded || !hasConsent || !preferences.analytics) {
      return;
    }

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    // Make gtag available globally
    window.gtag = gtag;

    // Configure Google Analytics
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      // Respect user's cookie preferences
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
      // Only set cookies if user has consented to functional cookies
      storage: preferences.functional ? 'granted' : 'denied',
      // Respect advertising cookie preference
      ad_storage: preferences.advertising ? 'granted' : 'denied',
      // Analytics storage based on analytics cookie preference
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      // Send initial page view
      page_path: pathname,
    });

    // Set up consent mode
    gtag('consent', 'update', {
      ad_storage: preferences.advertising ? 'granted' : 'denied',
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      functionality_storage: preferences.functional ? 'granted' : 'denied',
      personalization_storage: preferences.functional ? 'granted' : 'denied',
      security_storage: 'granted', // Always granted for essential functionality
    });

  }, [preferences, hasConsent, isLoaded]);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hasConsent || !preferences.analytics) {
      return;
    }

    const url = pathname + (searchParams ? `?${searchParams}` : '');
    
    // Send pageview event to GA
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams, hasConsent, preferences.analytics]);

  // Don't render scripts if no consent or no GA ID
  if (!GA_MEASUREMENT_ID || !isLoaded || !hasConsent || !preferences.analytics) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
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
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
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