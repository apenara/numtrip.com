'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  AlertCircle, 
  BarChart3, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Edit, 
  Eye, 
  Gift, 
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Shield,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

interface Business {
  id: string;
  name: string;
  category: string;
  verified: boolean;
  phone?: string;
  email?: string;
  whatsapp?: string;
  claimedAt?: string;
  ownerId?: string;
}

interface BusinessAnalytics {
  businessId: string;
  businessName: string;
  verified: boolean;
  claimedAt?: string;
  validationStats: {
    total: number;
    positive: number;
    negative: number;
    percentage: number;
    byMonth: Record<string, number>;
  };
  promoCodeStats: {
    total: number;
    active: number;
    totalUsage: number;
  };
  engagement: {
    profileViews: number;
    contactClicks: number;
  };
}

interface BusinessClaim {
  id: string;
  businessId: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  business: {
    name: string;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, BusinessAnalytics>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No access token available');
      }

      // Fetch user's businesses
      const businessResponse = await fetch('/api/v1/claims/user/businesses', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        setBusinesses(businessData);

        // Fetch analytics for each business
        const analyticsPromises = businessData.map(async (business: Business) => {
          try {
            const analyticsResponse = await fetch(`/api/v1/businesses/${business.id}/analytics`, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
              },
            });

            if (analyticsResponse.ok) {
              const analyticsData = await analyticsResponse.json();
              return { [business.id]: analyticsData };
            }
          } catch (error) {
            console.error(`Failed to fetch analytics for business ${business.id}:`, error);
          }
          return null;
        });

        const analyticsResults = await Promise.all(analyticsPromises);
        const analyticsMap = analyticsResults.reduce((acc, result) => {
          if (result) {
            return { ...acc, ...result };
          }
          return acc;
        }, {});

        setAnalytics(analyticsMap);
      }

      // Fetch user's claims
      const claimsResponse = await fetch('/api/v1/claims/user', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json();
        setClaims(claimsData);
      }

    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Link href="/business/create" className="btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Business
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Pending Claims Alert */}
          {claims.filter(claim => claim.status === 'PENDING' || claim.status === 'VERIFIED').length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    Reclamos Pendientes
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Tienes {claims.filter(claim => claim.status === 'PENDING' || claim.status === 'VERIFIED').length} reclamos en proceso de verificación.
                  </p>
                  <div className="space-y-1">
                    {claims
                      .filter(claim => claim.status === 'PENDING' || claim.status === 'VERIFIED')
                      .slice(0, 3)
                      .map(claim => (
                        <div key={claim.id} className="text-xs text-blue-600">
                          • {claim.business.name} - {claim.status === 'PENDING' ? 'Verificación pendiente' : 'Esperando aprobación'}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{businesses.length}</h3>
              <p className="text-sm text-gray-600">Negocios Propios</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Object.values(analytics).reduce((sum, a) => sum + a.engagement.profileViews, 0)}
              </h3>
              <p className="text-sm text-gray-600">Vistas Totales</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Object.values(analytics).reduce((sum, a) => sum + a.validationStats.total, 0)}
              </h3>
              <p className="text-sm text-gray-600">Validaciones</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500">Activos</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {Object.values(analytics).reduce((sum, a) => sum + a.promoCodeStats.active, 0)}
              </h3>
              <p className="text-sm text-gray-600">Códigos Promocionales</p>
            </div>
          </div>

          {/* Businesses List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Mis Negocios</h2>
                <Link href="/search" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Buscar más negocios →
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Cargando tus negocios...</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="p-12 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no tienes negocios</h3>
                <p className="text-gray-600 mb-6">
                  Reclama la propiedad de tu negocio para acceder al panel de administración
                </p>
                <Link href="/search" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Shield className="h-4 w-4" />
                  Buscar y Reclamar Negocio
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {businesses.map((business) => {
                  const businessAnalytics = analytics[business.id];
                  const getCategoryColor = (category: string) => {
                    const colors: Record<string, string> = {
                      HOTEL: 'bg-blue-100 text-blue-800',
                      TOUR: 'bg-green-100 text-green-800',
                      TRANSPORT: 'bg-purple-100 text-purple-800',
                      RESTAURANT: 'bg-orange-100 text-orange-800',
                      ATTRACTION: 'bg-pink-100 text-pink-800',
                      OTHER: 'bg-gray-100 text-gray-800',
                    };
                    return colors[category] || colors.OTHER;
                  };

                  return (
                    <div key={business.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                            {business.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3" />
                                Verificado
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
                              {business.category}
                            </span>
                            {business.claimedAt && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Shield className="h-3 w-3" />
                                Propietario
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {businessAnalytics?.engagement.profileViews || 0} vistas
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {businessAnalytics?.validationStats.total || 0} validaciones
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Gift className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {businessAnalytics?.promoCodeStats.active || 0} códigos activos
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                {businessAnalytics?.validationStats.percentage || 0}% positivas
                              </span>
                            </div>
                          </div>

                          {businessAnalytics && (
                            <div className="bg-gray-50 rounded-md p-3 mb-3">
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="font-medium text-gray-900">Validaciones:</span>
                                  <span className="ml-1 text-green-600">
                                    +{businessAnalytics.validationStats.positive}
                                  </span>
                                  <span className="ml-1 text-red-600">
                                    -{businessAnalytics.validationStats.negative}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">Uso de códigos:</span>
                                  <span className="ml-1 text-blue-600">
                                    {businessAnalytics.promoCodeStats.totalUsage} veces
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            {business.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{business.phone}</span>
                              </div>
                            )}
                            {business.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{business.email}</span>
                              </div>
                            )}
                            {business.whatsapp && (
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{business.whatsapp}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Link 
                            href={`/dashboard/business/${business.id}/settings`}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </Link>
                          <Link 
                            href={`/dashboard/business/${business.id}/analytics`}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Estadísticas
                          </Link>
                          <Link 
                            href={`/dashboard/business/${business.id}/promo-codes`}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                          >
                            <Gift className="h-4 w-4" />
                            Promociones
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}