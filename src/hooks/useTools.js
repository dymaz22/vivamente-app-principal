import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTools = async () => {
    try {
      setLoading(true);
      // Busca as ferramentas e a categoria associada
      const { data, error } = await supabase
        .from('tool_templates')
        .select('*, tool_categories(name_pt)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Erro ao buscar ferramentas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTools(); }, []);

  return { tools, loading };
};