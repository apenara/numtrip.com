'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, RefreshCw, Save, Settings2, Shield, Target } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookiePreferencesClient() {
  const { 
    preferences, 
    hasConsent, 
    updatePreferences, 
    resetConsent, 
    getConsentDate,
    isLoaded 
  } = useCookieConsent();
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updatePreferences(localPreferences);
    setIsLoading(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    resetConsent();
    setLocalPreferences({
      essential: true,
      analytics: false,
      advertising: false,
      functional: false,
    });
  };

  const consentDate = getConsentDate();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Preferencias de Cookies</h1>
        <p className="text-gray-600 mb-4">
          Controla qué tipos de cookies puede usar NumTrip para mejorar tu experiencia de navegación.
        </p>
        
        {hasConsent && consentDate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Consentimiento otorgado:</strong> {consentDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {showSuccess && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Preferencias guardadas exitosamente
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Essential Cookies */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Cookies Esenciales</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Estas cookies son necesarias para el funcionamiento básico del sitio web y no se pueden desactivar. 
                Incluyen cookies de autenticación, seguridad y funcionalidades básicas.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Ejemplos:</strong> Autenticación de usuario, preferencias de idioma, configuración de seguridad
              </div>
            </div>
            <div className="ml-6">
              <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center justify-end px-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">Siempre activo</p>
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Cookies de Análisis</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Nos ayudan a entender cómo interactúas con el sitio web recopilando información anónima sobre tu uso. 
                Esto nos permite mejorar la funcionalidad y experiencia del usuario.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Proveedores:</strong> Google Analytics
                <br />
                <strong>Datos recopilados:</strong> Páginas visitadas, tiempo en el sitio, origen del tráfico
              </div>
            </div>
            <div className="ml-6">
              <button
                onClick={() => handlePreferenceChange('analytics')}
                className={`w-14 h-8 rounded-full flex items-center transition-all duration-200 ${
                  localPreferences.analytics 
                    ? 'bg-blue-600 justify-end' 
                    : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Advertising Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Target className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Cookies de Publicidad</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Permiten mostrar anuncios más relevantes basados en tus intereses y comportamiento de navegación. 
                También ayudan a medir la efectividad de las campañas publicitarias.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Proveedores:</strong> Google AdSense, Google Ads
                <br />
                <strong>Propósito:</strong> Personalización de anuncios, medición de rendimiento
              </div>
            </div>
            <div className="ml-6">
              <button
                onClick={() => handlePreferenceChange('advertising')}
                className={`w-14 h-8 rounded-full flex items-center transition-all duration-200 ${
                  localPreferences.advertising 
                    ? 'bg-blue-600 justify-end' 
                    : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Functional Cookies */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Settings2 className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Cookies Funcionales</h3>
              </div>
              <p className="text-gray-700 mb-3">
                Mejoran la funcionalidad del sitio web recordando tus elecciones y preferencias para 
                proporcionarte una experiencia más personalizada.
              </p>
              <div className="text-sm text-gray-600">
                <strong>Ejemplos:</strong> Preferencias de vista, configuraciones personalizadas, recordar formularios
              </div>
            </div>
            <div className="ml-6">
              <button
                onClick={() => handlePreferenceChange('functional')}
                className={`w-14 h-8 rounded-full flex items-center transition-all duration-200 ${
                  localPreferences.functional 
                    ? 'bg-blue-600 justify-end' 
                    : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Restablecer a Solo Esenciales
        </button>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Información Adicional</h4>
        <p className="text-blue-800 text-sm mb-3">
          Puedes cambiar estas preferencias en cualquier momento. Para más información sobre cómo utilizamos las cookies, 
          consulta nuestra política de cookies completa.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link 
            href="/cookies" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Política de Cookies
          </Link>
          <Link 
            href="/privacy" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Política de Privacidad
          </Link>
          <Link 
            href="/contact" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
}