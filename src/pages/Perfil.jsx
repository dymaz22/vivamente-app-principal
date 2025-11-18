import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, BarChart, Loader2, AlertCircle } from 'lucide-react'; // 1. BarChart ADICIONADO
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Perfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  if (profileLoading) {
    return ( <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div> );
  }

  if (profileError) {
    return ( <div className="min-h-screen flex items-center justify-center"><AlertCircle /> <p>{profileError}</p></div> );
  }

  const MenuItem = ({ icon: Icon, title, subtitle, onClick }) => (
    <button onClick={onClick} className="w-full p-4 flex items-center space-x-4 text-left hover:bg-gray-700/50 transition-colors">
      <Icon className="text-primary w-6 h-6" />
      <div className="flex-1">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-white/60">{subtitle}</div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-900 text-white">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="w-24 h-24 bg-gray-800 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {profile?.username || user?.email.split('@')[0]}
          </h1>
          <p className="text-white/70">{user?.email}</p>
        </div>

        {/* 2. MENU DE NAVEGAÇÃO ATUALIZADO */}
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
          <MenuItem 
            icon={BarChart}
            title="Análise de Humor"
            subtitle="Veja suas estatísticas e padrões"
            onClick={() => navigate('/analise-humor')}
          />
          <div className="border-t border-gray-700"></div>
          <MenuItem 
            icon={Settings}
            title="Definições"
            subtitle="Conta, aparência e mais"
            onClick={() => navigate('/definicoes')}
          />
        </div>
      </div>
    </div>
  );
};

export default Perfil;