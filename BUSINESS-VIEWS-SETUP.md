# 📊 Business Views Tracking System

Sistema completo de tracking de vistas para perfiles de negocios con analytics y rate limiting.

## 🚀 Setup Rápido

### 1. Ejecutar Migración en Supabase

1. Ve a tu **Supabase Dashboard** → **SQL Editor**
2. Ejecuta el contenido del archivo `supabase-migration-business-views.sql`
3. Verifica que se crearon correctamente:
   - Tabla `business_views`
   - Funciones `get_most_viewed_businesses()` y `record_business_view()`
   - Vista `business_view_stats`
   - Policies de RLS

### 2. Actualizar Tipos TypeScript (Opcional)

```bash
# Actualizar tipos desde Supabase
cd apps/web
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

## 🔧 Características Implementadas

### ✅ **Tracking Automático**
- **Auto-tracking** en páginas de negocio via `useBusinessView()` hook
- **Rate limiting** de 1 hora por IP por negocio (evita spam)
- **Datos capturados**: IP, User Agent, Referrer, Timestamp

### ✅ **Analytics Avanzados**
- **Función SQL optimizada** para obtener negocios más vistos
- **Filtros temporales**: últimos 7, 30, 90 días
- **Fallback inteligente** a negocios verificados cuando no hay data
- **Vista agregada** con estadísticas por negocio

### ✅ **Componentes UI**
- **PopularBusinesses**: Componente para mostrar top negocios
- **Diseño responsive** con ranking, contadores de vistas
- **Estados de loading** y error handling
- **Integrado en homepage**

### ✅ **Performance Optimizado**
- **Queries optimizados** con índices en tabla views
- **Caché en TanStack Query** (5min stale time)
- **Lazy loading** y error boundaries
- **Minimal overhead** en tracking

## 📋 Uso del Sistema

### Tracking de Vistas

```tsx
// Automático en páginas de negocio
import { useBusinessView } from '@/hooks/useBusinessViews';

function BusinessPage({ businessId }: { businessId: string }) {
  // Registra vista automáticamente
  useBusinessView(businessId);
  
  return <div>Business content...</div>;
}
```

### Mostrar Negocios Populares

```tsx
import { PopularBusinesses } from '@/components/business/PopularBusinesses';

function Homepage() {
  return (
    <div>
      <PopularBusinesses 
        limit={6}           // Número de negocios
        daysBack={30}       // Días hacia atrás
        showTitle={true}    // Mostrar título
      />
    </div>
  );
}
```

### Analytics Programáticos

```tsx
import { useMostViewedBusinesses } from '@/hooks/useBusinessViews';

function Analytics() {
  const { data: businesses, isLoading } = useMostViewedBusinesses({
    limit: 10,
    daysBack: 7
  });

  return (
    <div>
      {businesses?.map(business => (
        <div key={business.id}>
          {business.name} - {business.viewCount} views
        </div>
      ))}
    </div>
  );
}
```

## 🗄️ Estructura de Base de Datos

### Tabla `business_views`
```sql
- id: UUID (PK)
- business_id: UUID (FK to businesses)  
- viewer_ip: INET
- user_agent: TEXT
- referrer: TEXT  
- viewed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

### Función `get_most_viewed_businesses()`
```sql
get_most_viewed_businesses(
  limit_count INTEGER DEFAULT 10,
  days_back INTEGER DEFAULT 30  
)
-- Retorna: business_id, view_count, name, category, city_name, verified, etc.
```

### Vista `business_view_stats`
```sql
-- Estadísticas agregadas por negocio
- business_id, name, category, verified
- total_views, views_last_7_days, views_last_30_days  
- last_viewed_at, first_viewed_at
```

## 🔐 Seguridad y Privacy

### Rate Limiting
- **1 vista por IP por negocio por hora**
- Previene spam y manipulación de rankings
- Se permite 1 vista legítima cada hora por usuario

### Row Level Security (RLS)
- **Lectura pública**: Cualquiera puede ver estadísticas
- **Escritura pública**: Cualquiera puede registrar vistas
- **Modificación restringida**: Solo usuarios autenticados

### Datos Anonimizados  
- Solo se almacena IP (para rate limiting)
- No se vincula con usuarios específicos
- User agent para analytics básicos solamente

## 📈 Fallbacks y Robustez

### Cuando no hay datos de vistas:
1. **Fallback automático** a negocios verificados recientes
2. **Mensaje informativo** explicando que se necesita más tiempo
3. **No rompe la UI** si no hay data

### Error Handling:
- **Silencioso**: errores de tracking no afectan UX
- **Logs informativos** para debugging
- **Retry automático** en TanStack Query

## 🚀 Deploy y Producción

### Consideraciones
- **IP real**: Funciona correctamente con Vercel/Cloudflare
- **Performance**: Queries optimizados para alta escala
- **Caché**: 5min stale time reduce carga en Supabase
- **Monitoring**: Logs en Supabase Dashboard

### Variables de Entorno
No requiere variables adicionales, usa la configuración existente de Supabase.

## 🔧 Troubleshooting

### No se registran vistas
1. Verificar que la migración SQL se ejecutó correctamente
2. Comprobar policies de RLS en Supabase Dashboard
3. Verificar que `/api/get-client-ip` funciona

### No aparecen negocios populares  
1. Verificar que existen vistas en la tabla `business_views`
2. Ajustar `daysBack` a un período más amplio
3. Comprobar que hay negocios verificados para fallback

### Performance lenta
1. Verificar que los índices se crearon correctamente
2. Considerar aumentar `staleTime` en queries
3. Reducir `limit` en componentes

## 💡 Extensiones Futuras

- **Geolocalización**: Tracking por región/ciudad
- **Páginas analíticas**: Dashboard completo para business owners  
- **A/B Testing**: Diferentes formas de mostrar negocios populares
- **Trending**: Negocios con más crecimiento reciente
- **Segmentación**: Popularidad por categoría

---

**¡El sistema está listo para usar!** Solo ejecuta la migración SQL y los negocios más visitados aparecerán automáticamente en la homepage. 🎉