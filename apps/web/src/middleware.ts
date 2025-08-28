import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  // First handle internationalization
  const response = intlMiddleware(request);
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if exists
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes check
  const protectedPaths = ['/dashboard', '/claim', '/profile'];
  const pathname = request.nextUrl.pathname;
  
  const isProtectedPath = protectedPaths.some(path => 
    pathname.includes(path)
  );

  if (isProtectedPath && !user) {
    // Redirect to login if trying to access protected route
    const locale = pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};