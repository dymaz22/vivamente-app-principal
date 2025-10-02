import React from 'react';
import { User, Settings, LogOut, Bell, Globe, Shield } from 'lucide-react';

const Perfil = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user.full_name || 'Usuário Demo'}
          </h1>
          <p className="text-white/70">{user.email || 'demo@vivamente.com'}</p>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">7</div>
            <div className="text-xs text-white/70">Dias ativos</div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">3</div>
            <div className="text-xs text-white/70">Programas</div>
          </div>
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">85%</div>
            <div className="text-xs text-white/70">Progresso</div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          {/* Configurações */}
          <button className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center space-x-3 hover:bg-card/40 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Configurações</div>
              <div className="text-white/60 text-sm">Personalize sua experiência</div>
            </div>
          </button>

          {/* Notificações */}
          <button className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center space-x-3 hover:bg-card/40 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Notificações</div>
              <div className="text-white/60 text-sm">Gerencie seus lembretes</div>
            </div>
          </button>

          {/* Idioma */}
          <button className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center space-x-3 hover:bg-card/40 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Idioma</div>
              <div className="text-white/60 text-sm">Português (Brasil)</div>
            </div>
          </button>

          {/* Privacidade */}
          <button className="w-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center space-x-3 hover:bg-card/40 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium">Privacidade</div>
              <div className="text-white/60 text-sm">Controle seus dados</div>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center justify-center space-x-3 hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Sair da conta</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40">
            Vivamente v2.0 - Fase 2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

