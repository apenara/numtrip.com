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
- **Arquitectura moderna** con Next.js y NestJS

## 📈 Estado Actual (v1.3.0)

### ✅ Completado
- ✅ **Infraestructura del proyecto** - Monorepo con Turborepo
- ✅ **Frontend básico** - Páginas principales y componentes UI
- ✅ **Backend API** - Endpoints básicos y estructura de datos
- ✅ **Base de datos** - Schema completo con Prisma
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

### 🚧 En Progreso / Próximo
- ⏳ **Claiming de negocios** - Verificación empresarial
- ⏳ **Google Places API** - Carga inicial de datos de Cartagena
- ⏳ **Producción** - Deploy y configuración live

## 🏗️ Arquitectura

Este proyecto utiliza un monorepo con las siguientes aplicaciones y paquetes:

```
contactos-turisticos/
├── apps/
│   ├── web/          # Frontend Next.js 14 con App Router
│   └── api/          # Backend NestJS con Prisma
├── packages/
│   ├── ui/           # Componentes UI compartidos
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
- **NestJS** con TypeScript
- **Prisma ORM** con PostgreSQL
- **Supabase** para autenticación y usuarios
- **Redis** para cache y colas
- **JWT** para tokens de API
- **Swagger** para documentación API
- **Jest** para testing

### Infraestructura
- **Docker** para desarrollo local
- **Vercel** para frontend hosting
- **Railway/Render** para backend hosting
- **Cloudflare CDN**

## 📋 Prerrequisitos

- Node.js 20.x o superior
- pnpm 9.x o superior
- Docker y Docker Compose (para desarrollo local)

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
   - Habilitar autenticación por email en el dashboard
   - (Opcional) Configurar proveedores OAuth (Google, GitHub)

5. **Iniciar servicios de desarrollo**
   ```bash
   # Iniciar PostgreSQL y Redis
   docker-compose up -d
   
   # Generar Prisma client
   cd apps/api && pnpm prisma generate
   
   # Ejecutar migraciones
   pnpm prisma migrate dev
   ```

6. **Iniciar aplicaciones en modo desarrollo**
   ```bash
   # Desde la raíz del proyecto
   pnpm dev
   ```

   Esto iniciará:
   - Frontend en http://localhost:3000
   - Backend en http://localhost:3001
   - Swagger docs en http://localhost:3001/api/docs

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

# Base de datos
cd apps/api
pnpm prisma generate   # Genera cliente Prisma
pnpm prisma migrate dev # Ejecuta migraciones
pnpm prisma studio     # Abre Prisma Studio
pnpm prisma seed       # Ejecuta seed de datos
```

## 🐳 Desarrollo con Docker

El proyecto incluye un `docker-compose.yml` para el entorno de desarrollo:

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

Servicios incluidos:
- **PostgreSQL** (puerto 5432)
- **Redis** (puerto 6379)
- **Adminer** (puerto 8080) - GUI para PostgreSQL

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

### Autenticación y Dashboard
- **LoginForm/RegisterForm**: Formularios con validación completa
- **Dashboard**: Panel protegido para usuarios autenticados
- **ProfileSettings**: Gestión de perfil de usuario

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

## 📊 Base de Datos

### Modelos Principales

- **Business**: Negocios turísticos (hoteles, tours, transporte)
- **User**: Usuarios del sistema
- **Validation**: Validaciones comunitarias
- **PromoCode**: Códigos promocionales

### Migraciones

```bash
cd apps/api

# Crear nueva migración
pnpm prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Reset completo (solo desarrollo)
pnpm prisma migrate reset
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

- **Logs estructurados** con Winston
- **Health checks** en `/api/health`
- **Métricas** con Prometheus (configuración futura)

## 🚀 Deploy

### Frontend (Vercel)
```bash
# El deploy se hace automáticamente desde main branch
# Configurar variables de entorno en Vercel dashboard
```

### Backend (Railway/Render)
```bash
# Configurar variables de entorno
# Ejecutar migraciones en producción
pnpm prisma migrate deploy
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

### Próximas Fases 🚀

**Fase 4: Business Claiming** (Alta prioridad) - RECOMENDADA SIGUIENTE
- [ ] Flujo de reclamación de negocios empresariales
- [ ] Verificación por email/SMS/llamada telefónica
- [ ] Panel de gestión empresarial con dashboard
- [ ] Sistema de aprobación de claims
- [ ] Modificación de información por propietarios verificados
- [ ] Gestión de códigos promocionales por negocios

**Fase 5: Data Integration** (Media prioridad)
- [ ] Integración con Google Places API
- [ ] Carga inicial de datos de Cartagena (10,000+ negocios)
- [ ] Sistema de importación batch y sincronización
- [ ] Enriquecimiento automático de datos faltantes
- [ ] Sistema de detección de duplicados

**Fase 6: Advanced Features** (Media prioridad)
- [ ] Sistema de reviews y ratings avanzado
- [ ] Mapas interactivos con ubicaciones
- [ ] Filtros avanzados por precio, servicios, etc.
- [ ] Notificaciones push y sistema de seguimiento
- [ ] API pública para terceros

**Fase 7: Production & Scale** (Media prioridad)
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