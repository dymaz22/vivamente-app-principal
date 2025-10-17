import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, User, Mail, Lock, Languages, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const MenuItem = ({ icon: Icon, title, value, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-card/30 border-b border-border/50 text-left hover:bg-card/40">
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-white">{title}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-white/70 text-sm">{value}</span>
      {onClick && <ChevronRight className="w-4 h-4 text-white/70" />}
    </div>
  </button>
);

const Definicoes = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/perfil')} className="text-white"><ArrowLeft /></Button>
          <h1 className="text-2xl font-bold text-white">Definições</h1>
        </div>
        <div className="rounded-xl overflow-hidden border border-border/50 mb-8">
          <h2 className="text-white/70 text-sm p-4">Conta</h2>
          <MenuItem icon={User} title="Nome de utilizador" value={profile?.username} onClick={() => navigate('/definicoes/nome')} />
          <MenuItem icon={Mail} title="Correio eletrónico" value={user?.email} />
          <MenuItem icon={Lock} title="Palavra-passe" onClick={() => navigate('/definicoes/senha')} />
        </div>
        <div className="rounded-xl overflow-hidden border border-border/50 mb-8">
          <h2 className="text-white/70 text-sm p-4">Definições da Aplicação</h2>
          <MenuItem icon={Languages} title="Língua" value="Português" onClick={() => {}} />
        </div>
        <Button onClick={handleLogout} variant="destructive" className="w-full bg-red-500/20 border border-red-500/30 text-red-400">
          <LogOut className="w-4 h-4 mr-2" />
          Terminar Sessão
        </Button>
      </div>
    </div>
  );
};

export default Definicoes;