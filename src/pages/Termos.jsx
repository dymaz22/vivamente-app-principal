import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Termos() {
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
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Termos de Uso</h1>
        </div>

        {/* Conteúdo (Texto Jurídico Padrão Simplificado) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold mb-2">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar o Vivamente, você concorda com estes termos. O aplicativo é uma ferramenta de autoconhecimento e não substitui acompanhamento médico ou psicológico profissional.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">2. Uso do Serviço</h2>
            <p>Você se compromete a usar o serviço apenas para fins legais e pessoais. O compartilhamento de sua conta PRO com terceiros pode resultar em bloqueio.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">3. Assinaturas e Pagamentos</h2>
            <p>O Vivamente PRO é um serviço de assinatura. O cancelamento pode ser feito a qualquer momento, interrompendo a renovação automática para o próximo ciclo.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">4. Isenção de Responsabilidade</h2>
            <p>Nossa IA fornece sugestões baseadas em TCC (Terapia Cognitivo-Comportamental), mas não realiza diagnósticos clínicos. Em caso de crise, procure ajuda emergencial (CVV 188).</p>
          </section>
          
          <div className="pt-4 border-t border-white/10 text-xs text-gray-500">
            Última atualização: Dezembro de 2025
          </div>
        </div>
      </div>
    </div>
  );
}