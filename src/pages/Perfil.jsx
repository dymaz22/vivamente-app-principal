import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, BarChart, Loader2, AlertCircle, Flame, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Perfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 1. OBTÉM O STREAK DO HOOK
  const { profile, streak, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" /> <p>{error}</p>
      </div>
    );
  }

  // Componente para os cards de estatísticas (Streak, Humor de Hoje)
  const StatCard = ({ icon: Icon, value, label, subtitle, onClick, colorClass = 'text-purple-400' }) => (
    <button onClick={onClick} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center w-full text-left hover:bg-gray-800 transition-colors">
      <div className="flex-1 flex items-center">
        <Icon className={`w-6 h-6 mr-4 ${colorClass}`} />
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-white/80">{label}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500" />
    </button>
  );

  // Componente para os itens de navegação (Análise, Sentimentos, etc.)
  const NavItem = ({ icon: Icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="w-full p-4 flex items-center text-left hover:bg-gray-700/50 transition-colors">
      <Icon className="w-5 h-5 text-gray-400 mr-4" />
      <div className="flex-1">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500" />
    </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        {/* HEADER COM BOTÕES DE AÇÃO */}
        <header className="flex justify-between items-center mb-6 pt-4">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <div>
                {/* Adicionar navegação para feedback aqui depois */}
                <button className="p-2 rounded-full hover:bg-gray-800 mr-2">
                    {/* Ícone de feedback/mensagem */}
                </button>
                <button onClick={() => navigate('/definicoes')} className="p-2 rounded-full hover:bg-gray-800">
                    <Settings className="w-6 h-6 text-gray-300" />
                </button>
            </div>
        </header>

        {/* INFORMAÇÕES DO USUÁRIO */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-800 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white">
            {profile?.username || user?.email.split('@')[0]}
          </h1>
          <p className="text-white/70 text-sm">{user?.email}</p>
        </div>

        {/* 2. SEÇÃO DE ESTATÍSTICAS COM O STREAK */}
        <div className="space-y-4 mb-6">
          <StatCard
            icon={Flame}
            value={streak}
            label={streak === 1 ? "dia" : "dias"}
            subtitle="Série atual"
            onClick={() => { /* Navegar para /streak-calendar no futuro */ }}
            colorClass="text-orange-400"
          />
          {/* Placeholder para o card de humor de hoje */}
          <StatCard
            icon={BarChart} // Usar um ícone apropriado depois
            value="?"
            label="Controle do estado de espírito hoje"
            onClick={() => { /* Navegar para /timeline-stats no futuro */ }}
          />
        </div>

        {/* 3. LISTA DE NAVEGAÇÃO PARA ANÁLISES */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
          <NavItem 
            icon={BarChart}
            title="Análise de Humor"
            subtitle="Principalmente terrível" // Placeholder
            onClick={() => navigate('/analise-humor')}
          />
          {/* Adicionar outros NavItems aqui conforme o roadmap */}
        </div>
      </div>
    </div>
  );
};

export default Perfil;