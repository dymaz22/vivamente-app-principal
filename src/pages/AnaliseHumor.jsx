import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMoodStats } from '../hooks/useMoodStats';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const AnaliseHumor = () => {
  const navigate = useNavigate();
  const { stats, loading, error } = useMoodStats();

  const StatCard = ({ title, value, unit = '' }) => (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {value}
          <span className="text-xs text-gray-400 ml-1">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Análise de Humor</h1>
      </header>

      <main className="flex-grow">
        {loading && <p className="text-center">Carregando estatísticas...</p>}
        {error && <p className="text-center text-red-500">Ocorreu um erro ao buscar os dados.</p>}
        
        {!loading && !error && (
          <div className="space-y-4">
            <StatCard 
              title="Total de Registros" 
              value={stats.totalLogs} 
            />
            <StatCard 
              title="Nível de Energia Médio" 
              value={stats.avgEnergyLevel} 
              unit="/ 10"
            />
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-400">
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