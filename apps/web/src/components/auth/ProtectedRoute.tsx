'use client';

import { useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { user, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!loading && initialized && !user) {
      const locale = (params as any)?.locale ?? '';
      const encoded = encodeURIComponent(pathname || '/dashboard');
      const target = `/${locale}${redirectTo}?returnUrl=${encoded}`;
      router.push(target);
    }
  }, [user, loading, initialized, router, redirectTo, pathname, params]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}