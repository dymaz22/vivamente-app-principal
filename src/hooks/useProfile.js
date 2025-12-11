import { useState, useEffect, useCallback } from 'react';
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
      
      // ALTERAÇÃO AQUI: Removi 'avatar_url' e 'username' para parar o erro
      // Estamos buscando apenas o essencial para o fluxo funcionar
      const { data, error } = await supabase
        .from('profiles')
        .select('is_pro, onboarding_completed, ai_context')
        .eq('id', session.user.id)
        .single();

      // Se der erro, não vamos travar o app, vamos assumir valores padrão
      if (error) {
        console.warn('Perfil incompleto, usando padrões.', error);
        setIsPro(false);
        setOnboardingCompleted(false);
      } else {
        setProfile(data);
        setIsPro(data?.is_pro || false);
        setOnboardingCompleted(data?.onboarding_completed || false);
      }

    } catch (error) {
      console.error('Erro fatal ao carregar perfil:', error);
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