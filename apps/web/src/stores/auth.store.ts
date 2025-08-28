import { create } from 'zustand';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    if (get().initialized) return;
    
    const supabase = createClient();
    set({ loading: true });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        user: session?.user ?? null,
        initialized: true,
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });

      // Store subscription for cleanup if needed
      if (typeof window !== 'undefined') {
        (window as any).__supabaseAuthSubscription = subscription;
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    const supabase = createClient();
    set({ loading: true });

    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      set({ loading: false });
    }
  },
}));