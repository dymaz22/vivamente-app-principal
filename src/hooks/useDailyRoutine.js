import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './useAuth.jsx';

// Função auxiliar para obter a data de hoje formatada (YYYY-MM-DD)
const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const useDailyRoutine = () => {
    const { user } = useAuth();
    const [completedActivities, setCompletedActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback para evitar recriações desnecessárias da função
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
                .select('activity_type') // Só precisamos saber o tipo da atividade
                .eq('user_id', user.id)
                .eq('completed_date', today);

            if (error) throw error;
            
            // Transforma [{activity_type: 'lesson'}, {activity_type: 'quiz'}] em ['lesson', 'quiz']
            setCompletedActivities(data.map(item => item.activity_type));

        } catch (err) {
            console.error('Erro ao buscar progresso da rotina:', err.message);
            setError('Falha ao carregar progresso da rotina.');
        } finally {
            setLoading(false);
        }
    }, [user]); // A dependência é o usuário

    // Efeito para buscar os dados na montagem do componente
    useEffect(() => {
        fetchCompletedActivities();
    }, [fetchCompletedActivities]);

    // Função para marcar uma atividade como concluída
    const completeActivity = async (activityType) => {
        if (!user || completedActivities.includes(activityType)) return;

        // Atualização otimista
        setCompletedActivities(current => [...current, activityType]);
        
        try {
            const { error } = await supabase
                .from('daily_activity_progress')
                .insert({
                    user_id: user.id,
                    activity_type: activityType,
                    completed_date: getTodayDateString(),
                });

            if (error) {
                console.error('Falha ao salvar progresso, revertendo:', error.message);
                // Reverte em caso de erro
                setCompletedActivities(current => current.filter(act => act !== activityType));
            }
        } catch (err) {
            console.error('Erro ao completar atividade:', err.message);
            setCompletedActivities(current => current.filter(act => act !== activityType));
        }
    };

    return {
        completedActivities,
        loading,
        error,
        completeActivity,
        refetchActivities: fetchCompletedActivities, // Para recarregar os dados se necessário
    };
};