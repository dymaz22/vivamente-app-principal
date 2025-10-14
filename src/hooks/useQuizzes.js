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
      
      const { data, error } = await supabase
        .from('quizzes')
        .select(`id, title_pt, description_pt, image_url`)
        .order('id', { ascending: true });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (err) {
      console.error('Erro ao buscar quizzes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [language]);

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
      
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select(`id, title_pt, description_pt, image_url`)
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      // >>>>> LINHA CORRIGIDA <<<<<
      const { data: categories, error: categoriesError } = await supabase
        .from('quiz_result_categories')
        .select(`id, name_pt`) // 'description_pt' removido
        .eq('quiz_id', quizId);

      if (categoriesError) throw categoriesError;

      setQuizDetails({
        ...quiz,
        resultCategories: categories || []
      });
    } catch (err) {
      console.error('Erro ao buscar detalhes do quiz:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizDetails();
  }, [quizId, language]);

  return { quizDetails, loading, error, refetch: fetchQuizDetails };
};