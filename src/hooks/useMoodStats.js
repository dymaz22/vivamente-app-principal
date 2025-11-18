import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export const useMoodStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLogs: 0,
    mostCommonSentiments: [],
    avgEnergyLevel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoodStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Buscar todos os mood_logs do usuário
      const { data: moodLogs, error: logsError } = await supabase
        .from('mood_logs')
        .select('id, mood_level')
        .eq('user_id', user.id);

      if (logsError) throw logsError;

      const totalLogs = moodLogs.length;
      if (totalLogs === 0) {
        setStats({ totalLogs: 0, mostCommonSentiments: [], avgEnergyLevel: 0 });
        setLoading(false);
        return;
      }

      // 2. Calcular o nível de energia médio
      const totalEnergy = moodLogs.reduce((acc, log) => acc + log.mood_level, 0);
      const avgEnergyLevel = totalLogs > 0 ? (totalEnergy / totalLogs).toFixed(1) : 0;

      // 3. Buscar os NOMES dos sentimentos através da tabela de ligação
      const logIds = moodLogs.map(log => log.id);
      const { data: sentimentsData, error: sentimentsError } = await supabase
        .from('log_sentiments')
        .select('sentiments ( name )') // CORREÇÃO: Busca o 'name' da tabela 'sentiments'
        .in('log_id', logIds);

      if (sentimentsError) throw sentimentsError;

      // 4. Calcular os sentimentos mais comuns a partir da nova estrutura de dados
      const sentimentCounts = sentimentsData.reduce((acc, item) => {
        const sentimentName = item.sentiments.name; // CORREÇÃO: Acessa o nome do sentimento
        acc[sentimentName] = (acc[sentimentName] || 0) + 1;
        return acc;
      }, {});

      const sortedSentiments = Object.entries(sentimentCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(item => item[0]);

      setStats({
        totalLogs,
        mostCommonSentiments: sortedSentiments,
        avgEnergyLevel,
      });

    } catch (err) {
      console.error("Erro ao buscar estatísticas de humor:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMoodStats();
  }, [fetchMoodStats]);

  return { stats, loading, error, refreshStats: fetchMoodStats };
};