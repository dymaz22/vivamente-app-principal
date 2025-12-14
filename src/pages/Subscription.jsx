import React, { useState } from 'react';
import { Check, Star, Shield, Zap, ArrowRight, Brain, BarChart3, PlayCircle, HeartPulse } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Subscription = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' ou 'yearly'

  // SEU LINK DA KIRVANO
  const KIRVANO_CHECKOUT_URL = "https://pay.kirvano.com/8bf2c58f-367b-41c5-a306-d89a9db824e8";

  const handleSubscribe = () => {
    if (!user) return;

    const params = new URLSearchParams();
    params.append('email', user.email);
    if (profile?.username) {
      params.append('name', profile.username);
    }
    params.append('sck', 'vivamente_app_internal');

    const finalUrl = `${KIRVANO_CHECKOUT_URL}?${params.toString()}`;
    window.location.href = finalUrl;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
            <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
            <span className="text-sm font-medium text-purple-300">Oferta Exclusiva</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
            Invista na Sua Saúde Mental
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Tenha um acompanhamento psicológico completo, inteligente e disponível 24 horas por dia.
          </p>
        </div>

        {/* Toggle Mensal/Anual */}
        <div className="flex justify-center">
          <div className="bg-gray-800/50 p-1 rounded-full border border-gray-700 inline-flex relative">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Card PRO (Centralizado e Único) */}
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/30 rounded-3xl p-8 flex flex-col text-left relative overflow-hidden backdrop-blur-md shadow-2xl shadow-purple-900/20 group transform transition-all hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-white">Vivamente PRO</h3>
                <p className="text-sm text-purple-300 mt-1">Acesso Total Liberado</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>

            <div className="mt-6 mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
              <span className="text-5xl font-bold text-white tracking-tight">
                {billingCycle === 'monthly' ? 'R$ 29,90' : 'R$ 299,90'}
              </span>
              <span className="text-gray-400 text-sm ml-2 block mt-1">
                {billingCycle === 'monthly' ? 'cobrado mensalmente' : 'cobrado anualmente (economize 20%)'}
              </span>
            </div>

            {/* Lista de Benefícios */}
            <ul className="space-y-4 flex-grow mb-8">
              <li className="flex items-center gap-3 text-gray-200">
                <div className="p-1.5 rounded-full bg-purple-500/20"><Brain className="w-4 h-4 text-purple-400" /></div>
                <span className="font-medium">Psicóloga IA Pessoal 24h</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <div className="p-1.5 rounded-full bg-blue-500/20"><PlayCircle className="w-4 h-4 text-blue-400" /></div>
                <span>Cursos e Conteúdos em Vídeo</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <div className="p-1.5 rounded-full bg-green-500/20"><BarChart3 className="w-4 h-4 text-green-400" /></div>
                <span>Monitoramento de Sono e Humor</span>
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <div className="p-1.5 rounded-full bg-pink-500/20"><HeartPulse className="w-4 h-4 text-pink-400" /></div>
                <span>Ferramentas de TCC</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-gray-500" /> Diário Emocional Inteligente
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-gray-500" /> Análise de Padrões de Ansiedade
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-gray-500" /> Acesso Antecipado a Novidades
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-purple-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Garantir Acesso Premium <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Compra Segura</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Acesso Imediato</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;