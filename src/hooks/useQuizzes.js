import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export const useQuizzes = (language = 'pt') => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from('quizzes')
        .select(`id, title_pt, description_pt, image_url`).order('id', { ascending: true });
      if (error) throw error;
      setQuizzes(data || []);
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, [language]);

  return { quizzes, loading, error, refetch: fetchQuizzes };
};

export const useQuizDetails = (quizId, language = 'pt') => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizDetails = async () => {
    if (!quizId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data: quiz, error: quizError } = await supabase.from('quizzes')
        .select(`id, title_pt, description_pt, image_url`).eq('id', quizId).single();
      if (quizError) throw quizError;

      const { data: categories, error: categoriesError } = await supabase.from('quiz_result_categories')
        .select(`id, name_pt`).eq('quiz_id', quizId);
      if (categoriesError) throw categoriesError;

      setQuizDetails({ ...quiz, resultCategories: categories || [] });
    } catch (err) {
      console.error('Erro ao buscar detalhes do quiz:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizDetails(); }, [quizId, language]);

  return { quizDetails, loading, error, refetch: fetchQuizDetails };
};

export const useQuizQuestions = (quizId, language = 'pt') => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    if (!quizId) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const { data: questionsData, error: questionsError } = await supabase.from('quiz_questions')
        .select(`id, text_pt, order`).eq('quiz_id', quizId).order('order', { ascending: true });
      if (questionsError) throw questionsError;
      if (!questionsData || questionsData.length === 0) { setQuestions([]); setLoading(false); return; }
      
      const questionIds = questionsData.map(q => q.id);
      const { data: optionsData, error: optionsError } = await supabase.from('quiz_options').select('*').in('question_id', questionIds);
      if (optionsError) throw optionsError;

      const questionsWithOptions = questionsData.map(question => ({
        ...question,
        options: optionsData.filter(option => option.question_id === question.id) || []
      }));
      setQuestions(questionsWithOptions);
    } catch (err) {
      console.error('Erro ao buscar perguntas do quiz:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [quizId, language]);

  return { questions, loading, error, refetch: fetchQuestions };
};

// ✅ FUNÇÃO CORRIGIDA - CENÁRIO A (score como INTEGER)
export const submitQuiz = async (quizId, answers, userId) => {
  if (!quizId || !answers || !userId) {
    return { success: false, error: 'Dados insuficientes para submeter o quiz.' };
  }

  try {
    // Buscar todas as perguntas do quiz
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions').select('id').eq('quiz_id', quizId);
    if (questionsError) throw questionsError;
    const questionIds = questions.map(q => q.id);

    // Buscar todas as opções das perguntas
    const { data: allOptions, error: optionsError } = await supabase
      .from('quiz_options').select('id, value').in('question_id', questionIds);
    if (optionsError) throw optionsError;

    // Calcular pontuação total
    let totalScore = 0;
    for (const questionId in answers) {
      const selectedOptionId = answers[questionId];
      const selectedOption = allOptions.find(opt => opt.id === selectedOptionId);
      if (selectedOption && selectedOption.value) {
        totalScore += selectedOption.value;
      }
    }

    // Buscar categorias de resultado
    const { data: categories, error: categoriesError } = await supabase
      .from('quiz_result_categories').select('*').eq('quiz_id', quizId).order('id', { ascending: true });
    if (categoriesError) throw categoriesError;
    
    // Determinar categoria com base na pontuação
    let finalCategory = categories[0];
    if (categories.length > 2 && totalScore > 5) { 
      finalCategory = categories[2]; 
    } else if (categories.length > 1 && totalScore > 2) { 
      finalCategory = categories[1]; 
    }

    // ✅ CORREÇÃO: Usar "score" (singular) em vez de "scores"
    const attemptData = {
      user_id: userId,
      quiz_id: quizId,
      score: totalScore, // ✅ MUDANÇA AQUI
      result_category_id: finalCategory.id,
      completed_at: new Date().toISOString(),
    };

    // Inserir a tentativa no banco
    const { data: insertedAttempt, error: insertError } = await supabase
      .from('user_quiz_attempts').insert(attemptData).select().single();
    if (insertError) throw insertError;

    return { success: true, data: { ...insertedAttempt, categoryDetails: finalCategory } };

  } catch (error) {
    console.error('Erro ao submeter quiz:', error.message);
    return { success: false, error: error.message };
  }
};