import React from 'react';

export default function LandingBackground({ children }) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* VÍDEO DE FUNDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* MÁSCARA SUAVE (Overlay) */}
      {/* Deixei mais claro (30%) para o vídeo brilhar mais, já que a logo está nele */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* CONTEÚDO (Botões ou Formulários) */}
      {/* O 'z-20' garante que fique acima do vídeo */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>

    </div>
  );
}