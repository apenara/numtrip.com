'use client';

import { useAuthStore } from '@/stores/auth.store';
import { mockAuth, isMockAuthEnabled } from '@/lib/auth-mock';

export function AuthStatus() {
  const { user, initialized, loading } = useAuthStore();

  if (loading || !initialized) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-blue-700">Loading authentication...</p>
      </div>
    );
  }

  const handleMockLogin = () => {
    if (isMockAuthEnabled()) {
      mockAuth.signIn();
      window.location.reload();
    }
  };

  const handleMockLogout = () => {
    if (isMockAuthEnabled()) {
      mockAuth.signOut();
      window.location.reload();
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900">Authentication Status</h3>
      
      {user ? (
        <div className="space-y-2">
          <p className="text-green-700">✅ Authenticated as: {user.email}</p>
          <p className="text-sm text-gray-600">User ID: {user.id}</p>
          <p className="text-sm text-gray-600">Name: {user.user_metadata?.name || 'Not provided'}</p>
          
          {isMockAuthEnabled() && (
            <div className="pt-2">
              <p className="text-amber-600 text-xs">🔧 Mock Authentication Enabled (Development)</p>
              <button
                onClick={handleMockLogout}
                className="mt-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Mock Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-700">❌ Not authenticated</p>
          
          {isMockAuthEnabled() ? (
            <div className="space-y-2">
              <p className="text-amber-600 text-xs">🔧 Mock Authentication Available (Development)</p>
              <button
                onClick={handleMockLogin}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Mock Login
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              <a href="/auth/login" className="text-blue-600 hover:underline">
                Go to login page
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}