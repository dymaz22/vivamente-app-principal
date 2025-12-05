import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Activity, Loader2 } from 'lucide-react';
import { useMoodStats } from '../hooks/useMoodStats';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ReasonsStats = () => {
  const navigate = useNavigate();
  const { stats, loading } = useMoodStats();

  // Componente auxiliar para a barra de progresso
  const ContextBar = ({ label, count, total, colorClass }) => {
    const percentage = Math.round((count / total) * 100);
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-200 font-medium">{label}</span>
          <span className="text-gray-400">{count} registros ({percentage}%)</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${colorClass}`} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    );
  };

  // Componente para o Card de Seção
  const SectionCard = ({ title, icon: Icon, data, colorClass, emptyMessage }) => (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="mt-2">
            {data.map((item, index) => (
              <ContextBar 
                key={index} 
                label={item.name} 
                count={item.count} 
                total={stats.totalLogs}
                colorClass={colorClass.replace('text-', 'bg-')} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Principais Razões</h1>
      </header>

      <main className="flex-grow pb-8">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <SectionCard 
              title="Onde você estava?" 
              icon={MapPin} 
              data={stats.topLocations} 
              colorClass="text-purple-400"
              emptyMessage="Nenhum local registrado."
            />

            <SectionCard 
              title="Com quem você estava?" 
              icon={Users} 
              data={stats.topCompanies} 
              colorClass="text-blue-400"
              emptyMessage="Nenhuma companhia registrada."
            />

            <SectionCard 
              title="O que você estava fazendo?" 
              icon={Activity} 
              data={stats.topActivities} 
              colorClass="text-green-400"
              emptyMessage="Nenhuma atividade registrada."
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ReasonsStats;