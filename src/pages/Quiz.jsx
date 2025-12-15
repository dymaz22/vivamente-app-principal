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

  // --- 25 PERGUNTAS DO SUPER QUIZ ---
  const questions = [
    // MÓDULO 1: JORNADA E PREFERÊNCIAS
    {
      id: 'objetivo_principal',
      question: "Qual seu principal objetivo com o Vivamente? 🎯",
      options: [
        { label: "Reduzir Ansiedade", icon: "😌" },
        { label: "Dormir Melhor", icon: "😴" },
        { label: "Autoconhecimento", icon: "🧠" },
        { label: "Melhorar Foco", icon: "🎯" },
        { label: "Superar Depressão", icon: "🌱" }
      ]
    },
    {
      id: 'maior_desafio',
      question: "Qual o seu maior desafio hoje? 🚧",
      options: [
        { label: "Procrastinação", icon: "🐌" },
        { label: "Falta de Motivação", icon: "🔋" },
        { label: "Estresse no Trabalho", icon: "💼" },
        { label: "Problemas de Relacionamento", icon: "💔" },
        { label: "Sentimento de Solidão", icon: "👤" }
      ]
    },
    {
      id: 'nivel_sobrecarga',
      question: "Qual seu nível de sobrecarga mental? 🤯",
      options: [
        { label: "1 (Leve)", icon: "🍃" },
        { label: "2 (Tudo sob controle)", icon: "🙂" },
        { label: "3 (Às vezes me sinto esgotado)", icon: "😐" },
        { label: "4 (Estou no limite)", icon: "😟" },
        { label: "5 (Exaustão Total)", icon: "😫" }
      ]
    },
    {
      id: 'fez_terapia',
      question: "Você já fez terapia antes? 🛋️",
      options: [
        { label: "Sim, por um tempo", icon: "✅" },
        { label: "Sim, ainda faço", icon: "✨" },
        { label: "Nunca fiz", icon: "🆕" },
        { label: "Não, mas gostaria", icon: "💭" }
      ]
    },
    {
      id: 'estilo_preferido',
      question: "Qual estilo de conversa você prefere com a IA? 💬",
      options: [
        { label: "Direto ao Ponto (Coach)", icon: "🚀" },
        { label: "Empático (Amigo)", icon: "🤝" },
        { label: "Analítico (Psicólogo)", icon: "👨‍⚕️" },
        { label: "Motivacional (Mentor)", icon: "🌟" }
      ]
    },

    // MÓDULO 2: EMOÇÕES E REAÇÕES
    {
      id: 'frequencia_ansiedade',
      question: "Com que frequência você se sente ansioso(a)? 😟",
      options: [
        { label: "1 (Raramente)", icon: "1️⃣" },
        { label: "2 (Às vezes)", icon: "2️⃣" },
        { label: "3 (Frequentemente)", icon: "3️⃣" },
        { label: "4 (Muitas vezes)", icon: "4️⃣" },
        { label: "5 (Quase todos os dias)", icon: "5️⃣" }
      ]
    },
    {
      id: 'sintomas_fisicos',
      question: "Quando está estressado(a), como seu corpo reage? (Escolha o principal)",
      options: [
        { label: "Tensão Muscular", icon: "💪" },
        { label: "Dores de Cabeça", icon: "🤕" },
        { label: "Problemas Digestivos", icon: "🤢" },
        { label: "Coração Acelerado", icon: "❤️" },
        { label: "Não Sinto Nada", icon: "🧊" }
      ]
    },
    {
      id: 'preocupacao_controle',
      question: "Você se preocupa com coisas que não pode controlar? 🤔",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Constantemente)", icon: "5️⃣" }
      ]
    },
    {
      id: 'dificuldade_nao',
      question: "Você tem dificuldade em dizer 'não'? 🙅‍♀️",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'culpa_autocuidado',
      question: "Você se sente culpado(a) por tirar um tempo para si? 😔",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'emocao_evitada',
      question: "Qual emoção você mais evita sentir? 🙈",
      options: [
        { label: "Raiva", icon: "😡" },
        { label: "Tristeza", icon: "😭" },
        { label: "Medo", icon: "😨" },
        { label: "Frustração", icon: "😤" },
        { label: "Alegria", icon: "😊" }
      ]
    },
    {
      id: 'sentimento_isolamento',
      question: "Você se sente sozinho(a) ou isolado(a)? 🫂",
      options: [
        { label: "1 (Raramente)", icon: "1️⃣" },
        { label: "2 (Às vezes)", icon: "2️⃣" },
        { label: "3 (Muitas vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Quase sempre)", icon: "5️⃣" }
      ]
    },

    // MÓDULO 3: ROTINA E HÁBITOS
    {
      id: 'horas_sono',
      question: "Quantas horas você dorme por noite? 😴",
      options: [
        { label: "Menos de 5h", icon: "📉" },
        { label: "5-6h", icon: "🟡" },
        { label: "6-7h", icon: "🟢" },
        { label: "7-8h", icon: "✅" },
        { label: "Mais de 8h", icon: "📈" }
      ]
    },
    {
      id: 'frequencia_exercicio',
      question: "Com que frequência você se exercita? 🏃‍♂️",
      options: [
        { label: "Nunca", icon: "❌" },
        { label: "1-2x por mês", icon: "🐌" },
        { label: "1-2x por semana", icon: "🚶" },
        { label: "3-4x por semana", icon: "🏃" },
        { label: "Quase todos os dias", icon: "🔥" }
      ]
    },
    {
      id: 'celular_cama',
      question: "Você costuma usar o celular na cama antes de dormir? 📱",
      options: [
        { label: "Sim, sempre", icon: "🚨" },
        { label: "Às vezes", icon: "⚠️" },
        { label: "Raramente", icon: "🟢" },
        { label: "Nunca", icon: "✅" }
      ]
    },
    {
      id: 'tem_hobby',
      question: "Você tem um hobby ou atividade que te relaxa? 🎨",
      options: [
        { label: "Sim, vários", icon: "🎉" },
        { label: "Sim, um só", icon: "😌" },
        { label: "Não, mas quero", icon: "💭" },
        { label: "Não tenho", icon: "❌" }
      ]
    },
    {
      id: 'planejamento_diario',
      question: "Você tem o hábito de planejar seu dia? 🗓️",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'pula_cafe',
      question: "Você costuma pular o café da manhã? ☕",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Quase sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'nivel_produtividade',
      question: "Você se sente produtivo(a) na maior parte do dia? ✅",
      options: [
        { label: "1 (Raramente)", icon: "1️⃣" },
        { label: "2 (Às vezes)", icon: "2️⃣" },
        { label: "3 (Frequentemente)", icon: "3️⃣" },
        { label: "4 (Muitas vezes)", icon: "4️⃣" },
        { label: "5 (Quase sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'pratica_meditacao',
      question: "Você tem o hábito de meditar ou praticar mindfulness? 🙏",
      options: [
        { label: "Sim, diariamente", icon: "🧘" },
        { label: "Sim, às vezes", icon: "🟡" },
        { label: "Não, mas quero", icon: "💭" },
        { label: "Nunca", icon: "❌" }
      ]
    },
    {
      id: 'rotina_sono_fixa',
      question: "Você tem um horário fixo para acordar e dormir? ⏰",
      options: [
        { label: "Sim, sempre", icon: "✅" },
        { label: "Sim, na maioria das vezes", icon: "🟡" },
        { label: "Não, é aleatório", icon: "❌" }
      ]
    },
    {
      id: 'comer_por_impulso',
      question: "Você costuma comer por impulso quando está estressado(a)? 🍔",
      options: [
        { label: "1 (Nunca)", icon: "1️⃣" },
        { label: "2 (Raramente)", icon: "2️⃣" },
        { label: "3 (Às vezes)", icon: "3️⃣" },
        { label: "4 (Frequentemente)", icon: "4️⃣" },
        { label: "5 (Sempre)", icon: "5️⃣" }
      ]
    },
    {
      id: 'ladrão_tempo',
      question: "Qual é o seu maior 'ladrão de tempo' no dia? ⏳",
      options: [
        { label: "Redes Sociais", icon: "📱" },
        { label: "Notícias/TV", icon: "📺" },
        { label: "Jogos", icon: "🎮" },
        { label: "Tarefas Domésticas", icon: "🧹" },
        { label: "Nenhum", icon: "✨" }
      ]
    },
    {
      id: 'faz_diario',
      question: "Você tem o hábito de escrever ou fazer um diário? ✍️",
      options: [
        { label: "Sim, diariamente", icon: "📝" },
        { label: "Sim, às vezes", icon: "🟡" },
        { label: "Não, mas quero", icon: "💭" },
        { label: "Nunca", icon: "❌" }
      ]
    },
    {
      id: 'fonte_apoio',
      question: "Qual a sua principal fonte de apoio emocional? 🤝",
      options: [
        { label: "Família", icon: "👨‍👩‍👧‍👦" },
        { label: "Amigos", icon: "👯" },
        { label: "Parceiro(a)", icon: "❤️" },
        { label: "Sozinho(a)", icon: "👤" },
        { label: "Profissional", icon: "👨‍⚕️" }
      ]
    }
  ];
  // --- FIM DAS 25 PERGUNTAS ---

  const handleSelect = (option) => {
    // Salva a resposta no formato { id: 'label' }
    setAnswers({ ...answers, [questions[currentStep].id]: option.label });
  };

  const handleNext = async () => {
    // Verifica se a pergunta atual foi respondida
    if (!answers[questions[currentStep].id]) return;

    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    try {
      // 1. Criar o "Dossiê" para a IA em formato JSON (mais limpo e fácil de ler)
      const aiContextData = {
        data_coleta: new Date().toISOString(),
        ...answers // Espalha todas as 25 respostas aqui
      };

      // 2. Formatar o Dossiê para o System Prompt (Texto)
      // A IA lê o JSON, mas o texto é mais fácil de debugar
      const aiContextText = `
        PERFIL COMPLETO DO USUÁRIO (QUIZ DE 25 PERGUNTAS):
        - Objetivo Principal: ${aiContextData.objetivo_principal}
        - Maior Desafio: ${aiContextData.maior_desafio}
        - Nível de Sobrecarga (1-5): ${aiContextData.nivel_sobrecarga}
        - Já fez Terapia: ${aiContextData.fez_terapia}
        - Estilo de Conversa Preferido: ${aiContextData.estilo_preferido}
        - Frequência de Ansiedade (1-5): ${aiContextData.frequencia_ansiedade}
        - Sintoma Físico Principal: ${aiContextData.sintomas_fisicos}
        - Preocupa com o Incontrolável (1-5): ${aiContextData.preocupacao_controle}
        - Dificuldade em dizer Não (1-5): ${aiContextData.dificuldade_nao}
        - Culpa por Autocuidado (1-5): ${aiContextData.culpa_autocuidado}
        - Emoção Mais Evitada: ${aiContextData.emocao_evitada}
        - Sentimento de Isolamento (1-5): ${aiContextData.sentimento_isolamento}
        - Horas de Sono: ${aiContextData.horas_sono}
        - Frequência de Exercício: ${aiContextData.frequencia_exercicio}
        - Usa Celular na Cama: ${aiContextData.celular_cama}
        - Tem Hobby: ${aiContextData.tem_hobby}
        - Planejamento Diário (1-5): ${aiContextData.planejamento_diario}
        - Pula Café (1-5): ${aiContextData.pula_cafe}
        - Nível de Produtividade (1-5): ${aiContextData.nivel_produtividade}
        - Pratica Meditação: ${aiContextData.pratica_meditacao}
        - Rotina de Sono Fixa: ${aiContextData.rotina_sono_fixa}
        - Come por Impulso (1-5): ${aiContextData.comer_por_impulso}
        - Ladrão de Tempo: ${aiContextData.ladrão_tempo}
        - Faz Diário: ${aiContextData.faz_diario}
        - Fonte de Apoio: ${aiContextData.fonte_apoio}
        
        INSTRUÇÃO PARA A IA: Use esses dados para personalizar o atendimento e as sugestões de ferramentas.
      `;

      // 3. Salvar no Supabase
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            onboarding_completed: true,
            ai_context: aiContextText // Salva o dossiê completo
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      // 4. Redirecionar
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
            // Só habilita se a resposta da pergunta atual existir
            disabled={!answers[questions[currentStep].id] || loading} 
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/30"
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