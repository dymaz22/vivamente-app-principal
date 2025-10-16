// src/lib/tasksApi.js

import { supabase } from './supabaseClient.js';

// Função para adicionar uma tarefa
export const addTaskApi = async (taskText, userId) => {
  if (!userId || !taskText.trim()) {
    return { success: false, error: 'Usuário ou texto inválido.' };
  }

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  try {
    const { data, error } = await supabase
      .from('user_tasks')
      .insert({
        user_id: userId,
        text: taskText.trim(),
        due_date: getTodayDateString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, task: data };
  } catch (err) {
    console.error('Erro na API ao adicionar tarefa:', err.message);
    return { success: false, error: err };
  }
};