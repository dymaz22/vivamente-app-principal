import { useState, useEffect } from 'react'

// Mock do Supabase client - será substituído pela implementação real
const getSupabaseClient = async () => {
  // Dados mockados para desenvolvimento
  const mockQuizzes = [
    {
      id: 1,
      title_pt: 'Teste de Personalidade',
      description_pt: 'Descubra seu tipo de personalidade e como isso influencia seu bem-estar',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      duration: '10 min',
      questions_count: 25
    },
    {
      id: 2,
      title_pt: 'Avaliação de Bem-estar',
      description_pt: 'Avalie seu nível atual de bem-estar em diferentes áreas da vida',
      image_url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
      duration: '8 min',
      questions_count: 20
    },
    {
      id: 3,
      title_pt: 'Nível de Estresse',
      description_pt: 'Identifique seu nível de estresse e receba recomendações personalizadas',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      duration: '5 min',
      questions_count: 15
    }
  ]

  const mockQuestions = [
    {
      id: 1,
      quiz_id: 1,
      text_pt: 'Como você se sente na maioria dos dias?',
      order: 1,
      options: [
        { id: 1, text_pt: 'Muito bem', score: 5, result_category_id: 1 },
        { id: 2, text_pt: 'Bem', score: 4, result_category_id: 1 },
        { id: 3, text_pt: 'Normal', score: 3, result_category_id: 2 },
        { id: 4, text_pt: 'Mal', score: 2, result_category_id: 3 },
        { id: 5, text_pt: 'Muito mal', score: 1, result_category_id: 3 }
      ]
    },
    {
      id: 2,
      quiz_id: 1,
      text_pt: 'Com que frequência você se sente ansioso?',
      order: 2,
      options: [
        { id: 6, text_pt: 'Nunca', score: 5, result_category_id: 1 },
        { id: 7, text_pt: 'Raramente', score: 4, result_category_id: 1 },
        { id: 8, text_pt: 'Às vezes', score: 3, result_category_id: 2 },
        { id: 9, text_pt: 'Frequentemente', score: 2, result_category_id: 3 },
        { id: 10, text_pt: 'Sempre', score: 1, result_category_id: 3 }
      ]
    },
    {
      id: 3,
      quiz_id: 1,
      text_pt: 'Como você avalia sua qualidade de sono?',
      order: 3,
      options: [
        { id: 11, text_pt: 'Excelente', score: 5, result_category_id: 1 },
        { id: 12, text_pt: 'Boa', score: 4, result_category_id: 1 },
        { id: 13, text_pt: 'Regular', score: 3, result_category_id: 2 },
        { id: 14, text_pt: 'Ruim', score: 2, result_category_id: 3 },
        { id: 15, text_pt: 'Péssima', score: 1, result_category_id: 3 }
      ]
    }
  ]

  const mockCategories = [
    {
      id: 1,
      quiz_id: 1,
      title_pt: 'Bem-estar Elevado',
      description_pt: 'Você demonstra um excelente nível de bem-estar mental e emocional.'
    },
    {
      id: 2,
      quiz_id: 1,
      title_pt: 'Bem-estar Moderado',
      description_pt: 'Seu bem-estar está em um nível satisfatório, mas há espaço para melhorias.'
    },
    {
      id: 3,
      quiz_id: 1,
      title_pt: 'Bem-estar Baixo',
      description_pt: 'Recomendamos buscar apoio para melhorar seu bem-estar mental e emocional.'
    }
  ]

  const mockAttempts = [
    {
      id: 1,
      user_id: 'user1',
      quiz_id: 1,
      completed_at: new Date('2024-01-15'),
      results: {
        'Bem-estar Elevado': 15,
        'Bem-estar Moderado': 8,
        'Bem-estar Baixo': 2
      }
    }
  ]

  return {
    from: (table) => {
      const queryBuilder = {
        select: (fields) => {
          queryBuilder._fields = fields
          return queryBuilder
        },
        eq: (field, value) => {
          queryBuilder._eqField = field
          queryBuilder._eqValue = value
          return queryBuilder
        },
        order: (field, options) => {
          queryBuilder._orderField = field
          queryBuilder._orderOptions = options
          return queryBuilder
        },
        insert: (data) => {
          return Promise.resolve({ data: { ...data, id: Date.now() }, error: null })
        },
        then: (resolve) => {
          // Simular execução da query
          setTimeout(() => {
            let data = []
            
            if (table === 'quizzes') {
              data = mockQuizzes
              if (queryBuilder._eqField && queryBuilder._eqValue) {
                data = data.filter(item => item[queryBuilder._eqField] === queryBuilder._eqValue)
              }
            } else if (table === 'quiz_questions') {
              data = mockQuestions
              if (queryBuilder._eqField && queryBuilder._eqValue) {
                data = data.filter(item => item[queryBuilder._eqField] === queryBuilder._eqValue)
              }
            } else if (table === 'quiz_result_categories') {
              data = mockCategories
              if (queryBuilder._eqField && queryBuilder._eqValue) {
                data = data.filter(item => item[queryBuilder._eqField] === queryBuilder._eqValue)
              }
            } else if (table === 'user_quiz_attempts') {
              data = mockAttempts
              if (queryBuilder._eqField && queryBuilder._eqValue) {
                data = data.filter(item => item[queryBuilder._eqField] === queryBuilder._eqValue)
              }
            }
            
            resolve({ data, error: null })
          }, 100)
        }
      }
      
      // Tornar o queryBuilder thenable (Promise-like)
      queryBuilder.then = queryBuilder.then
      
      return queryBuilder
    },
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: 'user1' } } })
    }
  }
}

