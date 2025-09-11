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

### Backend (Supabase)
- **Backend as a Service**: Supabase (complete backend solution)
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: Supabase Auth (complete auth system)
- **Real-time**: Supabase Realtime (for live updates)
- **Storage**: Supabase Storage (for file uploads)
- **Edge Functions**: Deno runtime for serverless functions
- **Security**: Row Level Security (RLS) policies
- **API**: Auto-generated REST API and GraphQL from database schema

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend**: Supabase (fully managed)
- **CDN**: Cloudflare (via Vercel)
- **Database**: Supabase PostgreSQL
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

### Supabase Backend Development
```bash
# Generate TypeScript types from Supabase
npx supabase gen types typescript --project-id xvauchcfkrbbpfoszlah > apps/web/src/types/database.ts

# Database management via Supabase Dashboard:
# - https://supabase.com/dashboard/project/xvauchcfkrbbpfoszlah
# - SQL Editor for queries and migrations
# - Table Editor for schema changes
# - Auth settings for user management
# - Edge Functions management

# Local Supabase development (optional)
npm install -g supabase
supabase init
supabase start
supabase stop
supabase status

# Most development is done against remote Supabase instance
```

### Data Import Commands
```bash
# Import businesses from Google Places API (with landmark filtering)
npx tsx import-businesses-simple.ts

# Test Google Places API configuration
pnpm run script:test-google-places

# Check imported data (legacy - use Supabase dashboard instead)
pnpm run script:check-imported-data
```

**Important**: The import script automatically filters out monuments, landmarks, and non-contactable places using the shared `isLandmarkToFilter` function to avoid importing irrelevant tourist attractions that don't provide services.

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

### Directory Structure
```
/numtrip
├── /apps
│   └── /web                    # Frontend Next.js + Supabase
│       ├── /app                # App Router
│       │   ├── /[locale]       # i18n routes
│       │   │   ├── /business      # Business pages
│       │   │   ├── /search        # Search pages
│       │   │   └── /auth          # Auth pages
│       │   ├── /api            # Next.js API routes (minimal)
│       │   └── /globals.css   # Global styles
│       ├── /components         # Shared components
│       │   ├── /business      # Business-specific components
│       │   ├── /auth          # Auth components
│       │   ├── /layout        # Layout components
│       │   └── /ui            # Base UI components
│       ├── /hooks              # Custom React hooks
│       ├── /lib                # Utilities and configs
│       ├── /services           # Supabase service layer
│       ├── /stores             # Zustand stores
│       └── /types              # TypeScript definitions
│           └── database.ts     # Supabase generated types
│
├── /packages                   # Shared code (optional)
│   ├── /ui                    # Reusable UI components
│   ├── /types                 # Shared TypeScript types
│   └── /utils                 # Shared utilities
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

#### Service Layer Structure
Supabase services should be organized by feature:
```
/services
├── business.service.supabase.ts    # Business data operations
├── auth.service.ts                # Authentication helpers
├── validation.service.ts          # Community validation
└── supabase.ts                    # Supabase client config
```

#### Shared Components
Reusable UI components in components/ui:
```typescript
// components/ui/ContactItem.tsx
export const ContactItem: React.FC<ContactItemProps> = ({ type, value, verified }) => {
  // Reusable contact display component
};
```

#### Custom Hooks
Common hooks in hooks directory:
```typescript
// hooks/useClipboard.ts
export const useClipboard = () => {
  // Clipboard functionality reusable across the app
};

// hooks/useSupabaseAuth.ts
export const useSupabaseAuth = () => {
  // Supabase authentication state management
};
```

#### Shared Utilities
Business-related utilities in packages/utils:
```typescript
// packages/utils/src/business/landmark-filter.ts
import { isLandmarkToFilter } from '@contactos-turisticos/utils';

// Filter monuments, landmarks from business data
const isLandmark = isLandmarkToFilter(name, description, address);
// Returns true if business should be filtered out (is a monument/landmark)
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

### Database Schema (Supabase Tables)

#### Core Business Tables
- **businesses**: Hotels, tour operators, transportation services
  - Google Place ID integration for duplicate prevention
  - Categories: HOTEL, RESTAURANT, TOUR, TRANSPORT, ATTRACTION, OTHER
  - GPS coordinates, addresses, verification status
- **contacts**: Phone numbers, emails, WhatsApp, websites linked to businesses
  - Contact types: PHONE, EMAIL, WHATSAPP, WEBSITE
  - Primary contact designation and verification status
- **cities**: Geographic locations for businesses
  - Currently focused on Cartagena, Colombia

#### User & Authentication
- **profiles**: User profiles (linked to Supabase Auth users)
- **auth.users**: Supabase managed user authentication table

#### Business Management
- **validations**: Community validations of contact information
- **business_claims**: Business ownership claims and verification
- **business_views**: Analytics tracking for business profile views

#### Additional Features
- **promo_codes**: Promotional codes and discounts for verified businesses

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
- Initial data load from Google Places API (via Supabase functions or direct import)
- Community-driven updates and validations (stored in Supabase)
- Business owner direct updates (via Supabase client)

## SEO and Performance Requirements

- Page load time < 3 seconds on first load
- Navigation between profiles < 1 second
- Mobile-first responsive design
- Structured data markup for all business profiles
- Sitemap generation for all cities and businesses
- hreflang tags for multi-language support
- Lazy loading for images and heavy components
- Implement proper caching strategies