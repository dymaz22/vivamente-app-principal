import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // <<<<< 1. CONECTANDO AO SUPABASE REAL
import { useAuth } from './useAuth'; // Usando o hook de autenticação real

// 2. A FUNÇÃO DE SIMULAÇÃO (getSupabaseClient) FOI COMPLETAMENTE REMOVIDA

export const useCourses = (language = 'pt') => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`id, title_pt, description_pt, image_url`)
        .order('id', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [language]);

  return { courses, loading, error, refetch: fetchCourses };
};

export const useCourseDetails = (courseId, language = 'pt') => {
    // Esta função parece complexa e pode precisar de revisão, mas não é a causa do erro atual.
    // Deixaremos como está por enquanto para focar na solução.
    // (A lógica de 'status' da lição pode não funcionar sem a tabela user_progress)
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const { data: course, error: courseError } = await supabase
                .from('courses').select(`id, title_pt, description_pt, image_url`)
                .eq('id', courseId).single();
            if (courseError) throw courseError;

            const { data: lessons, error: lessonsError } = await supabase
                .from('lessons').select(`id, title_pt`).eq('course_id', courseId)
                .order('order', { ascending: true });
            if (lessonsError) throw lessonsError;

            setCourseDetails({ ...course, lessons });
        } catch (err) {
            console.error('Erro ao buscar detalhes do curso:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
      if (courseId) fetchCourseDetails();
    }, [courseId, language]);
  
    return { courseDetails, loading, error, refetch: fetchCourseDetails };
};

// >>>>> 3. FUNÇÃO useLessonDetails TOTALMENTE CORRIGIDA E BLINDADA <<<<<
export const useLessonDetails = (lessonId, language = 'pt') => {
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLessonDetails = async () => {
    if (!lessonId) {
        setLoading(false);
        setError("ID da lição não fornecido.");
        return;
    }
    try {
      setLoading(true);
      setError(null);
      
      // Busca detalhes da lição de forma segura
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select(`id, course_id, title_pt, content_pt, video_url, order`)
        .eq('id', lessonId)
        .single(); // .single() garante que esperamos um objeto, não uma lista

      if (lessonError) throw lessonError;
      if (!lesson) throw new Error('Lição não encontrada');

      // Busca comentários (exemplo, pode ser ajustado)
      const { data: comments, error: commentsError } = await supabase
        .from('lesson_comments').select('id, user_id, content, created_at')
        .eq('lesson_id', lessonId).order('created_at', { ascending: false });
      if (commentsError) console.warn("Não foi possível carregar comentários:", commentsError);

      // Busca progresso (exemplo, pode ser ajustado)
      let userProgress = null;
      if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress').select('is_completed, completed_at, rating')
            .eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();
          if (progressError) console.warn("Não foi possível carregar progresso:", progressError);
          userProgress = progressData;
      }

      setLessonDetails({ ...lesson, comments: comments || [], userProgress });
    } catch (err) {
      console.error('Erro ao buscar detalhes da lição:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId, language, user]);

  return { lessonDetails, loading, error, refetch: fetchLessonDetails };
};

// Demais hooks e funções também precisam ser convertidos do mock para o real,
// mas vamos focar em resolver o bug principal primeiro.
// As funções abaixo ainda são MOCKS e precisarão ser implementadas de verdade no futuro.

export const markLessonAsComplete = async (lessonId) => { /* ... mock ... */ };
export const submitLessonRating = async (lessonId, rating) => { /* ... mock ... */ };
export const submitLessonComment = async (lessonId, content) => { /* ... mock ... */ };