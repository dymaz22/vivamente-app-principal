import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Activity, Loader2, Smile, Frown, Meh } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const getMoodIcon = (level) => {
  if (level >= 8) return { Icon: Smile, color: 'text-green-400', bg: 'bg-green-400/10' };
  if (level >= 5) return { Icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
  return { Icon: Frown, color: 'text-red-400', bg: 'bg-red-400/10' };
};

const TimelineStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Linha do Tempo</h1>
      </header>

      <main className="flex-grow space-y-4 pb-8">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Nenhum registro encontrado.</p>
          </div>
        ) : (
          logs.map((log) => {
            const { Icon, color, bg } = getMoodIcon(log.mood_level);
            return (
              <Card key={log.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className={`h-1 w-full ${color.replace('text-', 'bg-')}`} />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${bg}`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{log.mood || 'Sem título'}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock size={12} className="mr-1" />
                          {format(new Date(log.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${color}`}>{log.mood_level}</div>
                  </div>

                  {/* Sentimentos */}
                  {log.log_sentiments?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {log.log_sentiments.map((ls, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                          {ls.sentiments?.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Contexto */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 bg-gray-900/50 p-3 rounded-lg">
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

                  {/* Notas */}
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