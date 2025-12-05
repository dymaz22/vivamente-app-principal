import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Flame, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const StreakCalendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loggedDates, setLoggedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dias que o usuário registrou humor
  useEffect(() => {
    const fetchLoggedDates = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('mood_logs')
          .select('created_at')
          .eq('user_id', user.id);

        if (error) throw error;

        // Converte as strings de data do banco para objetos Date
        const dates = data.map(log => new Date(log.created_at));
        setLoggedDates(dates);
      } catch (error) {
        console.error('Erro ao buscar datas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedDates();
  }, [user]);

  // Lógica para gerar os dias do mês atual
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Calcula quantos espaços vazios precisamos antes do dia 1 (para alinhar dia da semana)
  const startDayOfWeek = getDay(startOfMonth(currentMonth)); // 0 = Domingo, 1 = Segunda...
  const emptyDays = Array(startDayOfWeek).fill(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Verifica se existe algum registro para um dia específico
  const isDayLogged = (day) => {
    return loggedDates.some(loggedDate => isSameDay(loggedDate, day));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Série Atual</h1>
      </header>

      <main className="flex-grow max-w-md mx-auto w-full">
        {loading ? (
           <div className="flex justify-center mt-10">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : (
          <>
            {/* Card do Calendário */}
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg">
              
              {/* Navegação do Mês */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded-full">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold capitalize">
                  {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-full">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Cabeçalho dos Dias da Semana */}
              <div className="grid grid-cols-7 mb-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-xs text-gray-400 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grade de Dias */}
              <div className="grid grid-cols-7 gap-1">
                {/* Espaços vazios iniciais */}
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {/* Dias do mês */}
                {daysInMonth.map((day) => {
                  const hasLog = isDayLogged(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-xl text-sm relative transition-all
                        ${isToday ? 'border border-white/50 bg-white/5' : ''}
                        ${hasLog ? 'bg-orange-500/10 text-orange-400 font-bold' : 'text-gray-300 hover:bg-gray-700/30'}
                      `}
                    >
                      <span>{format(day, 'd')}</span>
                      {hasLog && (
                        <Flame size={12} className="fill-orange-500 text-orange-500 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Texto Motivacional */}
            <div className="mt-8 text-center px-4">
                <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-full mb-3">
                    <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Mantenha a chama acesa!</h3>
                <p className="text-gray-400 text-sm">
                    Registre seu humor diariamente para construir sua série e visualizar seu progresso.
                </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StreakCalendar;