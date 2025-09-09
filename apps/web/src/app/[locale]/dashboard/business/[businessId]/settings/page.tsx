'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  AlertCircle, 
  ArrowLeft, 
  Building, 
  Camera, 
  CheckCircle,
  Globe,
  Info,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
// Using standard HTML button with Tailwind classes

interface BusinessData {
  id: string;
  name: string;
  description?: string;
  category: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  city: string;
  verified: boolean;
  claimedAt?: string;
}

interface FormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  address: string;
}

export default function BusinessSettingsPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user && businessId) {
      fetchBusiness();
    }
  }, [user, businessId]);

  const fetchBusiness = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/businesses/${businessId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }

      const businessData = await response.json();
      setBusiness(businessData);
      
      // Populate form with current business data
      setFormData({
        name: businessData.name || '',
        description: businessData.description || '',
        phone: businessData.phone || '',
        email: businessData.email || '',
        whatsapp: businessData.whatsapp || '',
        website: businessData.website || '',
        address: businessData.address || '',
      });

    } catch (error) {
      console.error('Failed to fetch business:', error);
      setError(error instanceof Error ? error.message : 'Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccess(null); // Clear success message on change
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'El nombre del negocio es requerido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'El email debe tener un formato válido';
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      return 'El sitio web debe comenzar con http:// o https://';
    }
    
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user || !business) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          whatsapp: formData.whatsapp.trim() || undefined,
          website: formData.website.trim() || undefined,
          address: formData.address.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business');
      }

      const updatedBusiness = await response.json();
      setBusiness(updatedBusiness);
      setSuccess('Información del negocio actualizada exitosamente');

    } catch (error) {
      console.error('Failed to update business:', error);
      setError(error instanceof Error ? error.message : 'Failed to update business');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      HOTEL: 'Hotel',
      TOUR: 'Tour',
      TRANSPORT: 'Transporte',
      RESTAURANT: 'Restaurante',
      ATTRACTION: 'Atracción',
      OTHER: 'Otro',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando configuración del negocio...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!business) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Negocio no encontrado</h3>
            <p className="text-gray-600 mb-4">
              No se pudo encontrar el negocio o no tienes permisos para editarlo.
            </p>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Volver al dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Configurar {business.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Gestiona la información de tu negocio
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{getCategoryLabel(business.category)}</span>
                {business.verified && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Información del Negocio</h2>
              <p className="text-sm text-gray-600 mt-1">
                Actualiza la información básica de tu negocio
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre completo del negocio"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe tu negocio y servicios..."
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contacto@negocio.com"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="h-4 w-4 inline mr-1" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.negocio.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dirección completa del negocio"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ciudad: {business.city}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-1" />
                  Los cambios se reflejarán inmediatamente en tu perfil público
                </div>
                
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                  
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-1">Consejos para optimizar tu perfil:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Mantén tu información de contacto actualizada</li>
                  <li>• Agrega una descripción atractiva que resalte tus servicios</li>
                  <li>• Incluye todos los medios de contacto disponibles</li>
                  <li>• Verifica que tu dirección sea exacta y fácil de encontrar</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}