import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from './useAuth.jsx';

const getDayStart = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const calculateStreak = (moodLogs) => {
    if (!moodLogs || moodLogs.length === 0) return 0;
    const uniqueDates = [...new Set(moodLogs.map(log => getDayStart(log.created_at).getTime()))].sort((a, b) => b - a);
    let currentStreak = 0;
    const today = getDayStart(new Date());
    const yesterday = getDayStart(new Date(today.getTime() - 86400000));
    if (uniqueDates[0] === today.getTime() || uniqueDates[0] === yesterday.getTime()) {
        currentStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const diffDays = Math.round((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) currentStreak++;
            else break;
        }
    }
    return currentStreak;
};

export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [streak, setStreak] = useState(0);
    const [todayMoodLevel, setTodayMoodLevel] = useState(null); // 1. NOVO ESTADO
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfileAndStats = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString();

            // 2. ADICIONA A BUSCA PELO HUMOR DE HOJE
            const [profileResponse, moodLogsResponse, todayMoodResponse] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('mood_logs').select('created_at').eq('user_id', user.id),
                supabase.from('mood_logs').select('mood_level').eq('user_id', user.id).gte('created_at', todayISO).order('created_at', { ascending: false }).limit(1).single()
            ]);

            const { data: profileData, error: profileError } = profileResponse;
            if (profileError && profileError.code !== 'PGRST116') throw profileError;
            setProfile(profileData);

            const { data: moodLogs, error: logsError } = moodLogsResponse;
            if (logsError) throw logsError;
            setStreak(calculateStreak(moodLogs));

            // 3. ATUALIZA O ESTADO DO HUMOR DE HOJE
            const { data: todayMoodData, error: todayMoodError } = todayMoodResponse;
            if (todayMoodError && todayMoodError.code !== 'PGRST116') throw todayMoodError;
            setTodayMoodLevel(todayMoodData ? todayMoodData.mood_level : null);

        } catch (err) {
            console.error("Erro ao buscar perfil ou stats:", err.message);
            setError("Não foi possível carregar os dados do perfil.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfileAndStats();
    }, [fetchProfileAndStats]);
    
    const updateUsername = async (newUsername) => {
        if (!user || !newUsername.trim()) return { success: false, error: 'Nome de usuário inválido.' };
        try {
            const { error } = await supabase.from('profiles').update({ username: newUsername.trim() }).eq('id', user.id);
            if (error) throw error;
            setProfile(currentProfile => ({ ...currentProfile, username: newUsername.trim() }));
            return { success: true };
        } catch (err) {
            console.error("Erro ao atualizar nome de usuário:", err.message);
            return { success: false, error: err.message };
        }
    };

    return { profile, streak, todayMoodLevel, loading, error, refetchProfile: fetchProfileAndStats, updateUsername }; // 4. EXPORTA O NOVO ESTADO
};