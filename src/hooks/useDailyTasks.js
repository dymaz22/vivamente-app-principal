import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js'; 
import { useAuth } from './useAuth.jsx'; 

export const useDailyTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getTodayDateString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const fetchTasksForToday = async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('user_tasks')
                .select('*')
                .eq('user_id', user.id)
                .eq('due_date', getTodayDateString())
                .order('created_at', { ascending: true }); 
            if (error) throw error;
            setTasks(data || []);
        } catch (err) {
            console.error('Erro ao buscar tarefas:', err.message);
            setError('Falha ao carregar tarefas.');
        } finally {
            setLoading(false);
        }
    };
    
    const toggleTaskCompletion = async (taskId, currentStatus) => {
        if (!user) return;
        const originalTasks = [...tasks];
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, is_completed: !currentStatus } : task
        );
        setTasks(updatedTasks);
        try {
            const { error } = await supabase
                .from('user_tasks')
                .update({ is_completed: !currentStatus })
                .eq('id', taskId)
                .eq('user_id', user.id);
            if (error) { setTasks(originalTasks); }
        } catch (err) { setTasks(originalTasks); }
    };

    // --- FUNÇÃO DE ADICIONAR SIMPLIFICADA ---
    const addTask = async (taskText) => {
        if (!user || !taskText.trim()) return { success: false, error: 'Texto inválido' };
        try {
            const { data, error } = await supabase
                .from('user_tasks')
                .insert({ user_id: user.id, text: taskText.trim(), due_date: getTodayDateString() })
                .select()
                .single();
            if (error) throw error;
            return { success: true, task: data };
        } catch (err) {
            console.error('Erro ao adicionar tarefa:', err.message);
            return { success: false, error: err };
        }
    };

    // --- NOVA FUNÇÃO DE DELETAR ---
    const deleteTask = async (taskId) => {
        if (!user) return;
        const originalTasks = [...tasks];
        // Atualização otimista: remove da tela imediatamente
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
        try {
            const { error } = await supabase
                .from('user_tasks')
                .delete()
                .eq('id', taskId)
                .eq('user_id', user.id);
            if (error) {
                console.error('Falha ao deletar, revertendo:', error.message);
                setTasks(originalTasks); // Reverte se der erro
            }
        } catch (err) {
            console.error('Erro ao deletar tarefa:', err.message);
            setTasks(originalTasks);
        }
    };

    useEffect(() => {
        if (user) { fetchTasksForToday(); }
    }, [user]);

    return { tasks, loading, error, toggleTaskCompletion, addTask, deleteTask };
};