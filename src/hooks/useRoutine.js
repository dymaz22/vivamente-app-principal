import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth.jsx'

// Hook principal para a funcionalidade de Rotina
export const useRoutine = () => {
  const { user, session, authLoading, isAuthenticated } = useAuth()
  const [dailyRoutine, setDailyRoutine] = useState(null)
  const [sentimentsList, setSentimentsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSentimentsLoading, setIsSentimentsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Função para buscar sentimentos do Supabase
  const getSentiments = async () => {
    // PROTEÇÃO DE AUTENTICAÇÃO: Não buscar dados se não estiver autenticado
    if (!isAuthenticated || !user) {
      console.log('getSentiments: Usuário não autenticado, pulando busca')
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsSentimentsLoading(true)
      setError(null)
      console.log('getSentiments: Iniciando busca de sentimentos...')
      
      // LINHA CRÍTICA CORRIGIDA: Usar destructuring correto
      const { data, error } = await supabase.from('sentiments').select('*').order('name', { ascending: true })
      
      if (error) {
        throw error
      }
      
      console.log('getSentiments: Dados recebidos:', data)
      
      // LINHA CRÍTICA: Garantir que o data seja passado diretamente
      if (data) {
        setSentimentsList(data)
        console.log('getSentiments: Estado atualizado com', data.length, 'sentimentos')
      } else {
        setSentimentsList([])
        console.log('getSentiments: Nenhum dado recebido, lista limpa')
      }
      
      return { success: true, data }
      
    } catch (err) {
      console.error('getSentiments: Erro ao buscar sentimentos:', err)
      setError(err.message)
      setSentimentsList([])
      return { success: false, error: err.message }
    } finally {
      console.log('getSentiments: Finalizando carregamento...')
      setIsSentimentsLoading(false)
    }
  }

  // Função principal para obter/criar rotina diária
  const getDailyRoutine = async () => {
    // PROTEÇÃO DE AUTENTICAÇÃO: Não buscar dados se não estiver autenticado
    if (!isAuthenticated || !user) {
      console.log('getDailyRoutine: Usuário não autenticado, pulando busca')
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const today = new Date().toISOString().split('T')[0]
      
      // Verificar se já existe rotina para hoje
      const { data: existingRoutine } = await supabase
        .from('daily_routines')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (existingRoutine) {
        // Estruturar a rotina existente com dados completos
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
        setIsLoading(false)
        return { success: true, data: structuredRoutine }
      }

      // Se não existe, criar uma nova rotina
      const { data: lessons } = await supabase.from('lessons').select('*').limit(1)
      const { data: quizzes } = await supabase.from('quizzes').select('*').limit(1)
      const { data: tasks } = await supabase.from('user_tasks').select('*').limit(1)

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
      }

      // Inserir nova rotina no banco
      const { data: insertedRoutine, error: insertError } = await supabase
        .from('daily_routines')
        .insert([newRoutineData])
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao inserir rotina:', insertError)
        // Se falhar ao inserir, usar dados mockados para não quebrar a UI
      }

      const newRoutine = {
        ...(insertedRoutine || newRoutineData),
        lesson: lessons?.[0] || null,
        quiz: quizzes?.[0] || null,
        task: tasks?.[0] || null,
        completions: {
          lesson: false,
          quiz: false,
          task: false,
          moodLog: false
        }
      }

      setDailyRoutine(newRoutine)
      setIsLoading(false)
      
      return { success: true, data: newRoutine }
      
    } catch (err) {
      console.error('Erro ao obter rotina diária:', err)
      setError(err.message)
      setIsLoading(false)
      return { success: false, error: err.message }
    }
  }

  // Função para adicionar log de humor
  const addMoodLog = async (moodData) => {
    // PROTEÇÃO DE AUTENTICAÇÃO: Não executar se não estiver autenticado
    if (!isAuthenticated || !user) {
      console.log('addMoodLog: Usuário não autenticado')
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      const moodLog = {
        user_id: user.id,
        mood_level: moodData.level,
        mood_description: moodData.description,
        context_notes: moodData.context?.notes || '',
        context_location: moodData.context?.location || '',
        context_company: moodData.context?.company || '',
        context_activity: moodData.context?.activity || '',
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase.from('mood_logs').insert([moodLog]).select()
      
      if (error) throw error

      // Adicionar sentimentos relacionados
      if (moodData.sentiments && moodData.sentiments.length > 0 && data?.[0]?.id) {
        const logSentiments = moodData.sentiments.map(sentimentId => ({
          mood_log_id: data[0].id,
          sentiment_id: sentimentId
        }))

        await supabase.from('log_sentiments').insert(logSentiments)
      }

      // Atualizar rotina para marcar humor como registrado
      if (dailyRoutine) {
        const today = new Date().toISOString().split('T')[0]
        await supabase
          .from('daily_routines')
          .update({ is_mood_logged: true })
          .eq('user_id', user.id)
          .eq('date', today)

        // Atualizar estado local
        setDailyRoutine(prev => ({
          ...prev,
          is_mood_logged: true,
          completions: {
            ...prev.completions,
            moodLog: true
          }
        }))
      }

      return { success: true, data }
      
    } catch (err) {
      console.error('Erro ao adicionar log de humor:', err)
      return { success: false, error: err.message }
    }
  }

  // Função para marcar tarefa como completada
  const markTaskAsCompleted = async (taskType) => {
    // PROTEÇÃO DE AUTENTICAÇÃO: Não executar se não estiver autenticado
    if (!isAuthenticated || !user) {
      console.log('markTaskAsCompleted: Usuário não autenticado')
      return { success: false, error: 'Usuário não autenticado' }
    }

    try {
      if (!dailyRoutine) return { success: false, error: 'Rotina não encontrada' }

      const updateField = `is_${taskType}_completed`
      const today = new Date().toISOString().split('T')[0]
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('daily_routines')
        .update({ [updateField]: true })
        .eq('user_id', user.id)
        .eq('date', today)

      if (error) {
        console.error('Erro ao atualizar tarefa no banco:', error)
        // Continuar mesmo com erro para não quebrar a UX
      }
      
      // Atualizar estado local
      setDailyRoutine(prev => ({
        ...prev,
        [updateField]: true,
        completions: {
          ...prev.completions,
          [taskType]: true
        }
      }))
      
      return { success: true }
      
    } catch (err) {
      console.error('Erro ao marcar tarefa como completada:', err)
      return { success: false, error: err.message }
    }
  }

  // Auto-carregar dados quando usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log('useRoutine: Usuário autenticado, carregando dados...')
      getDailyRoutine()
      getSentiments()
    } else if (!authLoading && !isAuthenticated) {
      console.log('useRoutine: Usuário não autenticado, limpando dados...')
      setDailyRoutine(null)
      setSentimentsList([])
      setError(null)
    }
  }, [isAuthenticated, user, authLoading])

  return {
    // Dados
    dailyRoutine,
    sentimentsList,
    
    // Estados de carregamento
    isLoading: authLoading || isLoading,
    isSentimentsLoading,
    
    // Estados de autenticação
    isAuthenticated,
    authLoading,
    user,
    
    // Erros
    error,
    
    // Funções
    getDailyRoutine,
    getSentiments,
    addMoodLog,
    markTaskAsCompleted
  }
}
