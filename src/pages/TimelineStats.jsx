import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Activity, Loader2, Smile, Frown, Meh, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

// 1. LÓGICA DE ÍCONES E CORES (Carinhas Coloridas)
const getMoodIcon = (level) => {
  // Nível Alto (7-10): Verde, Rosto Feliz
  if (level >= 7) return { Icon: Smile, color: 'text-green-500' };
  
  // Nível Médio (4-6): Amarelo, Rosto Neutro
  if (level >= 4) return { Icon: Meh, color: 'text-yellow-500' };
  
  // Nível Baixo (1-3): Vermelho, Rosto Triste
  return { Icon: Frown, color: 'text-red-500' };
};

const TimelineStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('mood_logs')
          .select(`
            *,
            log_sentiments (
              sentiments (name)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLogs(data);
      } catch (error) {
        console.error('Erro ao buscar linha do tempo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.created_at).toISOString().split('T')[0];
    if (startDate && logDate < startDate) return false;
    if (endDate && logDate > endDate) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Linha do Tempo</h1>
      </header>

      {/* Filtro de Datas */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
            <Calendar size={16} />
            <span>Filtrar por período</span>
        </div>
        <div className="flex gap-4">
            <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">De</label>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-primary outline-none"
                />
            </div>
            <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Até</label>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-primary outline-none"
                />
            </div>
        </div>
      </div>

      <main className="flex-grow space-y-4 pb-8">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Nenhum registro encontrado neste período.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            // 2. USA A FUNÇÃO DE CARINHAS
            const { Icon, color } = getMoodIcon(log.mood_level);
            
            return (
              // 3. CARD LIMPO (Sem bordas coloridas extras)
              <Card key={log.id} className="bg-gray-800 border-gray-700 overflow-hidden shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {/* Ícone de Rosto Colorido, sem fundo */}
                      <div className={`p-2 rounded-full bg-gray-700/30`}>
                        <Icon className={`w-6 h-6 ${color}`} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">{log.mood || 'Sem título'}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock size={12} className="mr-1" />
                          {format(new Date(log.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    {/* Nível numérico com a cor correspondente */}
                    <div className={`text-xl font-bold ${color}`}>{log.mood_level}</div>
                  </div>

                  {log.log_sentiments?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {log.log_sentiments.map((ls, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600 border-none">
                          {ls.sentiments?.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 bg-gray-900/30 p-3 rounded-lg">
                    {log.context_location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500" /> {log.context_location}
                      </div>
                    )}
                    {log.context_company && (
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" /> {log.context_company}
                      </div>
                    )}
                    {log.context_activity && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Activity size={14} className="text-gray-500" /> {log.context_activity}
                      </div>
                    )}
                  </div>

                  {log.context_notes && (
                    <div className="mt-3 text-sm text-gray-400 italic border-l-2 border-gray-600 pl-3">
                      "{log.context_notes}"
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </main>
    </div>
  );
};

export default TimelineStats;