import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMoodStats } from '../hooks/useMoodStats';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import MoodChart from '../components/MoodChart'; // 1. IMPORTA O GRÁFICO

const AnaliseHumor = () => {
  const navigate = useNavigate();
  // 2. OBTÉM OS DADOS DO GRÁFICO DO HOOK
  const { stats, chartData, loading, error } = useMoodStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Análise de Humor</h1>
      </header>

      <main className="flex-grow">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        {error && <p className="text-center text-red-500">Ocorreu um erro ao buscar os dados.</p>}
        
        {!loading && !error && (
          <div className="space-y-6">
            {/* 3. RENDERIZA O GRÁFICO */}
            <MoodChart data={chartData} />

            {/* Mantém o card de sentimentos frequentes */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Sentimentos Mais Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostCommonSentiments?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.mostCommonSentiments.map((sentiment, index) => (
                      <span key={index} className="bg-purple-600/50 text-white text-sm font-medium px-3 py-1 rounded-full">
                        {sentiment}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Nenhum sentimento registrado ainda.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnaliseHumor;