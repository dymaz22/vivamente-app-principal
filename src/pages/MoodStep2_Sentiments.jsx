import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useRoutine } from '../hooks/useRoutine';

const MoodStep2_Sentiments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sentiments, loading } = useSentiments();
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  
  const moodLevel = location.state?.moodLevel;

  const toggleSentiment = (sentiment) => {
    setSelectedSentiments(prev => {
      const isSelected = prev.find(s => s.id === sentiment.id);
      if (isSelected) {
        return prev.filter(s => s.id !== sentiment.id);
      } else {
        return [...prev, sentiment];
      }
    });
  };

  const handleNext = () => {
    navigate('/rotina/humor/contexto', { 
      state: { 
        moodLevel,
        selectedSentiments: selectedSentiments.map(s => s.id)
      } 
    });
  };

  const handleBack = () => {
    navigate('/rotina/humor/nivel');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/70 mt-4">Carregando sentimentos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Que sentimentos?</h1>
            <p className="text-white/70">Passo 2 de 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/30 rounded-full h-2 mb-8">
          <div className="bg-primary h-2 rounded-full" style={{ width: '66%' }} />
        </div>

        {/* Mood Level Display */}
        {moodLevel && (
          <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${moodLevel.color}`}>
                  {moodLevel.emoji}
                </div>
                <div>
                  <p className="text-white font-medium">Você se sente: {moodLevel.label}</p>
                  <p className="text-white/70 text-sm">{moodLevel.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sentiments Selection */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">
              Quais sentimentos você está experimentando?
            </CardTitle>
            <CardDescription className="text-white/70">
              Selecione todos que se aplicam. Você pode escolher quantos quiser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSentiments.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-white/70 mb-2">Selecionados ({selectedSentiments.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSentiments.map((sentiment) => (
                    <Badge 
                      key={sentiment.id}
                      variant="secondary"
                      className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                      onClick={() => toggleSentiment(sentiment)}
                    >
                      {sentiment.name} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {sentiments.map((sentiment) => {
                const isSelected = selectedSentiments.find(s => s.id === sentiment.id);
                return (
                  <div
                    key={sentiment.id}
                    onClick={() => toggleSentiment(sentiment)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/30 bg-card/20 text-white hover:bg-card/30'
                    }`}
                  >
                    <p className="font-medium text-center">{sentiment.name}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90"
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

export default MoodStep2_Sentiments;

