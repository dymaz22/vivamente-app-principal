import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacidade() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Política de Privacidade</h1>
        </div>

        {/* Conteúdo */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Coleta de Dados</h2>
            <p>Coletamos apenas os dados essenciais para o funcionamento do app: e-mail para login e as informações que você fornece voluntariamente nos registros de humor e quiz para personalização da IA.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. Uso das Informações</h2>
            <p>Seus dados emocionais são usados EXCLUSIVAMENTE para gerar insights e personalizar sua experiência. Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins publicitários.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. Segurança</h2>
            <p>Utilizamos criptografia de ponta a ponta e serviços de banco de dados seguros (Supabase) para proteger suas informações.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. Seus Direitos</h2>
            <p>Você pode solicitar a exclusão completa de sua conta e de todos os dados associados a qualquer momento através das configurações do perfil.</p>
          </section>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-500">
            Última atualização: Dezembro de 2025
          </div>
        </div>
      </div>
    </div>
  );
}