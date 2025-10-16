import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
// 1. VOLTANDO A USAR O useRoutine ORIGINAL E SIMPLES
import { useRoutine } from '../hooks/useRoutine.js';

const MoodStep2_Sentiments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. A LISTA DE SENTIMENTOS VOLTARÁ A FUNCIONAR
  const { sentimentsList: sentiments } = useRoutine(); 
  
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const moodLevel = location.state?.moodLevel;

  const toggleSentiment = (sentiment) => {
    setSelectedSentiments(prev => 
      prev.some(s => s.id === sentiment.id)
        ? prev.filter(s => s.id !== sentiment.id)
        : [...prev, sentiment]
    );
  };

  const handleNext = () => {
    navigate('/rotina/humor/contexto', { 
      state: { 
        moodLevel,
        // Enviando os objetos completos para o próximo passo
        selectedSentiments: selectedSentiments
      } 
    });
  };

  const handleBack = () => {
    navigate('/rotina/humor/nivel');
  };

  return (
    // O JSX aqui já estava correto e permanece o mesmo
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white"><ArrowLeft className="w-6 h-6" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold text-white">Que sentimentos?</h1><p className="text-white/70">Passo 2 de 3</p></div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 mb-8"><div className="bg-primary h-2 rounded-full" style={{ width: '66%' }} /></div>
        {moodLevel && (
          <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-xl">{moodLevel.emoji}</div><div><p className="text-white font-medium">Você se sente: {moodLevel.label}</p><p className="text-white/70 text-sm">{moodLevel.description}</p></div></div></CardContent></Card>
        )}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader><CardTitle className="text-white">Quais sentimentos você está experimentando?</CardTitle><CardDescription className="text-white/70">Selecione todos que se aplicam.</CardDescription></CardHeader>
          <CardContent>
            {selectedSentiments.length > 0 && (<div className="mb-4"><p className="text-sm text-white/70 mb-2">Selecionados:</p><div className="flex flex-wrap gap-2">{selectedSentiments.map((s) => (<Badge key={s.id} variant="secondary" className="bg-primary/20 text-primary" onClick={() => toggleSentiment(s)}>{s.name} ×</Badge>))}</div></div>)}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sentiments.map((sentiment) => {
                const isSelected = selectedSentiments.some(s => s.id === sentiment.id);
                return (<div key={sentiment.id} onClick={() => toggleSentiment(sentiment)} className={`p-3 rounded-lg border cursor-pointer ${isSelected ? 'border-primary bg-primary/10' : 'border-border/30 bg-card/20'}`}><p className="font-medium text-center text-white">{sentiment.name}</p></div>);
              })}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} className="text-white/70"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">Próximo<ArrowRight className="w-4 h-4 ml-2" /></Button>
        </div>
      </div>
    </div>
  );
};
export default MoodStep2_Sentiments;