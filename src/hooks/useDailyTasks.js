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
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const todayDate = getTodayDateString();
        try {
            const { data, error } = await supabase
                .from('user_tasks')
                .select('*')
                .eq('user_id', user.id)
                .eq('due_date', todayDate)
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
    
    // --- CÓDIGO COM ATUALIZAÇÃO OTIMISTA ---
    const toggleTaskCompletion = async (taskId, currentStatus) => {
        if (!user) return;

        // Guarda o estado original para o caso de falha
        const originalTasks = [...tasks];

        // 1. ATUALIZA A TELA INSTANTANEAMENTE (Otimismo)
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, is_completed: !currentStatus } : task
        );
        setTasks(updatedTasks);

        // 2. SINCRONIZA COM O BANCO DE DADOS EM SEGUNDO PLANO
        try {
            const { error } = await supabase
                .from('user_tasks')
                .update({ is_completed: !currentStatus })
                .eq('id', taskId)
                .eq('user_id', user.id);

            // 3. SE OCORRER UM ERRO, REVERTE A MUDANÇA NA TELA
            if (error) {
                console.error('Falha na sincronização, revertendo:', error.message);
                setTasks(originalTasks); // Volta ao estado original
            }
        } catch (err) {
            console.error('Erro ao atualizar tarefa:', err.message);
            setTasks(originalTasks); // Garante que volte ao estado original
        }
    };
    // --- FIM DA ATUALIZAÇÃO ---

    useEffect(() => {
        if (user) {
            fetchTasksForToday();
        }
    }, [user]);

    return { tasks, loading, error, fetchTasksForToday, toggleTaskCompletion };
};