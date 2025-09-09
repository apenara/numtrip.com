'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  CheckCircle, 
  Mail, 
  MapPin,
  Phone,
  Search
} from 'lucide-react';

export default function ClaimBusinessPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(`/${locale}/claim-business`);
        router.push(`/${locale}/auth/login?returnUrl=${returnUrl}`);
        return;
      }

      setUser(session.user);

      // Check if user already has a claimed business
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', session.user.id)
        .single();

      if (existingBusiness) {
        // User already has a business, redirect to admin
        router.push(`/${locale}/admin/dashboard`);
        return;
      }

    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`)
        .is('owner_id', null) // Only unclaimed businesses
        .limit(10);

      setBusinesses(data || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClaim = async (businessId: string) => {
    if (!user) return;
    
    setClaiming(businessId);
    try {
      // Update business with owner_id
      const { error } = await supabase
        .from('businesses')
        .update({ 
          owner_id: user.id,
          claimed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) throw error;

      // Create user profile if doesn't exist
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString()
        });

      // Redirect to admin dashboard
      router.push(`/${locale}/admin/dashboard`);
    } catch (error) {
      console.error('Claim failed:', error);
      alert('Error al reclamar el negocio. Inténtalo de nuevo.');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">NumTrip</span>
            </Link>
            <div className="text-sm text-gray-600">
              Conectado como {user?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reclama tu Negocio
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Toma control de tu listing y accede al panel de administración para gestionar 
            tu información, ver estadísticas y crear códigos promocionales.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Busca tu Negocio
          </h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Nombre del negocio, dirección, etc..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              {searching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Buscar
                </>
              )}
            </button>
          </div>

          {/* Search Results */}
          {businesses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Resultados de Búsqueda ({businesses.length})
              </h3>
              
              {businesses.map((business) => (
                <div 
                  key={business.id} 
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {business.name}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {business.category === 'HOTEL' ? 'Hotel' :
                           business.category === 'RESTAURANT' ? 'Restaurante' :
                           business.category === 'TOUR' ? 'Tour' :
                           business.category === 'TRANSPORT' ? 'Transporte' :
                           business.category === 'ATTRACTION' ? 'Atracción' : 'Otro'}
                        </span>
                        {business.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </span>
                        )}
                      </div>
                      
                      {business.address && (
                        <p className="text-gray-600 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {business.address}
                        </p>
                      )}
                      
                      {business.description && (
                        <p className="text-gray-600 text-sm">
                          {business.description}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleClaim(business.id)}
                      disabled={claiming === business.id}
                      className="ml-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
                    >
                      {claiming === business.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          Reclamar
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {businesses.length === 0 && searchQuery && !searching && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 mb-6">
                No encontramos negocios que coincidan con tu búsqueda.
              </p>
              <Link 
                href={`/${locale}/add-business`}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Agregar mi Negocio
              </Link>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Panel de Control
            </h3>
            <p className="text-gray-600 text-sm">
              Accede a un dashboard completo para gestionar tu negocio
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verificación
            </h3>
            <p className="text-gray-600 text-sm">
              Verifica tu negocio para generar más confianza en los clientes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contactos
            </h3>
            <p className="text-gray-600 text-sm">
              Mantén actualizada tu información de contacto y promociones
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                ¿No encuentras tu negocio?
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Si no encuentras tu negocio en los resultados, puedes agregarlo manualmente 
                o contactarnos para que lo incluyamos en la plataforma.
              </p>
              <div className="flex gap-3">
                <Link 
                  href={`/${locale}/add-business`}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Agregar Negocio
                </Link>
                <Link 
                  href={`/${locale}/contact`}
                  className="inline-flex items-center px-3 py-2 bg-white hover:bg-gray-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-200 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contactar Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}