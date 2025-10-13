import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth.jsx';

const MOCKED_SENTIMENTS = [ /* ... seu array de sentimentos aqui ... */ ];

export const useRoutine = () => {
    const { user, isAuthenticated, authLoading } = useAuth();
    const [dailyRoutine, setDailyRoutine] = useState(null);
    const [sentimentsList, setSentimentsList] = useState(MOCKED_SENTIMENTS);
    const [isLoading, setIsLoading] = useState(true); // Começa carregando
    const [error, setError] = useState(null);

    const getDailyRoutine = async () => {
        if (!isAuthenticated || !user) {
            setIsLoading(false); // Para de carregar se não houver usuário
            return;
        }

        try {
            setError(null);
            const today = new Date().toISOString().split('T')[0];

            // 1. Busca a rotina mais recente do dia
            const { data: routineBase, error: routineError } = await supabase
                .from('daily_routines').select('*').eq('user_id', user.id).eq('date', today)
                .order('created_at', { ascending: false }).limit(1).maybeSingle();

            if (routineError) throw routineError;
            
            if (routineBase) {
                // LÓGICA CORRIGIDA: BUSCA CADA ITEM INDIVIDUALMENTE E À PROVA DE FALHAS
                let lessonDetails = null;
                if (routineBase.suggested_lesson_id) {
                    // .maybeSingle() não dá erro se não encontrar nada, apenas retorna null
                    const { data } = await supabase.from('lessons').select('*').eq('id', routineBase.suggested_lesson_id).maybeSingle();
                    lessonDetails = data;
                }

                let quizDetails = null;
                if (routineBase.suggested_test_id) {
                    const { data } = await supabase.from('quizzes').select('*').eq('id', routineBase.suggested_test_id).maybeSingle();
                    quizDetails = data;
                }

                let taskDetails = null;
                if (routineBase.suggested_tool_id) {
                    const { data } = await supabase.from('user_tasks').select('*').eq('id', routineBase.suggested_tool_id).maybeSingle();
                    taskDetails = data;
                }

                const fullRoutine = {
                    ...routineBase,
                    lesson: lessonDetails, quiz: quizDetails, task: taskDetails,
                    completions: {
                        lesson: routineBase.is_lesson_completed || false,
                        quiz: routineBase.is_test_completed || false,
                        task: routineBase.is_user_task_completed || false,
                        moodLog: routineBase.is_mood_logged || false
                    }
                };
                setDailyRoutine(fullRoutine);

            } else {
                // Cria uma nova rotina se não houver nenhuma
                const { data: lessons } = await supabase.from('lessons').select('id').order('id').limit(1);
                const { data: quizzes } = await supabase.from('quizzes').select('id').order('id').limit(1);
                const { data: tasks } = await supabase.from('user_tasks').select('id').order('id').limit(1);

                const newRoutineData = {
                    user_id: user.id, date: today,
                    suggested_lesson_id: lessons?.[0]?.id || null,
                    suggested_test_id: quizzes?.[0]?.id || null,
                    suggested_tool_id: tasks?.[0]?.id || null,
                };

                const { data: insertedRoutine, error: insertError } = await supabase
                    .from('daily_routines').insert(newRoutineData).select().single();
                
                if (insertError) throw insertError;
                await getDailyRoutine(); // Recarrega para obter todos os detalhes
            }

        } catch (err) {
            console.error('Erro detalhado no getDailyRoutine:', err);
            setError('Não foi possível carregar sua rotina.');
        } finally {
            setIsLoading(false); // Para de carregar no final de tudo
        }
    }
    
    useEffect(() => {
        // A função getDailyRoutine já tem a proteção, então podemos simplificar aqui
        getDailyRoutine();
    }, [isAuthenticated, user, authLoading]);

    return {
        dailyRoutine, sentimentsList, isLoading: authLoading || isLoading, isAuthenticated, user, error, getDailyRoutine,
        addMoodLog: async (moodData) => {
            if (!isAuthenticated || !user) return { success: false, error: 'Usuário não autenticado' };
            try {
                const moodLog = { user_id: user.id, mood_level: moodData.level, mood: moodData.description, context_notes: moodData.context?.notes || '', context_location: moodData.context?.location || '', context_company: moodData.context?.company || '', context_activity: moodData.context?.activity || '', created_at: new Date().toISOString() };
                const { data, error } = await supabase.from('mood_logs').insert([moodLog]).select().single();
                if (error) throw error;
                if (moodData.sentiments && moodData.sentiments.length > 0 && data?.id) {
                    const logSentiments = moodData.sentiments.map(sentimentId => ({ mood_log_id: data.id, sentiment_id: sentimentId }));
                    await supabase.from('log_sentiments').insert(logSentiments);
                }
                if (dailyRoutine) {
                    await supabase.from('daily_routines').update({ is_mood_logged: true }).eq('id', dailyRoutine.id);
                    await getDailyRoutine();
                }
                return { success: true, data };
            } catch (err) {
                console.error('Erro ao adicionar log de humor:', err);
                return { success: false, error: err.message };
            }
        },
        markTaskAsCompleted: async (taskType) => {
            if (!isAuthenticated || !user || !dailyRoutine?.id) return { success: false };
            const columnMapping = { lesson: 'is_lesson_completed', quiz: 'is_test_completed', task: 'is_user_task_completed' };
            const columnToUpdate = columnMapping[taskType];
            if (!columnToUpdate) return { success: false, error: `Tipo de tarefa inválido` };
            try {
                const { error } = await supabase.from('daily_routines').update({ [columnToUpdate]: true }).eq('id', dailyRoutine.id);
                if (error) throw error;
                await getDailyRoutine();
                return { success: true };
            } catch (err) {
                console.error(`Erro ao marcar a tarefa '${taskType}' como concluída:`, err.message);
                return { success: false, error: err.message };
            }
        }
    };
};