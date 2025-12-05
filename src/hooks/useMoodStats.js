import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { format } from 'date-fns';

export const useMoodStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLogs: 0,
    mostCommonSentiments: [], // Mantido para compatibilidade
    allSentiments: [], // NOVO: Lista completa com contagem
    avgEnergyLevel: 0,
    topLocations: [],
    topCompanies: [],
    topActivities: [],
  });
  const [chartData, setChartData] = useState([]);
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
      // 1. Buscar logs com contexto
      const { data: moodLogs, error: logsError } = await supabase
        .from('mood_logs')
        .select('id, mood_level, created_at, context_location, context_company, context_activity')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (logsError) throw logsError;

      // Formata dados para o gráfico
      const formattedChartData = moodLogs.map(log => ({
        date: format(new Date(log.created_at), 'dd/MM'),
        Nível: log.mood_level,
      }));
      setChartData(formattedChartData);

      const totalLogs = moodLogs.length;
      if (totalLogs === 0) {
        setStats({ 
            totalLogs: 0, 
            mostCommonSentiments: [], 
            allSentiments: [],
            avgEnergyLevel: 0,
            topLocations: [],
            topCompanies: [],
            topActivities: []
        });
        setLoading(false);
        return;
      }

      // Calcular nível de energia médio
      const totalEnergy = moodLogs.reduce((acc, log) => acc + log.mood_level, 0);
      const avgEnergyLevel = totalLogs > 0 ? (totalEnergy / totalLogs).toFixed(1) : 0;

      // Estatísticas de Contexto
      const calculateContextStats = (logs, field) => {
        const counts = logs.reduce((acc, log) => {
            const value = log[field];
            if (value) {
                acc[value] = (acc[value] || 0) + 1;
            }
            return acc;
        }, {});
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count }));
      };

      const topLocations = calculateContextStats(moodLogs, 'context_location');
      const topCompanies = calculateContextStats(moodLogs, 'context_company');
      const topActivities = calculateContextStats(moodLogs, 'context_activity');

      // Buscar sentimentos
      const logIds = moodLogs.map(log => log.id);
      const { data: sentimentsData, error: sentimentsError } = await supabase
        .from('log_sentiments')
        .select('sentiments ( name )')
        .in('log_id', logIds);

      if (sentimentsError) throw sentimentsError;

      // Calcular sentimentos (Lógica Atualizada)
      const sentimentCounts = sentimentsData.reduce((acc, item) => {
        const sentimentName = item.sentiments.name;
        acc[sentimentName] = (acc[sentimentName] || 0) + 1;
        return acc;
      }, {});

      // Lista completa ordenada
      const allSentimentsSorted = Object.entries(sentimentCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      // Top 3 apenas os nomes (para compatibilidade com AnaliseHumor.jsx)
      const top3Names = allSentimentsSorted.slice(0, 3).map(item => item.name);

      setStats({
        totalLogs,
        mostCommonSentiments: top3Names,
        allSentiments: allSentimentsSorted, // Nova propriedade
        avgEnergyLevel,
        topLocations,
        topCompanies,
        topActivities
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

  return { stats, chartData, loading, error, refreshStats: fetchMoodStats };
};