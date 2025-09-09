'use client';

import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    advertising: false,
    functional: false,
  });
  
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const parsedPreferences = JSON.parse(savedConsent);
        setPreferences(parsedPreferences);
        setHasConsent(true);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
    setIsLoaded(true);

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent<CookiePreferences>) => {
      setPreferences(event.detail);
      setHasConsent(true);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    };
  }, []);

  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    localStorage.setItem('cookieConsent', JSON.stringify(updatedPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
      detail: updatedPreferences 
    }));
  };

  const resetConsent = () => {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    setHasConsent(false);
    setPreferences({
      essential: true,
      analytics: false,
      advertising: false,
      functional: false,
    });
  };

  const getConsentDate = (): Date | null => {
    const dateString = localStorage.getItem('cookieConsentDate');
    return dateString ? new Date(dateString) : null;
  };

  // Helper functions for specific cookie types
  const canUseAnalytics = (): boolean => preferences.analytics;
  const canUseAdvertising = (): boolean => preferences.advertising;
  const canUseFunctional = (): boolean => preferences.functional;

  // Update consent mode when preferences change
  useEffect(() => {
    if (hasConsent && typeof window !== 'undefined' && window.gtag) {
      // Update Google Analytics consent mode
      window.gtag('consent', 'update', {
        ad_storage: preferences.advertising ? 'granted' : 'denied',
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
        personalization_storage: preferences.functional ? 'granted' : 'denied',
        security_storage: 'granted', // Always granted for essential functionality
      });
    }
  }, [hasConsent, preferences]);

  return {
    preferences,
    hasConsent,
    isLoaded,
    updatePreferences,
    resetConsent,
    getConsentDate,
    canUseAnalytics,
    canUseAdvertising,
    canUseFunctional,
  };
}

// Utility function to check if we can use specific cookie types
export const getCookieConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  
  const savedConsent = localStorage.getItem('cookieConsent');
  if (savedConsent) {
    try {
      return JSON.parse(savedConsent);
    } catch (error) {
      console.error('Error parsing cookie preferences:', error);
      return null;
    }
  }
  return null;
};

// Type declaration for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}