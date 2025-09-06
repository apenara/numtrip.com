// Mock authentication for development
// TODO: Remove this file in production

export const MOCK_USER = {
  id: 'mock-user-123',
  email: 'demo@numtrip.com',
  user_metadata: {
    name: 'Demo User',
  },
  created_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
};

export const isMockAuthEnabled = () => {
  // Enable mock auth only in development
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';
};

// Mock session for development
export const MOCK_SESSION = {
  access_token: 'mock-access-token-xyz',
  refresh_token: 'mock-refresh-token-abc',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: MOCK_USER,
};

// Store mock auth state in localStorage
export const mockAuth = {
  isAuthenticated: () => {
    if (!isMockAuthEnabled()) return false;
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mock_auth') === 'true';
  },

  signIn: () => {
    if (!isMockAuthEnabled()) return null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_auth', 'true');
      localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
      window.dispatchEvent(new Event('mock-auth-change'));
    }
    return { user: MOCK_USER, session: MOCK_SESSION };
  },

  signOut: () => {
    if (!isMockAuthEnabled()) return;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_auth');
      localStorage.removeItem('mock_user');
      window.dispatchEvent(new Event('mock-auth-change'));
    }
  },

  getUser: () => {
    if (!isMockAuthEnabled()) return null;
    if (typeof window === 'undefined') return null;
    const isAuth = localStorage.getItem('mock_auth') === 'true';
    if (!isAuth) return null;
    
    const userStr = localStorage.getItem('mock_user');
    return userStr ? JSON.parse(userStr) : MOCK_USER;
  },

  getSession: () => {
    if (!isMockAuthEnabled()) return null;
    const user = mockAuth.getUser();
    return user ? MOCK_SESSION : null;
  },
};