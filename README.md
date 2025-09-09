# NumTrip - Plataforma de Contactos Verificados para Turismo

Una plataforma global donde los viajeros pueden encontrar números de contacto, correos y WhatsApp verificados de hoteles, agencias de tours y transporte.

## 🚀 Características

- **Búsqueda y filtrado avanzado** de negocios turísticos
- **Páginas de negocio detalladas** con navegación completa y breadcrumbs
- **Recomendaciones inteligentes** de negocios similares por categoría
- **Verificación comunitaria** de información de contacto
- **Sistema de reclamación de perfiles** para empresarios
- **Códigos promocionales** exclusivos
- **Monetización con Google AdSense** (compliance 2025)
- **Soporte multi-idioma** (Español/Inglés)
- **Sistema de autenticación** completo con Supabase
- **Arquitectura moderna** con Next.js y Supabase

## 📈 Estado Actual (v1.3.0)

### ✅ Completado
- ✅ **Infraestructura del proyecto** - Monorepo con Turborepo
- ✅ **Frontend básico** - Páginas principales y componentes UI
- ✅ **Backend Supabase** - Base de datos y APIs directas
- ✅ **Base de datos** - Schema completo en Supabase
- ✅ **Sistema de autenticación** - Supabase + JWT completo
- ✅ **Login/Register** - Páginas con validación y OAuth
- ✅ **Dashboard** - Área protegida para usuarios
- ✅ **Middleware** - Protección de rutas y manejo de auth
- ✅ **Páginas de negocio** - Perfiles detallados con navegación completa
- ✅ **Header y navegación** - Botón de retroceso y búsqueda integrada
- ✅ **Breadcrumbs** - Navegación contextual de negocios
- ✅ **Negocios similares** - Recomendaciones por categoría y ciudad
- ✅ **Google AdSense** - Integración completa con compliance 2025
- ✅ **Sistema de anuncios** - Monetización estratégica para negocios no verificados
- ✅ **Sistema de validación comunitaria** - Validación interactiva con gamificación
- ✅ **Sistema de gamificación** - Puntos, niveles y logros para usuarios
- ✅ **Sistema de reclamación de negocios (Business Claiming)** - Verificación empresarial completa
- ✅ **Autenticación mock para desarrollo** - Sistema de testing sin configuración Supabase
- ✅ **Dashboard empresarial completo (Business Management Dashboard)** - Panel de gestión post-claim

### 🚧 En Progreso / Próximo
- ⏳ **Google Places API** - Carga inicial de datos de Cartagena
- ⏳ **Producción** - Deploy y configuración live

## 🏗️ Arquitectura

Este proyecto utiliza un monorepo con las siguientes aplicaciones y paquetes:

```
numtrip/
├── apps/
│   └── web/          # Frontend Next.js 14 con App Router + Supabase
├── packages/
│   ├── ui/           # Componentes UI compartidos (opcional)
│   ├── types/        # Tipos TypeScript compartidos
│   └── utils/        # Utilidades compartidas
└── tools/            # Scripts y herramientas
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes base
- **TanStack Query** para data fetching
- **Zustand** para estado global
- **next-intl** para internacionalización
- **Supabase** para autenticación

### Backend
- **Supabase** como BaaS completo (Backend as a Service)
- **PostgreSQL** (hosted en Supabase)
- **Supabase Auth** para autenticación completa
- **Supabase Realtime** para actualizaciones en tiempo real
- **Row Level Security (RLS)** para seguridad de datos

### Infraestructura
- **Vercel** para frontend hosting
- **Supabase** para backend completo (base de datos, auth, storage, edge functions)
- **Cloudflare CDN** (integrado con Vercel)

## 📋 Prerrequisitos

- Node.js 20.x o superior
- pnpm 9.x o superior
- Cuenta de Supabase (para desarrollo y producción)

## ⚡ Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd contactos-turisticos
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones de Supabase y base de datos
   ```

