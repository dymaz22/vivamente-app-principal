import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import { format } from 'date-fns'; // Importa a função de formatação de data

export const useMoodStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLogs: 0,
    mostCommonSentiments: [],
    avgEnergyLevel: 0,
  });
  const [chartData, setChartData] = useState([]); // NOVO: Estado para os dados do gráfico
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
      // 1. Buscar todos os mood_logs do usuário, incluindo a data de criação
      const { data: moodLogs, error: logsError } = await supabase
        .from('mood_logs')
        .select('id, mood_level, created_at') // Adicionado 'created_at'
        .eq('user_id', user.id)
        .order('created_at', { ascending: true }); // Ordena por data

      if (logsError) throw logsError;

      // NOVO: Formata os dados para o gráfico
      const formattedChartData = moodLogs.map(log => ({
        date: format(new Date(log.created_at), 'dd/MM'), // Formata a data para 'dia/mês'
        Nível: log.mood_level, // 'Nível' será o nome da linha no gráfico
      }));
      setChartData(formattedChartData);

      const totalLogs = moodLogs.length;
      if (totalLogs === 0) {
        setStats({ totalLogs: 0, mostCommonSentiments: [], avgEnergyLevel: 0 });
        setLoading(false);
        return;
      }

      // 2. Calcular o nível de energia médio
      const totalEnergy = moodLogs.reduce((acc, log) => acc + log.mood_level, 0);
      const avgEnergyLevel = totalLogs > 0 ? (totalEnergy / totalLogs).toFixed(1) : 0;

      // 3. Buscar os NOMES dos sentimentos
      const logIds = moodLogs.map(log => log.id);
      const { data: sentimentsData, error: sentimentsError } = await supabase
        .from('log_sentiments')
        .select('sentiments ( name )')
        .in('log_id', logIds);

      if (sentimentsError) throw sentimentsError;

      // 4. Calcular os sentimentos mais comuns
      const sentimentCounts = sentimentsData.reduce((acc, item) => {
        const sentimentName = item.sentiments.name;
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

  // Retorna os dados do gráfico junto com as outras estatísticas
  return { stats, chartData, loading, error, refreshStats: fetchMoodStats };
};