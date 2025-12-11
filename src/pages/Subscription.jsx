import React, { useState } from 'react';
import { Check, Star, Shield, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    "Acesso ilimitado ao Companheiro IA",
    "Análises emocionais avançadas",
    "Histórico ilimitado de humor",
    "Conteúdos exclusivos de TCC",
    "Backup automático na nuvem"
  ];

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // 1. Simula um delay de processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Atualiza o usuário no banco de dados para PRO
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_pro: true })
          .eq('id', user.id);

        if (error) throw error;
      }

      // 3. Redireciona para o Quiz (Próxima etapa)
      navigate('/quiz');

    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert('Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center py-12 px-4 relative overflow-hidden">
      
      {/* Fundo com Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Cabeçalho */}
      <div className="relative z-10 text-center mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Star className="w-3 h-3" /> Seja Premium
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Invista na sua mente
        </h1>
        <p className="text-gray-400 text-lg">
          Desbloqueie todo o potencial do Vivamente e transforme sua jornada de autoconhecimento.
        </p>
      </div>

      {/* Toggle Mensal/Anual */}
      <div className="relative z-10 flex items-center bg-gray-800/50 p-1 rounded-xl mb-12 border border-white/5">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            billingCycle === 'monthly' 
              ? 'bg-gray-700 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            billingCycle === 'yearly' 
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Anual <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">-20%</span>
        </button>
      </div>

      {/* Card do Plano */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative rounded-3xl border border-purple-500/30 bg-gray-900/60 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
          
          {/* Faixa de Destaque */}
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
            RECOMENDADO
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-200">Vivamente PRO</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-bold text-white">
                {billingCycle === 'monthly' ? 'R$ 29,90' : 'R$ 239,90'}
              </span>
              <span className="text-gray-400">
                /{billingCycle === 'monthly' ? 'mês' : 'ano'}
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm text-green-400 mt-1">Economize R$ 118,90 por ano</p>
            )}
          </div>

          {/* Lista de Benefícios */}
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <div className="mt-1 min-w-[20px]">
                  <Check className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Botão de Ação */}
          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                Desbloquear Agora
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" /> Pagamento 100% seguro via Stripe
          </p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/login')}
        className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
      >
        Sair e entrar com outra conta
      </button>

    </div>
  );
}