4. **Configurar Supabase**
   - Crear proyecto en [supabase.com](https://supabase.com)
   - Copiar URL del proyecto y Anon Key al .env
   - Ejecutar las migraciones SQL en Supabase SQL Editor
   - Habilitar autenticación por email en el dashboard
   - (Opcional) Configurar proveedores OAuth (Google, GitHub)
   - Configurar Row Level Security (RLS) policies

5. **Configurar base de datos**
   ```bash
   # Ir al directorio web
   cd apps/web
   
   # Generar tipos de Supabase
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
   ```

6. **Iniciar aplicación en modo desarrollo**
   ```bash
   # Desde la raíz del proyecto
   pnpm dev
   ```

   Esto iniciará:
   - Frontend en http://localhost:3000
   - Conexión automática con Supabase (remoto)

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev           # Inicia todas las apps en modo desarrollo
pnpm build         # Construye todas las apps para producción
pnpm start         # Inicia apps en modo producción

# Calidad de código
pnpm lint          # Ejecuta ESLint en todo el proyecto
pnpm format        # Formatea código con Prettier
pnpm type-check    # Verifica tipos TypeScript

# Testing
pnpm test          # Ejecuta tests unitarios
pnpm test:integration  # Ejecuta tests de integración
pnpm test:e2e      # Ejecuta tests end-to-end

# Base de datos (Supabase)
cd apps/web
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts  # Actualiza tipos
# Usar Supabase Dashboard para gestión de base de datos
# SQL Editor para ejecutar migraciones manuales
```

## 🗄️ Base de Datos (Supabase)

El proyecto usa Supabase como backend completo:

**Gestión desde Dashboard:**
- **Table Editor** - Crear y editar tablas
- **SQL Editor** - Ejecutar queries y migraciones
- **Authentication** - Gestionar usuarios y políticas
- **Storage** - Gestionar archivos (futuro)
- **Logs** - Monitorear actividad

**Desarrollo Local:**
```bash
# Opcional: Supabase CLI para desarrollo local
npm install -g supabase
supabase init
supabase start  # Instancia local de Supabase
```

## 🧩 Componentes Implementados

### Layout y Navegación
- **Header**: Navegación completa con búsqueda integrada y botón de retroceso
- **Breadcrumbs**: Navegación contextual que muestra la ubicación actual
- **Footer**: Información legal y enlaces importantes

### Páginas de Negocio
- **BusinessDetailClient**: Página principal de detalles de negocio
- **BusinessCard**: Componente reutilizable para mostrar información de negocios
- **SimilarBusinesses**: Recomendaciones inteligentes basadas en categoría y ciudad
- **ContactInformation**: Display optimizado de información de contacto

### Sistema de Anuncios
- **GoogleAdSenseProvider**: Proveedor de contexto para AdSense
- **AdBanner**: Anuncio banner responsive
- **AdSidebar**: Anuncio lateral para desktop
- **AdInContent**: Anuncio integrado en contenido
- Estrategia: Solo se muestran anuncios en negocios **no verificados**

### Sistema de Validación Comunitaria
- **ValidationButtons**: Botones interactivos para validar contactos con cooldown de 24h
- **ValidationStats**: Estadísticas de confianza y precisión de negocios
- **ValidationRewards**: Sistema de notificaciones con puntos ganados
- **UserLevel**: Componente de gamificación con niveles y logros
- **useValidation hooks**: Hooks completos para gestión de validaciones y estadísticas

### Sistema de Reclamación de Negocios
- **ClaimButton**: Botón de reclamación integrado en páginas de negocio
- **ClaimForm**: Formulario de verificación por email con validación
- **ClaimFlow**: Flujo completo de verificación con códigos
- **Backend completo**: API endpoints con rate limiting y validación
- **EmailService**: Sistema de envío de códigos de verificación
- **SupabaseAuthGuard**: Guard de autenticación que soporta tokens mock
- **Mock Authentication**: Sistema de desarrollo sin configurar Supabase

### Business Management Dashboard
- **DashboardSidebar**: Navegación lateral colapsable con badges informativos
- **DashboardHeader**: Header profesional con notificaciones y menú de usuario
- **BusinessOverview**: Dashboard principal con métricas y gráficas interactivas
- **DashboardCard**: Componente reutilizable para métricas con tendencias
- **MetricChart**: Gráficas de rendimiento con animaciones CSS
- **RecentActivity**: Feed de actividad en tiempo real
- **QuickActions**: Acciones rápidas contextuales
- **BusinessProfileEditor**: Formulario completo de edición empresarial
- **PromoCodeManager**: Sistema avanzado de códigos promocionales con analytics
- **ValidationManager**: Gestión de validaciones comunitarias con respuestas
- **NotificationCenter**: Centro de alertas con filtros y configuración
- **BusinessOwnerGuard**: Guard de seguridad para verificar propiedad del negocio

### Autenticación y Dashboard
- **LoginForm/RegisterForm**: Formularios con validación completa
- **Dashboard**: Panel protegido para usuarios autenticados
- **ProfileSettings**: Gestión de perfil de usuario
- **AuthStatus**: Componente de desarrollo para testing de autenticación

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas usando `next-intl`:

- **Español** (es) - Idioma por defecto
- **Inglés** (en)

URLs con estructura: `/{locale}/ruta` (ej: `/es/cartagena`, `/en/cartagena`)

### Traducciones Implementadas
- **HomePage**: Página principal y navegación
- **Business**: Páginas de negocio y componentes relacionados  
- **SearchPage**: Página de búsqueda y filtros
- **Header**: Navegación y elementos comunes
- **Validation**: Sistema de validación comunitaria completo
- **Gamification**: Niveles, puntos y logros de usuario

## 📊 Base de Datos (Supabase)

### Tablas Principales

- **businesses**: Negocios turísticos (hoteles, tours, transporte)
- **contacts**: Información de contacto (teléfono, email, WhatsApp)
- **cities**: Ciudades donde operan los negocios
- **profiles**: Perfiles de usuario (integrado con Supabase Auth)
- **validations**: Validaciones comunitarias
- **business_claims**: Reclamaciones de propiedad de negocios

### Gestión de Schema

```bash
# Usar Supabase Dashboard -> SQL Editor
# Ejecutar migraciones SQL directamente
# Configurar Row Level Security (RLS)
# Actualizar tipos TypeScript:
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests con coverage
pnpm test:cov

# Tests de integración
pnpm test:integration

# Tests E2E
pnpm test:e2e

# Tests en modo watch
pnpm test:watch
```

## 📈 Monitoreo y Logs

- **Supabase Logs** - Logs integrados en dashboard
- **Vercel Analytics** - Métricas de frontend
- **Supabase Metrics** - Métricas de base de datos y auth

## 🚀 Deploy

### Frontend (Vercel)
```bash
# El deploy se hace automáticamente desde main branch
# Configurar variables de entorno en Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Backend (Supabase)
```bash
# El backend es completamente gestionado por Supabase
# Configuraciones en Supabase Dashboard:
# - Authentication settings
# - Database policies (RLS)
# - Edge Functions (si se requieren)
```

## 🔧 Configuración de IDE

### VS Code

Extensiones recomendadas:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prisma
- ESLint
- Prettier

### Settings.json recomendado:
```json
{
  "typescript.preferences.quoteStyle": "single",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Commits

Usamos [Conventional Commits](https://conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): formatting changes
refactor(scope): code refactoring
test(scope): add tests
chore(scope): maintenance tasks
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [Docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/usuario/contactos-turisticos/issues)
- **Discord**: [Server de la comunidad](#)

## 🗺️ Roadmap

### Completado ✅
- [x] Setup inicial del monorepo
- [x] Aplicaciones base (Frontend/Backend)
- [x] **Sistema de autenticación completo** (Supabase + JWT)
- [x] CRUD básico de negocios
- [x] Login/Register con OAuth
- [x] Dashboard protegido
- [x] Middleware de autenticación
- [x] **Fase 2: Business Detail Pages** ✅
  - [x] Páginas dinámicas de negocios (`/[locale]/business/[id]`)
  - [x] Header completo con navegación y búsqueda
  - [x] Breadcrumbs contextuales
  - [x] Funcionalidad de copiar contactos
  - [x] Display de códigos promocionales
  - [x] Recomendaciones de negocios similares
  - [x] Integración Google AdSense (compliance 2025)
  - [x] Sistema de anuncios estratégico
  - [x] SEO y meta tags optimizados
  - [x] Soporte completo multi-idioma
- [x] **Fase 3: Community Validation System** ✅
  - [x] API completa de validaciones con rate limiting
  - [x] Sistema de cooldown de 24h por tipo de contacto
  - [x] Botones interactivos de validación en tiempo real
  - [x] Estadísticas y niveles de confianza automáticos
  - [x] Sistema de gamificación (puntos, niveles, badges)
  - [x] Historial de validaciones y métricas de usuario
  - [x] Soporte para usuarios anónimos y autenticados
  - [x] Notificaciones de recompensas animadas
  - [x] Traducciones completas ES/EN
- [x] **Fase 4: Business Claiming** ✅ **COMPLETADA**
  - [x] Flujo completo de reclamación de negocios empresariales
  - [x] Verificación por email con códigos de seguridad
  - [x] Sistema completo de autenticación (Supabase + Mock para desarrollo)
  - [x] API endpoints con rate limiting y throttling
  - [x] Integración en páginas de negocio con ClaimButton
  - [x] Backend con EmailService y guards de autenticación
  - [x] Sistema mock para desarrollo sin configurar Supabase
  - [x] Panel de administración básico para claims
  - [x] Modificación de estado de negocios (ownership)

- [x] **Fase 5: Business Management Dashboard** ✅ **COMPLETADA**
  - [x] Panel completo de gestión empresarial post-claim con navegación profesional
  - [x] Dashboard con estadísticas, métricas y gráficas interactivas de negocio
  - [x] Edición completa de información del negocio por propietarios verificados
  - [x] Sistema avanzado de códigos promocionales con analytics y gestión
  - [x] Gestión completa de validaciones y respuestas a comentarios de usuarios
  - [x] Centro de notificaciones empresariales con alertas categorizadas
  - [x] BusinessOwnerGuard para seguridad y verificación de propiedad
  - [x] Integración completa desde ClaimButton hasta dashboard funcional
  - [x] Layout responsive con sidebar colapsable y quick actions

### Próximas Fases 🚀

**Fase 6: Data Integration** (Alta prioridad) - RECOMENDADA SIGUIENTE
- [ ] Integración con Google Places API
- [ ] Carga inicial de datos de Cartagena (10,000+ negocios)
- [ ] Sistema de importación batch y sincronización
- [ ] Enriquecimiento automático de datos faltantes
- [ ] Sistema de detección de duplicados

**Fase 7: Advanced Features** (Media prioridad)
- [ ] Sistema de reviews y ratings avanzado
- [ ] Mapas interactivos con ubicaciones
- [ ] Filtros avanzados por precio, servicios, etc.
- [ ] Notificaciones push y sistema de seguimiento
- [ ] API pública para terceros

**Fase 8: Production & Scale** (Media prioridad)
- [ ] Deploy completo en Vercel + Railway
- [ ] Configuración de producción optimizada
- [ ] Monitoreo avanzado y analytics
- [ ] Tests E2E completos automatizados
- [ ] Performance optimization y caching
- [ ] SEO avanzado y sitemap dinámico

### Futuras Mejoras 🔮
- [ ] Sistema de pagos (Stripe/PayU)
- [ ] App móvil (React Native)
- [ ] IA para validación automática
- [ ] Expansión internacional