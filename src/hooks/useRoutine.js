import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth.jsx'

// LISTA FIXA DE SENTIMENTOS (Não alterada)
const MOCKED_SENTIMENTS = [
  { id: 1, name: 'Feliz', category: 'Positivo' }, { id: 2, name: 'Animado', category: 'Positivo' },
  { id: 3, name: 'Grato', category: 'Positivo' }, { id: 4, name: 'Relaxado', category: 'Positivo' },
  { id: 5, name: 'Triste', category: 'Negativo' }, { id: 6, name: 'Ansioso', category: 'Negativo' },
  { id: 7, name: 'Irritado', category: 'Negativo' }, { id: 8, name: 'Cansado', category: 'Negativo' },
  { id: 9, name: 'Normal', category: 'Neutro' }, { id: 10, name: 'Ok', category: 'Neutro' },
  { id: 11, name: 'Pensativo', category: 'Neutro' }, { id: 12, name: 'Focado', category: 'Neutro' },
]

export const useRoutine = () => {
  const { user, isAuthenticated, authLoading } = useAuth()
  const [dailyRoutine, setDailyRoutine] = useState(null)
  const [sentimentsList, setSentimentsList] = useState(MOCKED_SENTIMENTS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // FUNÇÃO getDailyRoutine (Não alterada)
  const getDailyRoutine = async () => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    try {
      setIsLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];

      let { data: existingRoutines, error: selectError } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (selectError) throw selectError;

      if (existingRoutines && existingRoutines.length > 0) {
        const routine = existingRoutines[0];
        setDailyRoutine({
          ...routine,
          completions: {
            lesson: routine.is_lesson_completed || false,
            quiz: routine.is_test_completed || false,
            task: routine.is_tool_completed || false,
            moodLog: routine.is_mood_logged || false
          }
        });
        return { success: true, data: routine };
      }

      const { data: lessons } = await supabase.from('lessons').select('id').limit(1);
      const { data: quizzes } = await supabase.from('quizzes').select('id').limit(1);
      const { data: tasks } = await supabase.from('user_tasks').select('id').limit(1);

      const newRoutineData = {
        user_id: user.id,
        date: today,
        suggested_lesson_id: lessons?.[0]?.id || null,
        suggested_test_id: quizzes?.[0]?.id || null,
        suggested_tool_id: tasks?.[0]?.id || null,
        is_lesson_completed: false,
        is_test_completed: false,
        is_tool_completed: false,
        is_mood_logged: false
      };

      const { data: insertedRoutine, error: insertError } = await supabase
        .from('daily_routines')
        .insert(newRoutineData)
        .select()
        .single();

      if (insertError) throw insertError;

      const newRoutine = {
        ...insertedRoutine,
        completions: { lesson: false, quiz: false, task: false, moodLog: false }
      };
      setDailyRoutine(newRoutine);
      return { success: true, data: newRoutine };

    } catch (err) {
      console.error('Erro detalhado no getDailyRoutine:', err);
      setError('Não foi possível carregar sua rotina.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }

  // Função addMoodLog (Não alterada)
  const addMoodLog = async (moodData) => {
    if (!isAuthenticated || !user) return { success: false, error: 'Usuário não autenticado' }
    try {
      const moodLog = { user_id: user.id, mood_level: moodData.level, mood: moodData.description, context_notes: moodData.context?.notes || '', context_location: moodData.context?.location || '', context_company: moodData.context?.company || '', context_activity: moodData.context?.activity || '', created_at: new Date().toISOString() }
      const { data, error } = await supabase.from('mood_logs').insert([moodLog]).select().single()
      if (error) throw error
      if (moodData.sentiments && moodData.sentiments.length > 0 && data?.id) {
        const logSentiments = moodData.sentiments.map(sentimentId => ({ mood_log_id: data.id, sentiment_id: sentimentId }))
        await supabase.from('log_sentiments').insert(logSentiments)
      }
      if (dailyRoutine) {
        const today = new Date().toISOString().split('T')[0]
        await supabase.from('daily_routines').update({ is_mood_logged: true }).eq('user_id', user.id).eq('date', today)
        // A atualização da tela será feita pelo getDailyRoutine() para consistência
        await getDailyRoutine();
      }
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao adicionar log de humor:', err)
      return { success: false, error: err.message }
    }
  }

  // >>>>> FUNÇÃO markTaskAsCompleted TOTALMENTE CORRIGIDA <<<<<
  const markTaskAsCompleted = async (taskType) => {
    if (!isAuthenticated || !user || !dailyRoutine?.id) {
      console.error("Usuário ou rotina não disponíveis para atualização.");
      return { success: false };
    }

    // Mapeia o tipo de tarefa para o nome da coluna no banco de dados
    // Isso garante que estamos atualizando a coluna correta (ex: 'quiz' vira 'is_test_completed')
    const columnMapping = {
      lesson: 'is_lesson_completed',
      quiz: 'is_test_completed', // Nome da sua coluna para testes/quizzes
      task: 'is_tool_completed'   // Nome da sua coluna para ferramentas/tarefas
    };

    const columnToUpdate = columnMapping[taskType];

    if (!columnToUpdate) {
        console.error(`Tipo de tarefa inválido: ${taskType}`);
        return { success: false, error: `Tipo de tarefa inválido` };
    }

    try {
      // Atualiza a coluna correta no Supabase usando o ID da rotina
      const { error } = await supabase
        .from('daily_routines')
        .update({ [columnToUpdate]: true })
        .eq('id', dailyRoutine.id);

      if (error) throw error;

      // PASSO CRUCIAL: Busca os dados novamente para garantir que a tela seja atualizada
      console.log(`Tarefa '${taskType}' marcada com sucesso. Atualizando rotina...`);
      await getDailyRoutine();

      return { success: true };

    } catch (err) {
      console.error(`Erro ao marcar a tarefa '${taskType}' como concluída:`, err.message);
      return { success: false, error: err.message };
    }
  }

  // useEffect (Não alterado)
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      getDailyRoutine()
    } else if (!authLoading && !isAuthenticated) {
      setDailyRoutine(null)
      setError(null)
    }
  }, [isAuthenticated, user, authLoading])

  // return (Não alterado)
  return {
    dailyRoutine,
    sentimentsList,
    isLoading: authLoading || isLoading,
    isAuthenticated,
    user,
    error,
    getDailyRoutine,
    addMoodLog,
    markTaskAsCompleted
  }
}