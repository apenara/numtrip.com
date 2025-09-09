import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function withAuth(
  request: NextRequest,
  requiredRole?: 'user' | 'business_owner' | 'admin'
) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user has a business they own
  if (requiredRole === 'business_owner') {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', session.user.id)
      .limit(1);

    if (!businesses || businesses.length === 0) {
      return NextResponse.redirect(new URL('/claim-business', request.url));
    }
  }

  // Admin check would go here if needed
  if (requiredRole === 'admin') {
    // Check admin role in user metadata or separate admin table
    const isAdmin = session.user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
}