'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  TrendingUp, 
  Eye, 
  Calendar,
  Users,
  MapPin,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ViewData {
  date: string;
  views: number;
}

interface ReferrerData {
  referrer: string;
  count: number;
}

interface GeographicData {
  country?: string;
  views: number;
}

export default function AnalyticsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Analytics data
  const [totalViews, setTotalViews] = useState(0);
  const [viewsToday, setViewsToday] = useState(0);
  const [averageDailyViews, setAverageDailyViews] = useState(0);
  const [viewTrend, setViewTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [dailyViews, setDailyViews] = useState<ViewData[]>([]);
  const [topReferrers, setTopReferrers] = useState<ReferrerData[]>([]);
  const [peakHours, setPeakHours] = useState<{hour: number, views: number}[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Get user's business
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', session.user.id)
        .single();

      if (!businesses) return;
      
      setBusinessId(businesses.id);

      // Calculate date range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get all views for the time range
      const { data: views } = await supabase
        .from('business_views')
        .select('*')
        .eq('business_id', businesses.id)
        .gte('viewed_at', startDate.toISOString())
        .order('viewed_at', { ascending: true });

      if (views) {
        // Total views
        setTotalViews(views.length);

        // Views today
        const todayViews = views.filter(v => 
          new Date(v.viewed_at || '') >= today
        ).length;
        setViewsToday(todayViews);

        // Views yesterday for trend
        const yesterdayViews = views.filter(v => {
          const viewDate = new Date(v.viewed_at || '');
          return viewDate >= yesterday && viewDate < today;
        }).length;

        // Calculate trend
        if (todayViews > yesterdayViews) setViewTrend('up');
        else if (todayViews < yesterdayViews) setViewTrend('down');
        else setViewTrend('neutral');

        // Average daily views
        setAverageDailyViews(Math.round(views.length / days));

        // Daily views aggregation
        const dailyData: Record<string, number> = {};
        views.forEach(view => {
          const date = new Date(view.viewed_at || '').toLocaleDateString('en-CA'); // YYYY-MM-DD format
          dailyData[date] = (dailyData[date] || 0) + 1;
        });

        const dailyViewsArray: ViewData[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-CA');
          dailyViewsArray.push({
            date: dateStr,
            views: dailyData[dateStr] || 0
          });
        }
        setDailyViews(dailyViewsArray);

        // Top referrers
        const referrerCounts: Record<string, number> = {};
        views.forEach(view => {
          const referrer = view.referrer || 'Direct';
          const domain = referrer === 'Direct' ? 'Direct' : 
            referrer.includes('google') ? 'Google' :
            referrer.includes('facebook') ? 'Facebook' :
            referrer.includes('instagram') ? 'Instagram' :
            referrer.includes('whatsapp') ? 'WhatsApp' :
            'Other';
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        });

        const referrersArray = Object.entries(referrerCounts)
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopReferrers(referrersArray);

        // Peak hours analysis
        const hourCounts: Record<number, number> = {};
        views.forEach(view => {
          const hour = new Date(view.viewed_at || '').getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const peakHoursArray = Object.entries(hourCounts)
          .map(([hour, views]) => ({ hour: parseInt(hour), views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        setPeakHours(peakHoursArray);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  const getMaxViews = () => {
    return Math.max(...dailyViews.map(d => d.views), 1);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Analiza el rendimiento de tu negocio
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Período:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vistas</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            En los últimos {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} días
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vistas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{viewsToday}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp 
              className={`h-4 w-4 mr-1 ${
                viewTrend === 'up' ? 'text-green-600' : 
                viewTrend === 'down' ? 'text-red-600' : 
                'text-gray-400'
              }`} 
            />
            <span className={`text-sm ${
              viewTrend === 'up' ? 'text-green-600' : 
              viewTrend === 'down' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              vs ayer
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio Diario</p>
              <p className="text-2xl font-bold text-gray-900">{averageDailyViews}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">vistas por día</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pico de Actividad</p>
              <p className="text-2xl font-bold text-gray-900">
                {peakHours.length > 0 ? formatHour(peakHours[0].hour) : '--'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {peakHours.length > 0 ? `${peakHours[0].views} vistas` : 'Sin datos'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vistas Diarias</h3>
          <div className="space-y-2">
            {dailyViews.map((day, index) => (
              <div key={day.date} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">
                  {new Date(day.date).toLocaleDateString('es-CO', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(day.views / getMaxViews()) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {day.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Tráfico</h3>
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div key={referrer.referrer} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-green-600' :
                    index === 2 ? 'bg-purple-600' :
                    index === 3 ? 'bg-orange-600' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">
                    {referrer.referrer}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {referrer.count}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({Math.round((referrer.count / totalViews) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
            {topReferrers.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay datos de referrers disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios de Mayor Actividad</h3>
        
        {peakHours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {peakHours.map((hour, index) => (
              <div key={hour.hour} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold mb-2 ${
                  index === 0 ? 'bg-blue-600' :
                  index === 1 ? 'bg-green-600' :
                  index === 2 ? 'bg-purple-600' :
                  index === 3 ? 'bg-orange-600' :
                  'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <p className="font-semibold text-gray-900">{formatHour(hour.hour)}</p>
                <p className="text-sm text-gray-600">{hour.views} vistas</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No hay suficientes datos para mostrar horarios de actividad
          </p>
        )}
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Insights y Recomendaciones</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">📈 Rendimiento</h4>
            <p className="text-blue-100 text-sm">
              {totalViews > 0 
                ? `Tu negocio ha recibido ${totalViews} vistas en los últimos ${timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} días. ${
                    averageDailyViews > 5 
                      ? 'Excelente rendimiento!' 
                      : averageDailyViews > 2 
                        ? 'Buen rendimiento, pero hay potencial de mejora.'
                        : 'Considera optimizar tu perfil para atraer más visitantes.'
                  }`
                : 'Aún no tienes suficientes datos. Sigue promocionando tu negocio.'
              }
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">⏰ Mejor Momento</h4>
            <p className="text-blue-100 text-sm">
              {peakHours.length > 0 
                ? `La mayoría de tus visitantes están activos a las ${formatHour(peakHours[0].hour)}. Considera promocionar tu negocio en estos horarios.`
                : 'Necesitas más datos para identificar los mejores horarios.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}