import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/request';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  // Apply the intl middleware for all routes
  // The [slug] route will handle both slugs and legacy IDs internally
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};