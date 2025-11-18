import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// O hook agora busca os sentimentos REAIS do Supabase
export const useRoutine = () => {
    const [sentimentsList, setSentimentsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSentiments = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('sentiments')
                    .select('id, name'); // Seleciona o ID (que é um UUID) e o nome

                if (error) throw error;

                setSentimentsList(data || []);
            } catch (err) {
                console.error("Erro ao buscar sentimentos:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSentiments();
    }, []); // Executa apenas uma vez quando o hook é montado

    return {
        sentimentsList,
        loading,
        error,
    };
};