'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Eye, 
  Phone, 
  Mail, 
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';

export default function AdminDashboardPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<any>(null);
  const [stats, setStats] = useState({
    totalViews: 0,
    viewsLast7Days: 0,
    viewsLast30Days: 0,
    validationRate: 0,
    totalValidations: 0,
    contactsCount: 0,
    verifiedContactsCount: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user's business
      const { data: businesses } = await supabase
        .from('businesses')
        .select(`
          *,
          contacts (*)
        `)
        .eq('owner_id', session.user.id)
        .single();

      if (!businesses) {
        router.push(`/${locale}/claim-business`);
        return;
      }

      setBusiness(businesses);

      // Get view stats
      const { data: viewStats } = await supabase
        .from('business_view_stats')
        .select('*')
        .eq('business_id', businesses.id)
        .single();

      // Get validation stats
      const { data: validations } = await supabase
        .from('validations')
        .select('is_correct')
        .eq('business_id', businesses.id);

      // Calculate stats
      const totalValidations = validations?.length || 0;
      const positiveValidations = validations?.filter((v: any) => v.is_correct).length || 0;
      const validationRate = totalValidations > 0 
        ? Math.round((positiveValidations / totalValidations) * 100) 
        : 0;

      const contactsCount = businesses.contacts?.length || 0;
      const verifiedContactsCount = businesses.contacts?.filter((c: any) => c.verified).length || 0;

      setStats({
        totalViews: viewStats?.total_views || 0,
        viewsLast7Days: viewStats?.views_last_7_days || 0,
        viewsLast30Days: viewStats?.views_last_30_days || 0,
        validationRate,
        totalValidations,
        contactsCount,
        verifiedContactsCount
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-600 mt-2">
          Resumen del rendimiento de tu negocio
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vistas Totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Últimos 7 días: {stats.viewsLast7Days}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Validaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalValidations}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.validationRate}% positivas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contactos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.contactsCount}</p>
            </div>
            <Phone className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.verifiedContactsCount} verificados
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-lg font-bold text-gray-900">
                {business?.verified ? 'Verificado' : 'Pendiente'}
              </p>
            </div>
            {business?.verified ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Calendar className="h-8 w-8 text-orange-600" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {business?.verified ? 'Tu negocio está verificado' : 'Completa la verificación'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button 
              onClick={() => router.push(`/${locale}/admin/business`)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Actualizar Contactos</p>
                  <p className="text-sm text-gray-600">Mantén tu información actualizada</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push(`/${locale}/admin/promo-codes`)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Códigos Promocionales</p>
                  <p className="text-sm text-gray-600">Crea ofertas para tus clientes</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => router.push(`/${locale}/admin/analytics`)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ver Analytics</p>
                  <p className="text-sm text-gray-600">Analiza el rendimiento detallado</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Negocio</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium text-gray-900">{business?.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Categoría:</span>
              <span className="font-medium text-gray-900">
                {business?.category === 'HOTEL' ? 'Hotel' :
                 business?.category === 'RESTAURANT' ? 'Restaurante' :
                 business?.category === 'TOUR' ? 'Tour' :
                 business?.category === 'TRANSPORT' ? 'Transporte' :
                 business?.category === 'ATTRACTION' ? 'Atracción' : 'Otro'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Estado:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ 
                business?.verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {business?.verified ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </>
                ) : (
                  'Sin verificar'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Reclamado:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                business?.claimed 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {business?.claimed ? 'Sí' : 'No'}
              </span>
            </div>
          </div>

          {!business?.verified && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">¡Verifica tu negocio!</h3>
              <p className="text-sm text-blue-700 mb-3">
                Los negocios verificados obtienen más confianza de los clientes y mejores resultados.
              </p>
              <button 
                onClick={() => router.push(`/${locale}/admin/settings`)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Verificar Ahora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}