import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col justify-end px-6 pb-12">
      
      {/* Espaço vazio em cima para deixar o vídeo aparecer */}
      <div className="flex-1" />

      {/* Container dos Botões */}
      <div className="flex flex-col space-y-4 animate-fade-in-up">
        
        {/* BOTÃO 1 (Principal): JÁ TENHO CONTA -> Vai para Login */}
        <button
          onClick={() => navigate('/login')}
          className="w-full rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"
        >
          Já tenho uma conta
        </button>

        {/* BOTÃO 2 (Secundário): CRIAR UMA CONTA -> Vai para Cadastro */}
        <button
          onClick={() => navigate('/register')}
          className="w-full rounded-2xl border-2 border-white/30 bg-white/5 py-4 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 active:scale-95"
        >
          Criar uma conta
        </button>

      </div>
    </div>
  );
}