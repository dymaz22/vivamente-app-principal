import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './useAuth.jsx';

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useDailyRoutine = () => {
  const { user } = useAuth();
  const [completedActivities, setCompletedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompletedActivities = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const today = getTodayDateString();

      const { data, error } = await supabase
        .from('daily_activity_progress')
        .select('activity_type')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      if (error) throw error;

      setCompletedActivities(data.map(item => item.activity_type));
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar rotina.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCompletedActivities();
  }, [fetchCompletedActivities]);

  const completeActivity = async (activityType) => {
    if (!user || completedActivities.includes(activityType)) return;

    setCompletedActivities(current => [...current, activityType]);

    try {
      // 1️⃣ Salva progresso
      const { error } = await supabase
        .from('daily_activity_progress')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          completed_date: getTodayDateString(),
        });

      if (error) throw error;

      // 2️⃣ Registra EVENTO PARA A IA
      await supabase.from('user_events').insert({
        user_id: user.id,
        type: 'routine_completed',
        payload: {
          activity: activityType,
          date: getTodayDateString(),
        },
      });

    } catch (err) {
      console.error(err);
      setCompletedActivities(current =>
        current.filter(act => act !== activityType)
      );
    }
  };

  return {
    completedActivities,
    loading,
    error,
    completeActivity,
    refetchActivities: fetchCompletedActivities,
  };
};
