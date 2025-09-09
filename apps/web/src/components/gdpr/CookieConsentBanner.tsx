'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Settings, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  functional: boolean;
}

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    advertising: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      advertising: true,
      functional: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowPreferences(false);
    
    // Initialize analytics and advertising if accepted
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
        detail: allAccepted 
      }));
    }
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      advertising: false,
      functional: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(essentialOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(essentialOnly);
    setShowBanner(false);
    setShowPreferences(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
        detail: essentialOnly 
      }));
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowPreferences(false);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { 
        detail: preferences 
      }));
    }
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-lg z-50">
        <div className="max-w-7xl mx-auto p-6">
          {!showPreferences ? (
            // Main consent banner
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 Respetamos tu privacidad
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Utilizamos cookies esenciales para el funcionamiento del sitio y cookies opcionales para mejorar tu experiencia, 
                  analizar el tráfico y mostrar publicidad relevante. Puedes elegir qué cookies aceptar.
                </p>
                <p className="text-xs text-gray-600">
                  Al continuar navegando aceptas nuestras{' '}
                  <Link href="/cookies" className="text-blue-600 hover:underline">
                    Políticas de Cookies
                  </Link>{' '}
                  y{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Personalizar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Solo Esenciales
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Aceptar Todas
                </button>
              </div>
            </div>
          ) : (
            // Preferences panel
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preferencias de Cookies
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies Esenciales</h4>
                    <p className="text-sm text-gray-600">
                      Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies de Análisis</h4>
                    <p className="text-sm text-gray-600">
                      Nos ayudan a entender cómo interactúas con el sitio para mejorarlo.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics 
                          ? 'bg-blue-600 justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies de Publicidad</h4>
                    <p className="text-sm text-gray-600">
                      Permiten mostrar anuncios más relevantes basados en tus intereses.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('advertising')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.advertising 
                          ? 'bg-blue-600 justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Cookies Funcionales</h4>
                    <p className="text-sm text-gray-600">
                      Recuerdan tus preferencias para mejorar tu experiencia.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.functional 
                          ? 'bg-blue-600 justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}