
🎨 Frontend
Framework Principal

Next.js 14.2.x (Latest stable)

App Router para mejor SEO y performance
Server Components por defecto
Built-in i18n routing para multi-idioma
Image optimization automática



UI & Estilos

React 18.3.x
TypeScript 5.4.x
Tailwind CSS 3.4.x

PostCSS 8.4.x
Autoprefixer 10.4.x


Shadcn/ui (componentes base)
Lucide React 0.400.x (iconos)

State Management & Data Fetching

TanStack Query 5.40.x (React Query)

Cache automático
Optimistic updates
Background refetching


Zustand 4.5.x (estado global ligero)

Formularios & Validación

React Hook Form 7.52.x
Zod 3.23.x (schema validation)

🔧 Backend
Framework & Runtime

Node.js 20.x LTS (hasta 2026)
NestJS 10.3.x

Arquitectura modular
Decoradores TypeScript
Integración fácil con ORMs



Base de Datos & ORM

PostgreSQL 16.x

Estable y probado
Excelente para datos relacionales
Full-text search nativo


Prisma 5.15.x

Type-safe ORM
Migraciones automáticas
Prisma Studio para desarrollo



Cache & Queue

Redis 7.2.x

Cache de sesiones
Rate limiting
Bull queue para jobs


BullMQ 5.8.x (job queues)

🔐 Autenticación & Seguridad

Supabase Auth (hosted)

OAuth providers incluidos
Row Level Security
Magic links


JSON Web Tokens (JWT)
Bcrypt 5.1.x (hashing)
Helmet.js 7.1.x (security headers)
Express Rate Limit 7.2.x

💳 Pagos

Stripe SDK 15.x

Subscripciones recurrentes
Webhooks confiables
Portal de cliente


PayU Latam SDK (mercado local)

🌐 Infraestructura & Deploy
Hosting

Vercel (Frontend)

Edge Functions
Automatic HTTPS
Preview deployments


Railway.app o Render (Backend)

PostgreSQL managed
Redis managed
Auto-scaling



CDN & Assets

Cloudflare

CDN global
DDoS protection
Web Analytics


AWS S3 o Cloudinary

Imágenes de empresas
Optimización automática



📊 Monitoreo & Analytics

Google Analytics 4
Sentry (error tracking)

@sentry/nextjs 8.x
@sentry/node 8.x


Posthog (product analytics)
Uptime Robot (monitoring)

🛠️ Herramientas de Desarrollo
Testing

Jest 29.7.x
React Testing Library 15.x
Cypress 13.x (E2E)
Supertest 7.x (API testing)

Linting & Formatting

ESLint 8.57.x
Prettier 3.3.x
Husky 9.x (git hooks)
lint-staged 15.x

CI/CD

GitHub Actions
Dependabot (dependencies)
Semantic Release (versioning)

📦 Package Managers & Build Tools

pnpm 9.x (más eficiente que npm/yarn)
Turborepo (monorepo management)
Vite (para tools internos si needed)

🔄 APIs & Integraciones
APIs Externas

Google Places API (carga inicial)
Google Maps JavaScript API
WhatsApp Business API
SendGrid o Resend (emails)

Documentación API

Swagger/OpenAPI 3.0
Redoc (documentation UI)

📱 Mobile (Futuro)

React Native 0.74.x
Expo SDK 51.x
Compartir componentes con web via monorepo

📝 Archivo de Configuración Base
package.json (Frontend)
json{
  "name": "contactos-turisticos-frontend",
  "version": "1.0.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@tanstack/react-query": "^5.40.0",
    "zustand": "^4.5.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.400.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0"
  }
}
package.json (Backend)
json{
  "name": "contactos-turisticos-backend",
  "version": "1.0.0",
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@prisma/client": "^5.15.0",
    "typescript": "^5.4.0",
    "bullmq": "^5.8.0",
    "bcrypt": "^5.1.0",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "prisma": "^5.15.0",
    "@types/node": "^20.0.0",
    "jest": "^29.7.0"
  }
}
Docker Compose (Desarrollo)
yamlversion: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: contactos_turisticos
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data: