# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-08-20

### Added
- **Project Infrastructure**
  - Initial monorepo setup with Turborepo
  - pnpm workspace configuration
  - TypeScript configuration across all packages
  - ESLint and Prettier for code quality
  - Docker Compose for development environment
  - Environment variables configuration (.env.example)
  - Comprehensive README.md with setup instructions

- **Frontend (Next.js)**
  - Next.js 14 application with App Router
  - TypeScript integration with strict configuration
  - Tailwind CSS with custom design system
  - next-intl for internationalization (Spanish/English)
  - Custom layout with locale routing
  - Hero page with sample business showcase
  - Responsive design with mobile-first approach
  - Middleware for locale handling

- **Backend (NestJS)**
  - NestJS 10 application with modular architecture
  - Prisma ORM integration with PostgreSQL
  - Database schema with core entities:
    - Business (hotels, tours, transportation)
    - User (authentication and profiles)
    - Validation (community feedback)
    - PromoCode (discount codes)
  - RESTful API endpoints for business management
  - Global exception handling
  - Swagger documentation setup
  - Health check endpoint
  - Rate limiting with throttler

- **Shared Packages**
  - `@contactos-turisticos/types`: TypeScript types and Zod schemas
  - `@contactos-turisticos/utils`: Shared utilities including:
    - Custom React hooks (useClipboard, useLocalStorage, useDebounce)
    - Validation utilities (phone, email, URL)
    - Formatters (date, number, text)
    - Error handling classes
  - `@contactos-turisticos/ui`: Reusable UI components:
    - Button component with variants
    - Card components
    - Badge components
    - Utility functions for className merging

- **Database Setup**
  - PostgreSQL schema with proper indexing
  - Prisma migrations setup
  - Seed data for development with sample businesses in Cartagena
  - Support for business categories (HOTEL, TOUR, TRANSPORT, etc.)
  - Validation system for community feedback
  - Promotional codes management

- **Development Tools**
  - Docker Compose with PostgreSQL, Redis, and Adminer
  - Turbo configuration for monorepo builds
  - ESLint configuration with React and NestJS specific rules
  - Prettier configuration for consistent formatting
  - Git hooks preparation with Husky
  - Testing setup with Jest

- **Documentation**
  - Comprehensive CLAUDE.md for AI assistant guidance
  - README.md with detailed setup instructions
  - API documentation with Swagger
  - Database seed script with sample data
  - Design system documentation in CSS variables

### Technical Specifications
- **Node.js**: 20.x LTS
- **Package Manager**: pnpm 9.x
- **Frontend**: Next.js 14.2.x, React 18.3.x, TypeScript 5.4.x
- **Backend**: NestJS 10.3.x, Prisma 5.15.x
- **Database**: PostgreSQL 16.x, Redis 7.2.x
- **Styling**: Tailwind CSS 3.4.x
- **Build Tool**: Turborepo 2.x
- **Code Quality**: ESLint 8.x, Prettier 3.x

### Architecture Decisions
- Monorepo structure for better code sharing and maintainability
- SOLID principles implementation across all modules
- Type-safe development with comprehensive TypeScript usage
- Internationalization-first approach with next-intl
- Modular backend architecture with feature-based modules
- Shared component library for consistent UI
- Docker containerization for development environment
- SEO-optimized URL structure: `/{locale}/{city}/{category}/{business}`

### Security Measures
- Input validation with Zod schemas
- Rate limiting on API endpoints
- Helmet.js for security headers
- Environment variable protection
- CORS configuration
- JWT-based authentication setup

### Performance Optimizations
- Image optimization with Next.js
- Lazy loading for heavy components
- Memoization strategies in shared utilities
- Database indexing for efficient queries
- CDN configuration for static assets
- Build optimization with Turborepo caching

## [0.0.0] - 2025-08-20
### Added
- Initial project setup and planning
- Requirements analysis and technical architecture design