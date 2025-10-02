import React from 'react';
import { Bot, MessageCircle, Heart, Sparkles } from 'lucide-react';

const Companheiro = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Companheiro</h1>
          <p className="text-white/70">Seu assistente de bem-estar pessoal</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Em Breve</h2>
            <p className="text-white/70 mb-6">
              Conheça seu companheiro de jornada! Uma IA especializada em bem-estar que estará sempre ao seu lado.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-white/80">Conversas personalizadas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <span className="text-white/80">Suporte emocional</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <span className="text-white/80">Orientações inteligentes</span>
            </div>
          </div>

          {/* Preview Chat */}
          <div className="mt-6 bg-background/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-white/80">
                  "Olá! Sou seu companheiro de bem-estar. Como você está se sentindo hoje?"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/50">
            Em breve você terá um amigo sempre presente!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Companheiro;

