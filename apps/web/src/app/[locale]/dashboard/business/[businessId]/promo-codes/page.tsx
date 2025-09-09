'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Gift,
  Info,
  Loader2,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
// Using standard HTML button with Tailwind classes

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: string;
  validUntil?: string;
  active: boolean;
  usageCount: number;
  maxUsage?: number;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePromoCodeData {
  code: string;
  description: string;
  discount: string;
  validUntil?: string;
  maxUsage?: number;
}

export default function PromoCodesPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const businessId = params.businessId as string;

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [businessName, setBusinessName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user && businessId) {
      fetchPromoCodes();
    }
  }, [user, businessId]);

  const fetchPromoCodes = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      // Fetch business info first
      const businessResponse = await fetch(`/api/v1/businesses/${businessId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (businessResponse.ok) {
        const business = await businessResponse.json();
        setBusinessName(business.name);
      }

      // Fetch promo codes
      const response = await fetch(`/api/v1/businesses/${businessId}/promo-codes`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch promo codes');
      }

      const promoCodesData = await response.json();
      setPromoCodes(promoCodesData);

    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
      setError(error instanceof Error ? error.message : 'Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess(`Código "${text}" copiado al portapapeles`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando códigos promocionales...</p>
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    Códigos Promocionales
                  </h1>
                  <p className="text-sm text-gray-500">
                    {businessName}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Crear Código
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{promoCodes.length}</h3>
              <p className="text-sm text-gray-600">Total Códigos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {promoCodes.filter(p => p.active && !isExpired(p.validUntil)).length}
              </h3>
              <p className="text-sm text-gray-600">Códigos Activos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {promoCodes.reduce((sum, p) => sum + p.usageCount, 0)}
              </h3>
              <p className="text-sm text-gray-600">Total Usos</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {promoCodes.length > 0 ? Math.round(promoCodes.reduce((sum, p) => sum + p.usageCount, 0) / promoCodes.length) : 0}
              </h3>
              <p className="text-sm text-gray-600">Promedio Usos</p>
            </div>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <CreatePromoCodeForm
              businessId={businessId}
              onSuccess={(newPromoCode) => {
                setPromoCodes(prev => [newPromoCode, ...prev]);
                setShowCreateForm(false);
                setSuccess('Código promocional creado exitosamente');
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* Promo Codes List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mis Códigos Promocionales</h2>
            </div>

            {promoCodes.length === 0 ? (
              <div className="p-12 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aún no tienes códigos promocionales
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea códigos de descuento para atraer más clientes a tu negocio
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear Primer Código
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {promoCodes.map((promoCode) => (
                  <PromoCodeItem
                    key={promoCode.id}
                    promoCode={promoCode}
                    onCopy={() => copyToClipboard(promoCode.code)}
                    onToggleActive={(id, active) => {
                      setPromoCodes(prev => 
                        prev.map(p => p.id === id ? { ...p, active } : p)
                      );
                    }}
                    onDelete={(id) => {
                      setPromoCodes(prev => prev.filter(p => p.id !== id));
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-1">Consejos para códigos efectivos:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Usa códigos memorables y fáciles de escribir</li>
                  <li>• Establece fechas de vencimiento para crear urgencia</li>
                  <li>• Limita el número de usos para mantener exclusividad</li>
                  <li>• Promociona tus códigos en redes sociales y tu sitio web</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

interface CreatePromoCodeFormProps {
  businessId: string;
  onSuccess: (promoCode: PromoCode) => void;
  onCancel: () => void;
}

function CreatePromoCodeForm({ businessId, onSuccess, onCancel }: CreatePromoCodeFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<CreatePromoCodeData>({
    code: '',
    description: '',
    discount: '',
    validUntil: '',
    maxUsage: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim() || !formData.description.trim() || !formData.discount.trim()) {
      setError('Código, descripción y descuento son requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`/api/v1/businesses/${businessId}/promo-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim(),
          discount: formData.discount.trim(),
          validUntil: formData.validUntil || undefined,
          maxUsage: formData.maxUsage || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create promo code');
      }

      const newPromoCode = await response.json();
      onSuccess(newPromoCode);

    } catch (error) {
      console.error('Failed to create promo code:', error);
      setError(error instanceof Error ? error.message : 'Failed to create promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Código Promocional</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="DESCUENTO20"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descuento *
            </label>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="20%, $50000, Gratis upgrade"
              maxLength={50}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe en qué consiste el descuento..."
            rows={3}
            maxLength={200}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Válido hasta (opcional)
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de usos (opcional)
            </label>
            <input
              type="number"
              value={formData.maxUsage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ilimitado"
              min="1"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear Código
          </button>
        </div>
      </form>
    </div>
  );
}

interface PromoCodeItemProps {
  promoCode: PromoCode;
  onCopy: () => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

function PromoCodeItem({ promoCode, onCopy, onToggleActive, onDelete }: PromoCodeItemProps) {
  const [showActions, setShowActions] = useState(false);
  const expired = promoCode.validUntil ? new Date(promoCode.validUntil) < new Date() : false;
  const usagePercentage = promoCode.maxUsage 
    ? Math.round((promoCode.usageCount / promoCode.maxUsage) * 100)
    : 0;

  const getStatusColor = () => {
    if (expired) return 'bg-gray-100 text-gray-600';
    if (!promoCode.active) return 'bg-red-100 text-red-600';
    return 'bg-green-100 text-green-600';
  };

  const getStatusText = () => {
    if (expired) return 'Expirado';
    if (!promoCode.active) return 'Inactivo';
    return 'Activo';
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onCopy}
              className="flex items-center gap-2 group"
            >
              <h3 className="text-lg font-bold text-gray-900 font-mono">
                {promoCode.code}
              </h3>
              <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </button>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            
            {promoCode.maxUsage && (
              <span className="text-xs text-gray-500">
                {promoCode.usageCount}/{promoCode.maxUsage} usos
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-2">{promoCode.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              <span>{promoCode.discount}</span>
            </div>
            
            {promoCode.validUntil && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Hasta {new Date(promoCode.validUntil).toLocaleDateString('es-CO')}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{promoCode.usageCount} usos</span>
            </div>
          </div>

          {promoCode.maxUsage && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso de uso</span>
                <span>{usagePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    usagePercentage >= 100 ? 'bg-red-500' : usagePercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!expired && (
            <button
              onClick={() => onToggleActive(promoCode.id, !promoCode.active)}
              className={`p-2 rounded-lg transition-colors ${
                promoCode.active
                  ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {promoCode.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          
          <button
            onClick={() => onDelete(promoCode.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}