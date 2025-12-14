import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

// --- 1. LISTA DE CURSOS (USADO NA HOME) ---
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Normaliza os dados para evitar erros de digitação no banco
      const formattedData = data.map(course => ({
        ...course,
        title: course.title || course.title_pt || 'Sem título',
        description: course.description || course.description_pt || '',
        image_url: course.image_url || course.thumbnail_url || 'https://placehold.co/600x400/1e1e2e/FFF?text=Curso'
      }));

      setCourses(formattedData || []);
    } catch (err) {
      console.error('Erro ao buscar cursos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  return { courses, loading, error, refetch: fetchCourses };
};

// --- 2. DETALHES DO CURSO ---
export const useCourseDetails = (courseId) => {
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchCourseDetails = async () => {
        if (!courseId) return;
        try {
            setLoading(true);
            const { data: course, error: courseError } = await supabase
                .from('courses').select('*').eq('id', courseId).single();
            
            if (courseError) throw courseError;

            const { data: lessons, error: lessonsError } = await supabase
                .from('lessons').select('*').eq('course_id', courseId).order('order', { ascending: true });
            
            if (lessonsError) throw lessonsError;

            setCourseDetails({ 
                ...course, 
                title: course.title || course.title_pt,
                description: course.description || course.description_pt,
                lessons: lessons.map(l => ({
                    ...l,
                    title: l.title || l.title_pt
                }))
            });
        } catch (err) {
            console.error('Erro ao buscar detalhes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
  
    useEffect(() => {
      fetchCourseDetails();
    }, [courseId]);
  
    return { courseDetails, loading, error, refetch: fetchCourseDetails };
};

// --- 3. DETALHES DA LIÇÃO ---
export const useLessonDetails = (lessonId) => {
  const [lessonDetails, setLessonDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLessonDetails = async () => {
    if (!lessonId) return;
    try {
      setLoading(true);
      
      // Busca a lição
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons').select('*').eq('id', lessonId).single();
      
      if (lessonError) throw lessonError;

      // Busca comentários
      const { data: comments } = await supabase
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      // Busca progresso do usuário
      let userProgress = null;
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();
        userProgress = progress;
      }

      setLessonDetails({
          ...lesson,
          title: lesson.title || lesson.title_pt,
          content: lesson.content || lesson.content_pt,
          comments: comments || [],
          userProgress
      });

    } catch (err) {
      console.error('Erro lição:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonDetails();
  }, [lessonId, user]);

  return { lessonDetails, loading, error, refetch: fetchLessonDetails };
};

// --- 4. MARCAR COMO COMPLETA ---
export const markLessonAsComplete = async (lessonId, userId) => {
  if (!lessonId || !userId) return { success: false };
  
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id, lesson_id' });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao completar:', error);
    return { success: false, error: error.message };
  }
};

// --- 5. AVALIAR LIÇÃO ---
export const submitLessonRating = async (lessonId, rating, userId) => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        rating: rating,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, lesson_id' });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erro ao avaliar:', error);
    return { success: false, error: error.message };
  }
};

// --- 6. COMENTAR LIÇÃO ---
export const submitLessonComment = async (lessonId, userId, content) => {
  try {
    const { data, error } = await supabase
      .from('lesson_comments')
      .insert({
        lesson_id: lessonId,
        user_id: userId,
        content: content
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao comentar:', error);
    return { success: false, error: error.message };
  }
};