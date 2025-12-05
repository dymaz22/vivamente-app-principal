import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { useMoodStats } from '../hooks/useMoodStats';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const SentimentsStats = () => {
  const navigate = useNavigate();
  const { stats, loading } = useMoodStats();

  // Componente para a barra de sentimento
  const SentimentBar = ({ label, count, total }) => {
    // Calcula a porcentagem baseada no total de registros
    const percentage = Math.round((count / total) * 100);
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-200 font-medium capitalize">{label}</span>
          <span className="text-gray-400">{count} registros ({percentage}%)</span>
        </div>
        <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full bg-pink-500" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Sentimentos</h1>
      </header>

      <main className="flex-grow pb-8">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                Frequência de Sentimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.allSentiments && stats.allSentiments.length > 0 ? (
                <div className="mt-4">
                  {stats.allSentiments.map((item, index) => (
                    <SentimentBar 
                      key={index} 
                      label={item.name} 
                      count={item.count} 
                      total={stats.totalLogs} 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic text-center py-4">
                  Nenhum sentimento registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SentimentsStats;