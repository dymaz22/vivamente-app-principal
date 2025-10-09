import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth.jsx'

// LISTA FIXA DE SENTIMENTOS - A PARTIR DE AGORA, USAMOS ISSO
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

  const getDailyRoutine = async () => {
    if (!isAuthenticated || !user) return { success: false, error: 'Usuário não autenticado' }
    try {
      setIsLoading(true)
      setError(null)
      const today = new Date().toISOString().split('T')[0]
      const { data: existingRoutine } = await supabase.from('daily_routines').select('*').eq('user_id', user.id).eq('date', today).single()

      if (existingRoutine) {
        const structuredRoutine = {
          ...existingRoutine,
          completions: {
            lesson: existingRoutine.is_lesson_completed || false,
            quiz: existingRoutine.is_test_completed || false,
            task: existingRoutine.is_tool_completed || false,
            moodLog: existingRoutine.is_mood_logged || false
          }
        }
        setDailyRoutine(structuredRoutine)
        return { success: true, data: structuredRoutine }
      }

      const { data: lessons } = await supabase.from('lessons').select('*').limit(1)
      const { data: quizzes } = await supabase.from('quizzes').select('*').limit(1)
      const { data: tasks } = await supabase.from('user_tasks').select('*').limit(1)
      const newRoutineData = {
        user_id: user.id, date: today, suggested_lesson_id: lessons?.[0]?.id,
        suggested_test_id: quizzes?.[0]?.id, suggested_tool_id: tasks?.[0]?.id,
        is_lesson_completed: false, is_test_completed: false, is_tool_completed: false, is_mood_logged: false
      }
      const { data: insertedRoutine } = await supabase.from('daily_routines').insert([newRoutineData]).select().single()
      const newRoutine = {
        ...(insertedRoutine || newRoutineData), lesson: lessons?.[0], quiz: quizzes?.[0],
        task: tasks?.[0], completions: { lesson: false, quiz: false, task: false, moodLog: false }
      }
      setDailyRoutine(newRoutine)
      return { success: true, data: newRoutine }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const addMoodLog = async (moodData) => {
    if (!isAuthenticated || !user) return { success: false, error: 'Usuário não autenticado' }

    try {
      const moodLog = {
        user_id: user.id,
        mood_level: moodData.level,
        mood: moodData.description, // Nome correto da coluna
        context_notes: moodData.context?.notes || '',
        context_location: moodData.context?.location || '',
        context_company: moodData.context?.company || '',
        context_activity: moodData.context?.activity || '',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase.from('mood_logs').insert([moodLog]).select().single()
      if (error) throw error

      if (moodData.sentiments && moodData.sentiments.length > 0 && data?.id) {
        const logSentiments = moodData.sentiments.map(sentimentId => ({
          mood_log_id: data.id, sentiment_id: sentimentId
        }))
        await supabase.from('log_sentiments').insert(logSentiments)
      }

      if (dailyRoutine) {
        const today = new Date().toISOString().split('T')[0]
        await supabase.from('daily_routines').update({ is_mood_logged: true }).eq('user_id', user.id).eq('date', today)
        setDailyRoutine(prev => ({
          ...prev, is_mood_logged: true,
          completions: { ...prev.completions, moodLog: true }
        }))
      }
      return { success: true, data }
    } catch (err) {
      console.error('Erro ao adicionar log de humor:', err)
      return { success: false, error: err.message }
    }
  }

  const markTaskAsCompleted = async (taskType) => {
    if (!isAuthenticated || !user || !dailyRoutine) return { success: false }
    try {
      const updateField = `is_${taskType}_completed`
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('daily_routines').update({ [updateField]: true }).eq('user_id', user.id).eq('date', today)
      setDailyRoutine(prev => ({ ...prev, [updateField]: true, completions: { ...prev.completions, [taskType]: true }}))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      getDailyRoutine()
    } else if (!authLoading && !isAuthenticated) {
      setDailyRoutine(null)
      setError(null)
    }
  }, [isAuthenticated, user, authLoading])

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
