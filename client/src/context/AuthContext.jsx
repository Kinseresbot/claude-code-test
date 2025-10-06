import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { session, user } = await authService.login(email, password);
    setSession(session);
    setUser(user);
    return { session, user };
  };

  const register = async (email, password, metadata = {}) => {
    const { session, user } = await authService.register(email, password, metadata);
    setSession(session);
    setUser(user);
    return { session, user };
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
    setUser(null);
  };

  const resetPassword = async (email) => {
    await authService.resetPassword(email);
  };

  const isAuthenticated = () => {
    return session !== null && user !== null;
  };

  const getAccessToken = () => {
    return session?.access_token ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
