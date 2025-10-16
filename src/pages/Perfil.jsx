import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Bell, Globe, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

// 1. IMPORTANDO OS CÉREBROS CORRETOS
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Perfil = () => {
  const navigate = useNavigate();
  // 2. USANDO OS HOOKS COMO FONTE DA VERDADE
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  // 3. USANDO A FUNÇÃO DE LOGOUT DO useAuth
  const handleLogout = async () => {
    await signOut();
    navigate('/login'); // Garante o redirecionamento após o logout
  };

  // 4. ESTADOS DE CARREGAMENTO E ERRO
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-red-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
          <p>{profileError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          {/* 5. EXIBINDO DADOS REAIS DO BANCO */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {profile?.username || user?.email.split('@')[0] || 'Bem-vindo(a)'}
          </h1>
          <p className="text-white/70">{user?.email}</p>
        </div>

        {/* Profile Stats (Placeholder) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* ... (seus cards de stats aqui, por enquanto podem ser mockados) ... */}
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          {/* 6. BOTÃO DE CONFIGURAÇÕES AGORA É FUNCIONAL */}
          <button 
            onClick={() => navigate('/definicoes')}
            className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center space-x-3 hover:bg-card/40 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Definições</div>
              <div className="text-white/60 text-sm">Conta, aparência e mais</div>
            </div>
          </button>
          
          {/* ... (outros botões do menu permanecem como estão) ... */}

        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="w-full bg-red-500/20 border border-red-500/30 rounded-xl p-4 h-auto flex items-center justify-center space-x-3 hover:bg-red-500/30"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Sair da conta</span>
          </Button>
        </div>

        {/* ... (Version Info) ... */}
      </div>
    </div>
  );
};

export default Perfil;