// Hook para buscar todos os quizzes
export const useQuizzes = (language = 'pt') => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      const titleField = `title_${language}`
      const descriptionField = `description_${language}`
      
      const result = await supabase
        .from('quizzes')
        .select(`id, ${titleField}, ${descriptionField}, image_url, duration, questions_count`)
        .order('id', { ascending: true })

      if (result.error) throw result.error
      setQuizzes(result.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [language])

  const refetch = () => {
    fetchQuizzes()
  }

  return {
    quizzes,
    loading,
    error,
    refetch
  }
}

// Hook para buscar detalhes de um quiz específico
export const useQuizDetails = (quizId, language = 'pt') => {
  const [quizDetails, setQuizDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuizDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      // Buscar detalhes do quiz
      const quizResult = await supabase
        .from('quizzes')
        .select(`id, title_${language}, description_${language}, image_url, duration, questions_count`)
        .eq('id', quizId)

      if (quizResult.error) throw quizResult.error
      
      const quiz = quizResult.data[0]
      if (!quiz) {
        throw new Error('Quiz não encontrado')
      }

      // Buscar perguntas do quiz
      const questionsResult = await supabase
        .from('quiz_questions')
        .select(`id, text_${language}, order`)
        .eq('quiz_id', quizId)
        .order('order', { ascending: true })

      if (questionsResult.error) throw questionsResult.error

      // Buscar categorias de resultado
      const categoriesResult = await supabase
        .from('quiz_result_categories')
        .select(`id, title_${language}, description_${language}`)
        .eq('quiz_id', quizId)

      if (categoriesResult.error) throw categoriesResult.error

      setQuizDetails({
        ...quiz,
        questions: questionsResult.data,
        resultCategories: categoriesResult.data
      })
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar detalhes do quiz:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizId) {
      fetchQuizDetails()
    }
  }, [quizId, language])

  const refetch = () => {
    fetchQuizDetails()
  }

  return {
    quizDetails,
    loading,
    error,
    refetch
  }
}

// Hook para buscar histórico de tentativas do usuário
export const useUserQuizHistory = (quizId) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const result = await supabase
        .from('user_quiz_attempts')
        .select('id, completed_at, results')
        .eq('user_id', user?.id || 'user1')
        .eq('quiz_id', quizId)
        .order('completed_at', { ascending: false })

      if (result.error) throw result.error
      setHistory(result.data || [])
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar histórico do quiz:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizId) {
      fetchHistory()
    }
  }, [quizId])

  const refetch = () => {
    fetchHistory()
  }

  return {
    history,
    loading,
    error,
    refetch
  }
}

// Função para submeter respostas do quiz
export const submitQuiz = async (quizId, answers) => {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Buscar perguntas e opções para calcular pontuação
    const questionsResult = await supabase
      .from('quiz_questions')
      .select('id, quiz_id')
      .eq('quiz_id', quizId)
      .order('order', { ascending: true })

    if (questionsResult.error) throw questionsResult.error

    // Buscar categorias de resultado
    const categoriesResult = await supabase
      .from('quiz_result_categories')
      .select('id, title_pt, description_pt')
      .eq('quiz_id', quizId)

    if (categoriesResult.error) throw categoriesResult.error

    // Calcular pontuação por categoria (mock)
    const results = {}
    categoriesResult.data.forEach(category => {
      results[category.title_pt] = Math.floor(Math.random() * 20) + 5 // Score entre 5-25
    })

    // Salvar tentativa
    const attemptData = {
      user_id: user?.id || 'user1',
      quiz_id: quizId,
      completed_at: new Date().toISOString(),
      results: results
    }

    const insertResult = await supabase
      .from('user_quiz_attempts')
      .insert(attemptData)

    if (insertResult.error) throw insertResult.error

    return { 
      success: true, 
      data: {
        results,
        categories: categoriesResult.data,
        completed_at: attemptData.completed_at
      }
    }
  } catch (error) {
    console.error('Erro ao submeter quiz:', error)
    return { success: false, error: error.message }
  }
}

// Hook para buscar perguntas completas de um quiz (para responder)
export const useQuizQuestions = (quizId, language = 'pt') => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = await getSupabaseClient()
      
      const questionsResult = await supabase
        .from('quiz_questions')
        .select(`id, text_${language}, order`)
        .eq('quiz_id', quizId)
        .order('order', { ascending: true })

      if (questionsResult.error) throw questionsResult.error

      // Para cada pergunta, buscar suas opções (mock)
      const questionsWithOptions = questionsResult.data.map(question => ({
        ...question,
        options: [
          { id: `${question.id}_1`, text_pt: 'Concordo totalmente', score: 5, result_category_id: 1 },
          { id: `${question.id}_2`, text_pt: 'Concordo parcialmente', score: 4, result_category_id: 1 },
          { id: `${question.id}_3`, text_pt: 'Neutro', score: 3, result_category_id: 2 },
          { id: `${question.id}_4`, text_pt: 'Discordo parcialmente', score: 2, result_category_id: 3 },
          { id: `${question.id}_5`, text_pt: 'Discordo totalmente', score: 1, result_category_id: 3 }
        ]
      }))

      setQuestions(questionsWithOptions)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar perguntas do quiz:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (quizId) {
      fetchQuestions()
    }
  }, [quizId, language])

  const refetch = () => {
    fetchQuestions()
  }

  return {
    questions,
    loading,
    error,
    refetch
  }
}

