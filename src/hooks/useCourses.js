import { useState, useEffect } from 'react'

// Mock do Supabase client - será substituído pela implementação real
const getSupabaseClient = async () => {
  // Simulação do cliente Supabase
  return {
    from: (table) => ({
      select: (fields) => ({
        eq: (field, value) => ({
          order: (field, options) => {
            return new Promise((resolve) => {
              // Dados mockados para desenvolvimento
              if (table === 'courses') {
                const mockCourses = [
                  {
                    id: 1,
                    title_pt: 'Mindfulness Básico',
                    description_pt: 'Aprenda os fundamentos do mindfulness',
                    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
                  },
                  {
                    id: 2,
                    title_pt: 'Gestão de Ansiedade',
                    description_pt: 'Técnicas para controlar a ansiedade',
                    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
                  }
                ]
                resolve({ data: mockCourses.filter(c => c.id === value), error: null })
              } else if (table === 'lessons') {
                const mockLessons = [
                  {
                    id: 1,
                    course_id: 1,
                    title_pt: 'Introdução ao Mindfulness',
                    content_pt: 'Conteúdo da primeira lição sobre os fundamentos do mindfulness...',
                    video_url: 'https://www.youtube.com/watch?v=example1',
                    order: 1
                  },
                  {
                    id: 2,
                    course_id: 1,
                    title_pt: 'Respiração Consciente',
                    content_pt: 'Conteúdo da segunda lição sobre técnicas de respiração...',
                    video_url: 'https://www.youtube.com/watch?v=example2',
                    order: 2
                  },
                  {
                    id: 3,
                    course_id: 1,
                    title_pt: 'Meditação Guiada',
                    content_pt: 'Conteúdo da terceira lição sobre meditação...',
                    video_url: 'https://www.youtube.com/watch?v=example3',
                    order: 3
                  }
                ]
                resolve({ data: mockLessons.filter(l => l.course_id === value || l.id === value), error: null })
              } else if (table === 'user_progress') {
                const mockProgress = [
                  { user_id: 'user1', lesson_id: 1, is_completed: true, completed_at: new Date(), rating: 5 }
                ]
                resolve({ data: mockProgress, error: null })
              } else if (table === 'lesson_comments') {
                const mockComments = [
                  { id: 1, user_id: 'user1', lesson_id: 1, content: 'Ótima lição!', created_at: new Date() },
                  { id: 2, user_id: 'user2', lesson_id: 1, content: 'Muito útil!', created_at: new Date() }
                ]
                resolve({ data: mockComments.filter(c => c.lesson_id === value), error: null })
              }
            })
          }
        }),
        order: (field, options) => {
          return new Promise((resolve) => {
            if (table === 'courses') {
              const mockCourses = [
                {
                  id: 1,
                  title_pt: 'Mindfulness Básico',
                  description_pt: 'Aprenda os fundamentos do mindfulness',
                  image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
                },
                {
                  id: 2,
                  title_pt: 'Gestão de Ansiedade',
                  description_pt: 'Técnicas para controlar a ansiedade',
                  image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
                }
              ]
              resolve({ data: mockCourses, error: null })
            } else if (table === 'lessons') {
              const mockLessons = [
                {
                  id: 1,
                  course_id: 1,
                  title_pt: 'Introdução ao Mindfulness',
                  content_pt: 'Conteúdo da primeira lição',
                  video_url: 'https://www.youtube.com/watch?v=example1',
                  order: 1
                },
                {
                  id: 2,
                  course_id: 1,
                  title_pt: 'Respiração Consciente',
                  content_pt: 'Conteúdo da segunda lição',
                  video_url: 'https://www.youtube.com/watch?v=example2',
                  order: 2
                },
                {
                  id: 3,
                  course_id: 1,
                  title_pt: 'Meditação Guiada',
                  content_pt: 'Conteúdo da terceira lição',
                  video_url: 'https://www.youtube.com/watch?v=example3',
                  order: 3
                }
              ]
              resolve({ data: mockLessons, error: null })
            }
          })
        }
      })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'user1' } } })
    }
  }
}

export const useCourses = (language = 'pt') => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      const titleField = `title_${language}`
      const descriptionField = `description_${language}`
      
      const result = await supabase
        .from('courses')
        .select(`id, ${titleField}, ${descriptionField}, image_url`)
        .order('id', { ascending: true })

      if (result.error) throw result.error
      setCourses(result.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar cursos:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [language])

  const refetch = () => {
    fetchCourses()
  }

  return {
    courses,
    loading,
    error,
    refetch
  }
}

