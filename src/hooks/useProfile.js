import { useState, useEffect, useCallback } from 'react';
// import { supabase } from '../lib/supabaseClient'; // Nem vamos usar o banco agora

export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // TRUQUE: Iniciamos tudo como TRUE. O app vai achar que você é VIP supremo.
  const [isPro, setIsPro] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    
    // SIMULAÇÃO DE PERFIL CARREGADO
    // Não importa o que tem no banco, aqui dizemos que está tudo certo.
    console.log("🔓 MODO DEUS ATIVADO: Acesso liberado forçadamente.");
    
    setProfile({
      id: session.user.id,
      username: session.user.email,
      avatar_url: null,
      is_pro: true,
      onboarding_completed: true
    });

    setIsPro(true);
    setOnboardingCompleted(true);
    setLoading(false);

  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, isPro, onboardingCompleted, refresh: fetchProfile };
}