// AdSense utility functions for NumTrip
// These functions help track ad performance and manage ad display based on user preferences

import { getCookieConsent } from '@/hooks/useCookieConsent';

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

// Check if AdSense is available and user has consented
export const isAdSenseAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (!ADSENSE_CLIENT_ID) return false;
  
  const consent = getCookieConsent();
  return consent?.advertising === true;
};

// Initialize AdSense (called automatically by GoogleAdSenseScript component)
export const initializeAdSense = () => {
  if (!isAdSenseAvailable()) return;
  
  // Initialize adsbygoogle array if it doesn't exist
  if (typeof window !== 'undefined') {
    window.adsbygoogle = window.adsbygoogle || [];
  }
};

// Push ads to queue (for manual ad initialization if needed)
export const pushAd = (adConfig?: any) => {
  if (!isAdSenseAvailable()) return;
  
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      window.adsbygoogle.push(adConfig || {});
    } catch (error) {
      console.error('AdSense push error:', error);
    }
  }
};

// Ad slot configurations for different page types
export const adSlots = {
  // Business page ads (non-verified businesses only)
  businessPage: {
    primary: '1111111111', // Main ad after contact info
    sidebar: '2222222222', // Sidebar ad
    footer: '3333333333', // Footer ad
  },
  
  // Search results ads
  searchResults: {
    top: '4444444444', // Top of search results
    middle: '5555555555', // Middle of search results
    sidebar: '6666666666', // Search sidebar
  },
  
  // General page ads
  general: {
    header: '7777777777', // Header banner
    content: '8888888888', // In-content ad
    footer: '9999999999', // Footer banner
  }
};

// Analytics for ad performance (integrates with Google Analytics)
export const trackAdEvent = (action: string, adSlot: string, businessId?: string) => {
  if (typeof window !== 'undefined' && window.gtag && isAdSenseAvailable()) {
    window.gtag('event', action, {
      event_category: 'adsense',
      event_label: `slot_${adSlot}${businessId ? `_business_${businessId}` : ''}`,
      value: 1,
    });
  }
};

// Track when ads are viewed
export const trackAdView = (adSlot: string, businessId?: string) => {
  trackAdEvent('ad_view', adSlot, businessId);
};

// Track when ads are clicked
export const trackAdClick = (adSlot: string, businessId?: string) => {
  trackAdEvent('ad_click', adSlot, businessId);
};

// Utility to check if a business should show ads
export const shouldShowAds = (business?: { verified: boolean; ownerId?: string }): boolean => {
  // Don't show ads if user hasn't consented to advertising cookies
  if (!isAdSenseAvailable()) return false;
  
  // Show ads for non-verified businesses
  if (business && business.verified) return false;
  
  // Always show ads on general pages when consent is given
  return true;
};

// Premium business check (verified businesses get ad-free experience)
export const isPremiumBusiness = (business: { verified: boolean; ownerId?: string }): boolean => {
  return business.verified || !!business.ownerId;
};

// Generate ad placement strategy based on page type and business status
export const getAdPlacementStrategy = (
  pageType: 'business' | 'search' | 'general',
  business?: { verified: boolean; ownerId?: string }
) => {
  if (!isAdSenseAvailable()) {
    return { showAds: false, placements: [] };
  }

  const baseStrategy = {
    business: {
      showAds: !isPremiumBusiness(business!),
      placements: business && !isPremiumBusiness(business) 
        ? ['primary', 'sidebar'] 
        : [],
    },
    search: {
      showAds: true,
      placements: ['top', 'sidebar'],
    },
    general: {
      showAds: true,
      placements: ['content'],
    },
  };

  return baseStrategy[pageType] || baseStrategy.general;
};

// Format ad slot for display
export const formatAdSlot = (slot: string): string => {
  return slot.replace(/\D/g, ''); // Remove non-digits, ensure numeric
};

// Check if we should load AdSense script
export const shouldLoadAdSenseScript = (): boolean => {
  return isAdSenseAvailable() && !!ADSENSE_CLIENT_ID;
};

export default {
  isAdSenseAvailable,
  initializeAdSense,
  pushAd,
  adSlots,
  trackAdView,
  trackAdClick,
  shouldShowAds,
  isPremiumBusiness,
  getAdPlacementStrategy,
  formatAdSlot,
  shouldLoadAdSenseScript,
};