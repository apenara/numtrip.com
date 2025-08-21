# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NumTrip is a verified tourism contact directory platform. The initial focus is on Cartagena, Colombia, with plans for global expansion. The platform allows travelers to find verified contact information (phone, email, WhatsApp) for hotels, tours, and transportation services.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.x with App Router
- **Language**: TypeScript 5.4.x
- **Styling**: Tailwind CSS 3.4.x
- **UI Components**: Shadcn/ui
- **State Management**: TanStack Query 5.40.x (data fetching), Zustand 4.5.x (global state)
- **Forms**: React Hook Form 7.52.x with Zod 3.23.x validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20.x LTS
- **Framework**: NestJS 10.3.x
- **Database**: PostgreSQL 16.x with Prisma 5.15.x ORM
- **Cache/Queue**: Redis 7.2.x with BullMQ 5.8.x
- **Authentication**: Supabase Auth
- **Payments**: Stripe SDK 15.x, PayU Latam SDK

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway.app or Render
- **CDN**: Cloudflare
- **Image Storage**: AWS S3 or Cloudinary
- **Package Manager**: pnpm 9.x

## Development Commands

### Frontend Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

### Backend Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Database migrations
pnpm prisma migrate dev
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma studio

# Generate Prisma client
pnpm prisma generate
```

### Docker Development Environment
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Testing
```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## Architecture & Development Rules

### Directory Structure (Monorepo)
```
/contactos-turisticos
├── /apps
│   ├── /web                    # Frontend Next.js
│   │   ├── /app                # App Router
│   │   │   ├── /[locale]       # i18n routes
│   │   │   ├── /api           # API routes
│   │   │   └── /components    # Page components
│   │   ├── /components        # Shared components
│   │   ├── /hooks             # Custom hooks
│   │   ├── /lib               # Utilities
│   │   ├── /services          # API calls
│   │   └── /stores            # Zustand stores
│   │
│   └── /api                    # Backend NestJS
│       ├── /src
│       │   ├── /modules       # Feature-based modules
│       │   │   ├── /auth
│       │   │   ├── /business
│       │   │   ├── /search
│       │   │   └── /validation
│       │   ├── /common        # Shared resources
│       │   ├── /config        # Configurations
│       │   └── /database      # Prisma schemas
│       └── /test
│
├── /packages                   # Shared code
│   ├── /ui                    # UI components
│   ├── /types                 # TypeScript types
│   ├── /utils                 # Shared utilities
│   └── /config                # Shared configs
│
├── /tools                     # Scripts and tools
└── /docs                      # Documentation
```

### SOLID Principles

#### Single Responsibility Principle
Each service/component should have one clear responsibility:
```typescript
// Good: Separate services for different concerns
class BusinessService { /* business logic only */ }
class EmailService { /* email handling only */ }
class ValidationService { /* validation logic only */ }
```

#### Open/Closed Principle
Code should be open for extension, closed for modification:
```typescript
// Use interfaces for extensibility
interface NotificationChannel {
  send(message: string, recipient: string): Promise<void>;
}
// Easily add new channels without modifying existing code
class EmailChannel implements NotificationChannel { }
class WhatsAppChannel implements NotificationChannel { }
```

#### Dependency Inversion
Depend on abstractions, not concretions:
```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
}
// Implementation can be swapped easily
class RedisCacheService implements CacheService { }
```

### Code Organization

#### Module Structure
Each NestJS module should be self-contained:
```
/modules/business
├── business.module.ts
├── business.controller.ts
├── business.service.ts
├── business.repository.ts
├── dto/
├── entities/
├── interfaces/
└── tests/
```

#### Shared Components
Reusable UI components in packages/ui:
```typescript
// packages/ui/src/components/ContactItem.tsx
export const ContactItem: React.FC<ContactItemProps> = ({ type, value, verified }) => {
  // Reusable contact display component
};
```

#### Custom Hooks
Common hooks in packages/utils:
```typescript
// packages/utils/src/hooks/useClipboard.ts
export const useClipboard = () => {
  // Clipboard functionality reusable across the app
};
```

### Testing Requirements

- Unit tests for all services and utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows
- Minimum 80% code coverage

Test file naming: `[filename].spec.ts` for unit tests, `[filename].integration.spec.ts` for integration tests

### Error Handling

Use custom error classes:
```typescript
// packages/utils/src/errors/index.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError { }
export class NotFoundError extends AppError { }
```

### Git Workflow

#### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

#### Commit Convention
Use conventional commits:
```bash
feat(business): add WhatsApp validation
fix(search): correct pagination logic
docs(readme): update installation steps
refactor(auth): extract validation logic
test(business): add integration tests
chore(deps): update dependencies
```

### Performance Guidelines

- Use lazy loading for heavy components
- Implement memoization for expensive calculations
- Use React.memo for component optimization
- Implement proper caching strategies
- Optimize images with Next.js Image component

### Security Requirements

- Always validate inputs with Zod schemas
- Implement rate limiting on all public endpoints
- Never expose sensitive data in logs
- Use environment variables for secrets
- Implement proper CORS configuration
- Use Helmet.js for security headers

### Code Quality Standards

#### Naming Conventions
- Use descriptive variable names
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use UPPER_SNAKE_CASE for constants

#### Function Guidelines
- Keep functions small and focused (< 20 lines)
- Single responsibility per function
- Use early returns to reduce nesting
- Document complex functions with JSDoc

#### Code Review Checklist
- [ ] Follows SOLID principles
- [ ] No code duplication (DRY)
- [ ] Clear and descriptive naming
- [ ] Has appropriate tests
- [ ] Handles errors properly
- [ ] Documentation updated
- [ ] Follows project conventions
- [ ] Performance optimized
- [ ] Security validated
- [ ] Useful logging added

### Database Schema Key Entities

- **Business**: Hotels, tour operators, transportation services
- **Contact**: Phone numbers, emails, WhatsApp
- **Verification**: Community validations and business claims
- **User**: Registered users and business owners
- **Subscription**: Premium plan management
- **PromoCode**: Discount codes for businesses

## Important Business Logic

### Verification Process
1. Businesses can be claimed via email, SMS, or phone verification
2. Verified businesses get a ✅ badge and access to admin panel
3. Community can validate or report incorrect contact information

### Monetization
- Google AdSense on non-verified profiles
- Premium plans for businesses (no ads, advanced stats, featured listings)
- Initial 6-month free premium for key Cartagena businesses (go-to-market strategy)

### Data Sources
- Initial data load from Google Places API
- Community-driven updates and validations
- Business owner direct updates

## SEO and Performance Requirements

- Page load time < 3 seconds on first load
- Navigation between profiles < 1 second
- Mobile-first responsive design
- Structured data markup for all business profiles
- Sitemap generation for all cities and businesses
- hreflang tags for multi-language support
- Lazy loading for images and heavy components
- Implement proper caching strategies