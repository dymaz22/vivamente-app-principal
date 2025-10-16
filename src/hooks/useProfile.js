import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './useAuth.jsx';

export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = "A busca não retornou linhas"
                throw error;
            }
            
            setProfile(data);

        } catch (err) {
            console.error("Erro ao buscar perfil:", err.message);
            setError("Não foi possível carregar os dados do perfil.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);
    
    // Função para atualizar o nome do usuário
    const updateUsername = async (newUsername) => {
        if (!user || !newUsername.trim()) {
            return { success: false, error: 'Nome de usuário inválido.' };
        }
        
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ username: newUsername.trim() }) // Usando a coluna 'username'
                .eq('id', user.id);

            if (error) throw error;

            // Atualiza o perfil localmente para a UI reagir
            setProfile(currentProfile => ({ ...currentProfile, username: newUsername.trim() }));
            return { success: true };

        } catch (err) {
            console.error("Erro ao atualizar nome de usuário:", err.message);
            return { success: false, error: err.message };
        }
    };

    return {
        profile,
        loading,
        error,
        refetchProfile: fetchProfile,
        updateUsername,
    };
};