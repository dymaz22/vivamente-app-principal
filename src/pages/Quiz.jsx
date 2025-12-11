import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // PERGUNTAS DO QUIZ
  const questions = [
    {
      id: 'goal',
      question: "Qual é seu principal objetivo hoje?",
      options: [
        { label: "Reduzir Ansiedade", icon: "😌" },
        { label: "Dormir Melhor", icon: "😴" },
        { label: "Autoconhecimento", icon: "🧠" },
        { label: "Superar Depressão", icon: "🌱" },
        { label: "Melhorar Foco", icon: "🎯" }
      ]
    },
    {
      id: 'mood',
      question: "Como você tem se sentido ultimamente?",
      options: [
        { label: "Muito Bem", icon: "😄" },
        { label: "Bem", icon: "🙂" },
        { label: "Neutro", icon: "😐" },
        { label: "Mal", icon: "🙁" },
        { label: "Péssimo", icon: "😫" }
      ]
    },
    {
      id: 'frequency',
      question: "Com que frequência você se sente sobrecarregado?",
      options: [
        { label: "Raramente", icon: "🍃" },
        { label: "Às vezes", icon: "☁️" },
        { label: "Frequentemente", icon: "🌧️" },
        { label: "Sempre", icon: "⛈️" }
      ]
    },
    {
      id: 'style',
      question: "Como você prefere que a IA fale com você?",
      options: [
        { label: "Como um Psicólogo (Formal)", icon: "👨‍⚕️" },
        { label: "Como um Amigo (Informal)", icon: "🤝" },
        { label: "Direto ao Ponto (Coach)", icon: "🚀" },
        { label: "Carinhoso e Acolhedor", icon: "🤗" }
      ]
    }
  ];

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option.label });
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    try {
      // 1. Criar o "Dossiê" para a IA
      const aiContext = `
        PERFIL DO USUÁRIO:
        - Objetivo Principal: ${answers.goal}
        - Estado Emocional Recente: ${answers.mood}
        - Nível de Sobrecarga: ${answers.frequency}
        - Estilo de Conversa Preferido: ${answers.style}
        
        Instrução: Use essas informações para personalizar todas as respostas.
      `;

      // 2. Salvar no Supabase
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            onboarding_completed: true,
            ai_context: aiContext
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      // 3. Redirecionar SUAVEMENTE (Sem recarregar a página)
      // Isso mantém a sessão do usuário ativa
      navigate('/aprender', { replace: true });

    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      alert('Erro ao salvar suas respostas. Tente novamente.');
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-lg relative z-10">
        
        {/* Barra de Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase tracking-wider">
            <span>Passo {currentStep + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Área da Pergunta */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center leading-tight">
                {questions[currentStep].question}
              </h2>

              <div className="space-y-3">
                {questions[currentStep].options.map((option, idx) => {
                  const isSelected = answers[questions[currentStep].id] === option.label;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                        isSelected 
                          ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20' 
                          : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{option.icon}</span>
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {option.label}
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(curr => curr - 1)}
            disabled={currentStep === 0 || loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-colors ${
              currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[questions[currentStep].id] || loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-white/10"
          >
            {loading ? (
              'Finalizando...'
            ) : (
              <>
                {currentStep === questions.length - 1 ? 'Concluir' : 'Próximo'}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}