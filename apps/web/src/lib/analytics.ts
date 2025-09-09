// Analytics utility functions for NumTrip
// These functions provide an easy way to track user interactions and business events

import { 
  trackEvent, 
  trackPageView, 
  trackBusinessView, 
  trackContactClick, 
  trackSearch, 
  trackBusinessClaim, 
  trackUserRegistration, 
  trackUserLogin 
} from '@/components/analytics/GoogleAnalytics';

// Business-related tracking
export const analytics = {
  // Page tracking
  pageView: (path: string, title?: string) => {
    trackPageView(path, title);
  },

  // Business interactions
  business: {
    view: (businessId: string, businessName: string, category?: string) => {
      trackBusinessView(businessId, businessName, category);
    },
    
    contactClick: (contactType: 'phone' | 'email' | 'whatsapp' | 'website', businessId: string, businessName?: string) => {
      trackContactClick(contactType, businessId);
      
      // Additional custom event for business engagement
      trackEvent('business_engagement', 'contact', `${contactType}_${businessName || businessId}`, 1);
    },
    
    claim: (businessId: string, method: 'email' | 'sms' | 'phone', businessName?: string) => {
      trackBusinessClaim(businessId, method);
      
      // Track as conversion event
      trackEvent('conversion', 'business_claim', `${method}_${businessName || businessId}`, 1);
    },
    
    share: (businessId: string, platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy', businessName?: string) => {
      trackEvent('share', 'business', `${platform}_${businessName || businessId}`, 1);
    }
  },

  // Search interactions
  search: {
    perform: (query: string, category?: string, resultsCount?: number) => {
      trackSearch(query, category, resultsCount);
    },
    
    filterApply: (filterType: 'category' | 'location' | 'verified', filterValue: string) => {
      trackEvent('search_filter', 'interaction', `${filterType}_${filterValue}`, 1);
    },
    
    resultClick: (businessId: string, position: number, query: string) => {
      trackEvent('search_result_click', 'engagement', `position_${position}_${businessId}`, 1);
      
      // Enhanced ecommerce - select item
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'select_item', {
          item_list_id: 'search_results',
          item_list_name: 'Search Results',
          items: [
            {
              item_id: businessId,
              item_name: query,
              index: position,
            }
          ]
        });
      }
    }
  },

  // User authentication
  auth: {
    register: (method: 'email' | 'google' | 'facebook') => {
      trackUserRegistration(method);
    },
    
    login: (method: 'email' | 'google' | 'facebook') => {
      trackUserLogin(method);
    },
    
    logout: () => {
      trackEvent('logout', 'auth', 'user_logout', 1);
    }
  },

  // User engagement
  engagement: {
    newsletterSignup: (source: string) => {
      trackEvent('newsletter_signup', 'engagement', source, 1);
    },
    
    contactFormSubmit: (formType: 'general' | 'support' | 'business_inquiry') => {
      trackEvent('contact_form_submit', 'engagement', formType, 1);
    },
    
    timeOnPage: (duration: number, pagePath: string) => {
      trackEvent('time_on_page', 'engagement', pagePath, Math.round(duration));
    },
    
    scrollDepth: (depth: 25 | 50 | 75 | 100, pagePath: string) => {
      trackEvent('scroll_depth', 'engagement', `${depth}%_${pagePath}`, 1);
    }
  },

  // Feature usage
  features: {
    cookiePreferencesOpen: () => {
      trackEvent('cookie_preferences', 'privacy', 'preferences_opened', 1);
    },
    
    cookieConsentGiven: (consentType: 'accept_all' | 'reject_all' | 'custom') => {
      trackEvent('cookie_consent', 'privacy', consentType, 1);
    },
    
    languageChange: (from: string, to: string) => {
      trackEvent('language_change', 'settings', `${from}_to_${to}`, 1);
    }
  },

  // Error tracking
  errors: {
    pageError: (error: string, page: string) => {
      trackEvent('page_error', 'error', `${page}_${error}`, 1);
    },
    
    apiError: (endpoint: string, status: number) => {
      trackEvent('api_error', 'error', `${endpoint}_${status}`, 1);
    },
    
    formError: (formName: string, fieldName: string, errorType: string) => {
      trackEvent('form_error', 'error', `${formName}_${fieldName}_${errorType}`, 1);
    }
  },

  // Custom events
  custom: (action: string, category: string, label?: string, value?: number) => {
    trackEvent(action, category, label, value);
  }
};

// Hook for page view tracking in Next.js
export const usePageTracking = () => {
  if (typeof window !== 'undefined') {
    const handleRouteChange = (url: string) => {
      analytics.pageView(url);
    };
    
    return { handleRouteChange };
  }
  
  return { handleRouteChange: () => {} };
};

// Utility to check if analytics is available and user has consented
export const isAnalyticsAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) return false;
  
  try {
    const preferences = JSON.parse(consent);
    return preferences.analytics === true && typeof window.gtag === 'function';
  } catch {
    return false;
  }
};