import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, CheckCircle } from 'lucide-react';

const messages = [
  "Conectando à rede neural...",
  "Analisando seus padrões de resposta...",
  "Identificando pontos de foco...",
  "Personalizando sua jornada...",
  "Gerando dossiê emocional...",
  "Tudo pronto."
];

export default function TransitionScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Duração total da animação: ~4.5 segundos
    const totalDuration = 4500; 
    const intervalTime = 50;
    const steps = totalDuration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Troca de mensagens baseada no progresso
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, totalDuration / messages.length);

    // Finalização
    const completeTimeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalDuration + 500); // Pequeno delay extra no final

    return () => {
      clearInterval(timer);
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
        
        {/* Ícone Central Pulsante */}
        <div className="relative mb-12">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl"
          />
          <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-full border border-white/10 shadow-2xl">
            {progress < 100 ? (
              <Brain size={48} className="text-purple-400" />
            ) : (
              <CheckCircle size={48} className="text-green-400" />
            )}
          </div>
          
          {/* Partículas Orbitando (Decorativo) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] border border-dashed border-white/10 rounded-full"
          />
        </div>

        {/* Mensagens Dinâmicas */}
        <div className="h-8 mb-8 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-gray-200 text-center"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
          {/* Brilho na ponta da barra */}
          <motion.div 
            className="absolute top-0 h-full w-4 bg-white/50 blur-[2px]"
            style={{ left: `${progress}%`, translateX: '-100%' }}
          />
        </div>
        
        <div className="mt-4 flex justify-between w-full text-xs text-gray-500 font-mono">
          <span>AI_PROCESSOR_V2</span>
          <span>{Math.round(progress)}%</span>
        </div>

      </div>
    </div>
  );
}