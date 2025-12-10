import { useState, useEffect, useCallback } from 'react';
// CORREÇÃO AQUI: O nome do arquivo é supabaseClient
import { supabase } from '../lib/supabaseClient';

export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Novos estados de controle
  const [isPro, setIsPro] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Busca perfil com as novas colunas
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, is_pro, onboarding_completed, ai_context')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setIsPro(data?.is_pro || false);
      setOnboardingCompleted(data?.onboarding_completed || false);

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    profile, 
    loading, 
    isPro, 
    onboardingCompleted, 
    refresh: fetchProfile 
  };
}