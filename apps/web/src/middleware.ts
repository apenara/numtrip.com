import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

// For now, we'll keep middleware simple and handle auth at component level
// to avoid Edge Runtime issues with Supabase
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};