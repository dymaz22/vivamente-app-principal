import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

const MoodSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/rotina', { state: { fromSuccess: true } });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex flex-col justify-center items-center p-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        <div className="relative w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Humor Registrado!</h1>
      <p className="text-white/70 max-w-sm mb-8">
        Obrigado por compartilhar. Cada registro é um passo importante.
      </p>
      <Button onClick={() => navigate('/rotina')} className="bg-primary hover:bg-primary/90">
        Voltar para a Rotina
      </Button>
    </div>
  );
};

export default MoodSuccess;