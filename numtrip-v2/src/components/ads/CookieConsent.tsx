'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const CONSENT_STORAGE_KEY = 'numtrip-cookie-consent';
const CONSENT_VERSION = '1.0';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const locale = useLocale();

  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          // Apply saved preferences
          applyConsentPreferences(parsed.preferences);
        } else {
          // Version mismatch, show banner again
          setIsVisible(true);
        }
      } catch {
        // Invalid data, show banner
        setIsVisible(true);
      }
    }
  }, []);

  const applyConsentPreferences = (prefs: ConsentPreferences) => {
    // Apply Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        personalization_storage: prefs.personalization ? 'granted' : 'denied',
        functionality_storage: 'granted', // Always granted for basic functionality
        security_storage: 'granted', // Always granted for security
      });
    }

    // Apply AdSense consent
    if (prefs.marketing && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
          enable_page_level_ads: true
        });
      } catch (error) {
        console.error('AdSense consent error:', error);
      }
    }
  };

  const saveConsent = (prefs: ConsentPreferences) => {
    const consentData = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      preferences: prefs,
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    applyConsentPreferences(prefs);
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  const updatePreference = (key: keyof ConsentPreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Gestión de Cookies
            </h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showDetails ? (
            // Simple consent banner
            <div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar el contenido.
                También mostramos anuncios relevantes para mantener nuestro servicio gratuito.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Tu Privacidad es Importante</h3>
                    <p className="text-blue-800 text-sm">
                      Puedes personalizar qué cookies aceptas. Lee nuestra{' '}
                      <Link href={`/${locale}/privacy`} className="underline hover:no-underline">
                        Política de Privacidad
                      </Link>{' '}
                      para más detalles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptAll}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Aceptar Todo
                </button>
                <button
                  onClick={acceptNecessaryOnly}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Solo Necesarias
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Personalizar
                </button>
              </div>
            </div>
          ) : (
            // Detailed preferences
            <div>
              <p className="text-gray-700 mb-6">
                Personaliza tus preferencias de cookies. Puedes cambiar estas configuraciones en cualquier momento.
              </p>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies Necesarias</h3>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Siempre Activas
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies de Análisis</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.analytics}
                        onChange={(e) => updatePreference('analytics', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Google Analytics para entender cómo los usuarios utilizan nuestro sitio y mejorarlo.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies de Marketing</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.marketing}
                        onChange={(e) => updatePreference('marketing', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Google AdSense para mostrar anuncios relevantes. Ayuda a mantener nuestro servicio gratuito.
                  </p>
                </div>

                {/* Personalization Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies de Personalización</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.personalization}
                        onChange={(e) => updatePreference('personalization', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Recordar tus preferencias y configuraciones para una experiencia personalizada.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={saveCustomPreferences}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Guardar Preferencias
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600 text-center">
            Al continuar navegando, aceptas nuestras{' '}
            <Link href={`/${locale}/privacy`} className="text-blue-600 hover:underline">
              Políticas de Privacidad
            </Link>{' '}
            y{' '}
            <Link href={`/${locale}/terms`} className="text-blue-600 hover:underline">
              Términos de Uso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Extend window type for TypeScript
declare global {
  interface Window {
    gtag: any;
    adsbygoogle: any[];
  }
}