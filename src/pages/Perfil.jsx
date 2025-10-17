import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Loader2, AlertCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><User /></div>
          <h1 className="text-2xl font-bold text-white">
            {profile?.username || user?.email.split('@')[0]}
          </h1>
          <p className="text-white/70">{user?.email}</p>
        </div>
        <button onClick={() => navigate('/definicoes')} className="w-full p-4 flex items-center space-x-3">
          <Settings />
          <div>
            <div>Definições</div>
            <div>Conta, aparência e mais</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Perfil;