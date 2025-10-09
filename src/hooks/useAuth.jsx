import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Erro ao criar conta: ' + error.message);
    setAuthLoading(false);
    return { success: !error, user: data?.user, error };
  };

  const signIn = async (email, password) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Erro ao fazer login: ' + error.message);
    setAuthLoading(false);
    return { success: !error, error };
  };

  const signOut = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAuthLoading(false);
  };
  
  const value = {
    user,
    session,
    authLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};