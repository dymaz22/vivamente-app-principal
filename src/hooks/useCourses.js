import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export const useCourses = (language = 'pt') => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('courses').select(`id, title_pt, description_pt, image_url`).order('id', { ascending: true });
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [language]);

  return { courses, loading, error, refetch: fetchCourses };
};

export const useCourseDetails = (courseId, language = 'pt') => {
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const { data: course, error: courseError } = await supabase
                .from('courses').select(`id, title_pt, description_pt, image_url`).eq('id', courseId).single();
            if (courseError) throw courseError;

            const { data: lessons, error: lessonsError } = await supabase
                .from('lessons').select(`id, title_pt`).eq('course_id', courseId).order('order', { ascending: true });
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
      
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons').select(`id, course_id, title_pt, content_pt, video_url, order`).eq('id', lessonId).single();
      if (lessonError) throw lessonError;
      if (!lesson) throw new Error('Lição não encontrada');

      const { data: comments, error: commentsError } = await supabase
        .from('lesson_comments').select('id, user_id, content, created_at').eq('lesson_id', lessonId).order('created_at', { ascending: false });
      if (commentsError) console.warn("Não foi possível carregar comentários:", commentsError);

      let userProgress = null;
      if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress').select('is_completed, completed_at, rating').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();
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

// >>>>> FUNÇÃO markLessonAsComplete TOTALMENTE IMPLEMENTADA <<<<<
export const markLessonAsComplete = async (lessonId, userId) => {
  if (!lessonId || !userId) {
    return { success: false, error: "ID do usuário ou da lição não fornecido." };
  }
  
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id, lesson_id' // Informa ao Supabase como encontrar um registro existente
      });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar lição como completa:', error);
    return { success: false, error: error.message };
  }
};

// As funções abaixo continuam como MOCKS por enquanto
export const submitLessonRating = async (lessonId, rating) => { /* ... mock ... */ };
export const submitLessonComment = async (lessonId, content) => { /* ... mock ... */ };