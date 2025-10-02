import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const MoodStep1_Level = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);

  const moodLevels = [
    { id: 1, label: 'Terrível', emoji: '😢', color: 'bg-red-500', description: 'Me sinto muito mal' },
    { id: 2, label: 'Ruim', emoji: '😞', color: 'bg-orange-500', description: 'Não está sendo um bom dia' },
    { id: 3, label: 'Ok', emoji: '😐', color: 'bg-yellow-500', description: 'Estou neutro, nem bem nem mal' },
    { id: 4, label: 'Bem', emoji: '🙂', color: 'bg-green-500', description: 'Me sinto bem hoje' },
    { id: 5, label: 'Fantástico', emoji: '😄', color: 'bg-blue-500', description: 'Estou me sentindo incrível!' }
  ];

  const handleNext = () => {
    if (selectedMood) {
      // Passar o humor selecionado para a próxima tela
      navigate('/rotina/humor/sentimentos', { 
        state: { moodLevel: selectedMood } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/rotina')}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Como você está?</h1>
            <p className="text-white/70">Passo 1 de 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/30 rounded-full h-2 mb-8">
          <div className="bg-primary h-2 rounded-full" style={{ width: '33%' }} />
        </div>

        {/* Mood Selection */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Selecione como você se sente agora
            </CardTitle>
            <CardDescription className="text-white/70 text-center">
              Seja honesto consigo mesmo, não há respostas certas ou erradas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {moodLevels.map((mood) => (
              <div
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  selectedMood?.id === mood.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/30 bg-card/20 hover:bg-card/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${mood.color}`}>
                    {mood.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{mood.label}</h4>
                    <p className="text-sm text-white/70">{mood.description}</p>
                  </div>
                  {selectedMood?.id === mood.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/rotina')}
            className="text-white/70 hover:text-white"
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!selectedMood}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Espaço para navegação inferior */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default MoodStep1_Level;

