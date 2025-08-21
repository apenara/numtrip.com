# NumTrip - Plataforma de Contactos Verificados para Turismo

Una plataforma global donde los viajeros pueden encontrar números de contacto, correos y WhatsApp verificados de hoteles, agencias de tours y transporte.

## 🚀 Características

- **Búsqueda y filtrado avanzado** de negocios turísticos
- **Verificación comunitaria** de información de contacto
- **Sistema de reclamación de perfiles** para empresarios
- **Códigos promocionales** exclusivos
- **Soporte multi-idioma** (Español/Inglés)
- **Arquitectura moderna** con Next.js y NestJS

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

### Backend
- **NestJS** con TypeScript
- **Prisma ORM** con PostgreSQL
- **Redis** para cache y colas
- **JWT** para autenticación
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
   # Editar .env con tus configuraciones
   ```

4. **Iniciar servicios de desarrollo**
   ```bash
   # Iniciar PostgreSQL y Redis
   docker-compose up -d
   
   # Generar Prisma client
   cd apps/api && pnpm prisma generate
   
   # Ejecutar migraciones
   pnpm prisma migrate dev
   ```

5. **Iniciar aplicaciones en modo desarrollo**
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

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas usando `next-intl`:

- **Español** (es) - Idioma por defecto
- **Inglés** (en)

URLs con estructura: `/{locale}/ruta` (ej: `/es/cartagena`, `/en/cartagena`)

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

- [x] Setup inicial del monorepo
- [x] Aplicaciones base (Frontend/Backend)
- [x] Sistema de autenticación
- [x] CRUD de negocios
- [ ] Sistema de validación comunitaria
- [ ] Panel de administración
- [ ] Integración con Google Places API
- [ ] Sistema de pagos (Stripe/PayU)
- [ ] Tests E2E completos
- [ ] Deploy automatizado
- [ ] Monitoreo y analytics
- [ ] App móvil (React Native)