import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if we are missing real Supabase credentials
  const isMock = !import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    if (isMock) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isMock]);

  const mockDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const value = {
    signUp: async (data) => {
      if (isMock) {
        await mockDelay(1000); // Simulate network request
        const mockUser = { id: 'mock-user-id', email: data.email, user_metadata: data.options?.data };
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }
      return supabase.auth.signUp(data);
    },
    signIn: async (data) => {
      if (isMock) {
        await mockDelay(1000);
        // In a mock, we accept any password
        const mockUser = { id: 'mock-user-id', email: data.email };
        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }
      return supabase.auth.signInWithPassword(data);
    },
    signOut: async () => {
      if (isMock) {
        await mockDelay(500);
        setUser(null);
        return { error: null };
      }
      return supabase.auth.signOut();
    },
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
