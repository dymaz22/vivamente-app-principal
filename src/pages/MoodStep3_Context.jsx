import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useRoutine } from '../hooks/useRoutine.js'; // <-- Corrigido para .js

const MoodStep3_Context = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addMoodLog } = useRoutine();
  
  const { moodLevel, selectedSentiments } = location.state || {};
  
  const [notes, setNotes] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSocialContext, setSelectedSocialContext] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationOptions = ['Casa', 'Trabalho', 'Escola', 'Rua', 'Parque', 'Academia', 'Restaurante', 'Transporte', 'Outro'];
  const socialContextOptions = ['Sozinho(a)', 'Com família', 'Com amigos', 'Com colegas', 'Com parceiro(a)', 'Em grupo', 'Com estranhos'];
  const activityOptions = ['Trabalhando', 'Estudando', 'Exercitando', 'Comendo', 'Descansando', 'Socializando', 'Viajando', 'Assistindo TV', 'Lendo', 'Meditando', 'Outro'];

  const handleSubmit = async () => {
    if (!moodLevel || !selectedSentiments) {
      alert("Ops! Parece que os dados dos passos anteriores se perderam. Por favor, tente novamente.");
      navigate('/rotina/humor/nivel');
      return;
    }
  
    setIsSubmitting(true);
  
    const moodData = {
      level: moodLevel.value,
      description: moodLevel.label,
      sentiments: selectedSentiments,
      context: {
        notes: notes,
        location: selectedLocation,
        company: selectedSocialContext,
        activity: selectedActivity,
      }
    };
  
    try {
      const result = await addMoodLog(moodData);
      
      if (result.success) {
        navigate('/rotina');
      } else {
        alert('Houve um erro ao salvar seu registro de humor. Tente novamente.');
        console.error('Erro ao registrar humor:', result.error);
      }
    } catch (error) {
      alert('Houve um erro inesperado. Verifique sua conexão.');
      console.error('Erro inesperado no handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/rotina/humor/sentimentos', { 
      state: { moodLevel } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Conte mais</h1>
            <p className="text-white/70">Passo 3 de 3</p>
          </div>
        </div>

        <div className="w-full bg-muted/30 rounded-full h-2 mb-8">
          <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} />
        </div>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5" />O que lhe vai na cabeça?</CardTitle>
            <CardDescription className="text-white/70">Compartilhe seus pensamentos (opcional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escreva sobre como você está se sentindo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-card/20 border-border/30 text-white placeholder:text-white/50 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-white/50 mt-2">{notes.length}/500 caracteres</p>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><MapPin className="w-5 h-5" />Onde você está?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((location) => (
                <Badge
                  key={location}
                  variant={selectedLocation === location ? "default" : "secondary"}
                  className={`cursor-pointer transition-all ${selectedLocation === location ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`}
                  onClick={() => setSelectedLocation(location === selectedLocation ? '' : location)}
                >{location}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Users className="w-5 h-5" />Com quem você está?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {socialContextOptions.map((context) => (
                <Badge
                  key={context}
                  variant={selectedSocialContext === context ? "default" : "secondary"}
                  className={`cursor-pointer transition-all ${selectedSocialContext === context ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`}
                  onClick={() => setSelectedSocialContext(context === selectedSocialContext ? '' : context)}
                >{context}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5" />O que você está fazendo?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((activity) => (
                <Badge
                  key={activity}
                  variant={selectedActivity === activity ? "default" : "secondary"}
                  className={`cursor-pointer transition-all ${selectedActivity === activity ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`}
                  onClick={() => setSelectedActivity(activity === selectedActivity ? '' : activity)}
                >{activity}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} className="text-white/70 hover:text-white" disabled={isSubmitting}>
            <ArrowLeft className="w-4 h-4 mr-2" />Voltar
          </Button>
          
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Salvando...</>
            ) : ('Finalizar')}
          </Button>
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
};

export default MoodStep3_Context;