export const useCourseDetails = (courseId, language = 'pt') => {
  const [courseDetails, setCourseDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      // Buscar detalhes do curso
      const courseResult = await supabase
        .from('courses')
        .select(`id, title_${language}, description_${language}, image_url`)
        .eq('id', courseId)

      if (courseResult.error) throw courseResult.error
      
      const course = courseResult.data[0]
      if (!course) {
        throw new Error('Curso não encontrado')
      }

      // Buscar lições do curso
      const lessonsResult = await supabase
        .from('lessons')
        .select(`id, title_${language}, content_${language}, video_url, order`)
        .eq('course_id', courseId)
        .order('order', { ascending: true })

      if (lessonsResult.error) throw lessonsResult.error

      // Buscar progresso do usuário
      const { data: { user } } = await supabase.auth.getUser()
      const progressResult = await supabase
        .from('user_progress')
        .select('lesson_id, is_completed, completed_at, rating')
        .eq('user_id', user?.id || 'user1')

      if (progressResult.error) throw progressResult.error

      // Calcular status das lições
      const progressMap = new Map(
        progressResult.data.map(p => [p.lesson_id, p])
      )

      let nextLessonFound = false
      const lessonsWithStatus = lessonsResult.data.map((lesson, index) => {
        const progress = progressMap.get(lesson.id)
        let status = 'bloqueada'

        if (progress?.is_completed) {
          status = 'concluida'
        } else if (index === 0 || lessonsResult.data[index - 1] && progressMap.get(lessonsResult.data[index - 1].id)?.is_completed) {
          status = 'liberada'
          if (!nextLessonFound) {
            nextLessonFound = true
          }
        }

        return {
          ...lesson,
          status,
          progress: progress || null
        }
      })

      setCourseDetails({
        ...course,
        lessons: lessonsWithStatus
      })
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar detalhes do curso:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId, language])

  const refetch = () => {
    fetchCourseDetails()
  }

  return {
    courseDetails,
    loading,
    error,
    refetch
  }
}

export const useLessonDetails = (lessonId, language = 'pt') => {
  const [lessonDetails, setLessonDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLessonDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      // Buscar detalhes da lição
      const lessonResult = await supabase
        .from('lessons')
        .select(`id, course_id, title_${language}, content_${language}, video_url, order`)
        .eq('id', lessonId)

      if (lessonResult.error) throw lessonResult.error
      
      const lesson = lessonResult.data[0]
      if (!lesson) {
        throw new Error('Lição não encontrada')
      }

      // Buscar comentários da lição
      const commentsResult = await supabase
        .from('lesson_comments')
        .select('id, user_id, content, created_at')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false })

      if (commentsResult.error) throw commentsResult.error

      // Buscar progresso do usuário para esta lição
      const { data: { user } } = await supabase.auth.getUser()
      const progressResult = await supabase
        .from('user_progress')
        .select('is_completed, completed_at, rating')
        .eq('user_id', user?.id || 'user1')
        .eq('lesson_id', lessonId)

      if (progressResult.error) throw progressResult.error

      const userProgress = progressResult.data[0] || null

      setLessonDetails({
        ...lesson,
        comments: commentsResult.data,
        userProgress
      })
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar detalhes da lição:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetails()
    }
  }, [lessonId, language])

  const refetch = () => {
    fetchLessonDetails()
  }

  return {
    lessonDetails,
    loading,
    error,
    refetch
  }
}

export const useLastActivity = () => {
  const [lastActivity, setLastActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLastActivity = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock da busca da última atividade
      const mockLastActivity = {
        id: 2,
        course_id: 1,
        title_pt: 'Respiração Consciente',
        content_pt: 'Próxima lição a ser feita',
        video_url: 'https://www.youtube.com/watch?v=example2',
        order: 2,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
      }
      
      setLastActivity(mockLastActivity)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar última atividade:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLastActivity()
  }, [])

  const refetch = () => {
    fetchLastActivity()
  }

  return {
    lastActivity,
    loading,
    error,
    refetch
  }
}

// Importar hooks de quizzes do arquivo específico
import { useQuizzes as useQuizzesFromFile } from './useQuizzes'

export const useQuizzes = useQuizzesFromFile

// Ações (Mutations)
export const markLessonAsComplete = async (lessonId) => {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Mock da marcação como completa
    console.log(`Marcando lição ${lessonId} como completa para usuário ${user?.id || 'user1'}`)
    
    return { success: true, data: { lesson_id: lessonId, is_completed: true, completed_at: new Date() } }
  } catch (error) {
    console.error('Erro ao marcar lição como completa:', error)
    return { success: false, error: error.message }
  }
}

export const submitLessonRating = async (lessonId, rating) => {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Mock da avaliação da lição
    console.log(`Avaliando lição ${lessonId} com nota ${rating} para usuário ${user?.id || 'user1'}`)
    
    return { success: true, data: { lesson_id: lessonId, rating, user_id: user?.id || 'user1' } }
  } catch (error) {
    console.error('Erro ao avaliar lição:', error)
    return { success: false, error: error.message }
  }
}

export const submitLessonComment = async (lessonId, content) => {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Mock do comentário da lição
    console.log(`Adicionando comentário na lição ${lessonId} para usuário ${user?.id || 'user1'}: ${content}`)
    
    const newComment = {
      id: Date.now(),
      lesson_id: lessonId,
      user_id: user?.id || 'user1',
      content,
      created_at: new Date()
    }
    
    return { success: true, data: newComment }
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error)
    return { success: false, error: error.message }
  }
}

