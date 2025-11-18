import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, MapPin, Users, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const MoodStep3_Context = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
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
    if (!user || !moodLevel || !selectedSentiments) {
      navigate('/rotina/humor/nivel');
      return;
    }
    setIsSubmitting(true);
  
    try {
      const { data: moodLog, error: moodLogError } = await supabase
        .from('mood_logs')
        .insert({
          user_id: user.id,
          mood_level: moodLevel.id,
          mood: moodLevel.label,
          context_notes: notes,
          context_location: selectedLocation,
          context_company: selectedSocialContext,
          context_activity: selectedActivity,
        })
        .select()
        .single();
      if (moodLogError) throw moodLogError;

      const sentimentIds = selectedSentiments.map(s => s.id);
      if (sentimentIds.length > 0) {
        const logSentimentsData = sentimentIds.map(sentimentId => ({
          log_id: moodLog.id, // CORREÇÃO: 'mood_log_id' para 'log_id'
          sentiment_id: sentimentId,
        }));
        const { error: logSentimentsError } = await supabase.from('log_sentiments').insert(logSentimentsData);
        if (logSentimentsError) throw logSentimentsError;
      }
      
      navigate('/rotina/humor/sucesso');

    } catch (error) {
      console.error("Erro ao salvar registro de humor:", error);
      alert("Falha ao salvar registro. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => { navigate('/rotina/humor/sentimentos', { state: { moodLevel } }); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4 pb-24">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:text-white/80"><ArrowLeft className="w-6 h-6" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold text-white">Conte mais</h1><p className="text-white/70">Passo 3 de 3</p></div>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 mb-8"><div className="bg-primary h-2 rounded-full" style={{ width: '100%' }} /></div>
        
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5" />O que lhe vai na cabeça?</CardTitle><CardDescription className="text-white/70">Compartilhe (opcional)</CardDescription></CardHeader>
          <CardContent>
            <Textarea placeholder="Escreva sobre como você está se sentindo..." value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-card/20 border-border/30 text-white placeholder:text-white/50" maxLength={500} />
            <p className="text-xs text-white/50 mt-2 text-right">{notes.length}/500</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><MapPin className="w-5 h-5" />Onde você está?</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((option) => (<Badge key={option} variant={selectedLocation === option ? "default" : "secondary"} className={`cursor-pointer transition-all ${selectedLocation === option ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`} onClick={() => setSelectedLocation(option === selectedLocation ? '' : option)}>{option}</Badge>))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Users className="w-5 h-5" />Com quem você está?</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {socialContextOptions.map((option) => (<Badge key={option} variant={selectedSocialContext === option ? "default" : "secondary"} className={`cursor-pointer transition-all ${selectedSocialContext === option ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`} onClick={() => setSelectedSocialContext(option === selectedSocialContext ? '' : option)}>{option}</Badge>))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5" />O que você está fazendo?</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((option) => (<Badge key={option} variant={selectedActivity === option ? "default" : "secondary"} className={`cursor-pointer transition-all ${selectedActivity === option ? 'bg-primary text-primary-foreground' : 'bg-card/40 text-white hover:bg-card/60'}`} onClick={() => setSelectedActivity(option === selectedActivity ? '' : option)}>{option}</Badge>))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleBack} className="text-white/70 hover:text-white" disabled={isSubmitting}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Salvando...</>) : ('Finalizar')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodStep3_Context;