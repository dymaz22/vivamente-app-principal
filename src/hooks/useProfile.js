import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const GOD_MODE = import.meta.env.VITE_GOD_MODE === "true";

export function useProfile(session) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPro, setIsPro] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      setIsPro(false);
      setOnboardingCompleted(false);
      setLoading(false);
      return;
    }

    // ✅ MODO DEUS (controlado por ENV)
    if (GOD_MODE) {
      console.log("🔓 MODO DEUS ATIVADO (ENV): Acesso liberado forçadamente.");
      const forced = {
        id: session.user.id,
        username: session.user.email,
        avatar_url: null,
        is_pro: true,
        onboarding_completed: true,
        ai_context: null,
      };

      setProfile(forced);
      setIsPro(true);
      setOnboardingCompleted(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, is_pro, onboarding_completed, ai_context")
        .eq("id", session.user.id)
        .single();

      // Se não existir (não deveria por causa do trigger), criamos como fallback.
      if (error && status === 406) {
        const payload = {
          id: session.user.id,
          username: session.user.email,
          is_pro: false,
          onboarding_completed: false,
          ai_context: null,
        };

        const { data: created, error: createError } = await supabase
          .from("profiles")
          .upsert(payload, { onConflict: "id" })
          .select("id, username, avatar_url, is_pro, onboarding_completed, ai_context")
          .single();

        if (createError) throw createError;

        setProfile(created);
        setIsPro(!!created?.is_pro);
        setOnboardingCompleted(!!created?.onboarding_completed);
        setLoading(false);
        return;
      }

      if (error) throw error;

      setProfile(data);
      setIsPro(!!data?.is_pro);
      setOnboardingCompleted(!!data?.onboarding_completed);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar profile:", err);
      setProfile(null);
      setIsPro(false);
      setOnboardingCompleted(false);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, isPro, onboardingCompleted, refresh: fetchProfile };
}
