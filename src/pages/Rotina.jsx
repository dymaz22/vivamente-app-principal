import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, BookOpen, Brain, CheckCircle as CheckCircleIcon, Circle, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useDailyRoutine } from '../hooks/useDailyRoutine';

const ActivityItem = ({ title, description, isCompleted, onToggleComplete, icon: Icon, onClick }) => {
  const handleCardClick = () => { if (!isCompleted && onClick) onClick(); };
  const handleCheckboxClick = (e) => { e.stopPropagation(); if (onToggleComplete) onToggleComplete(); };
  return (
    <Card className={`transition-all duration-300 ${isCompleted ? 'bg-primary/10 border-primary/30' : 'bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/40'}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary/20' : 'bg-muted/30'}`}><Icon className={`w-6 h-6 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} /></div>
          <div className="flex-1 cursor-pointer" onClick={handleCardClick}><h4 className={`font-medium ${isCompleted ? 'text-primary' : 'text-white'}`}>{title}</h4><p className="text-sm text-muted-foreground">{description}</p></div>
          <div className="flex items-center cursor-pointer p-2" onClick={handleCheckboxClick}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Rotina = () => {
  const navigate = useNavigate();
  
  // 1. REMOVIDO O 'useDailyTasks'. Esta página cuida apenas da rotina do sistema.
  const { completedActivities, completeActivity, loading: routineLoading, error: routineError } = useDailyRoutine();

  if (routineLoading) {
    return (<div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>);
  }

  if (routineError) {
    return (<div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f0f23] flex items-center justify-center p-4"><div className="text-center max-w-sm"><AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" /><h2 className="text-xl text-white">Erro</h2><p className="text-white/70">{routineError}</p></div></div>);
  }

  // 2. LÓGICA DE PROGRESSO CORRIGIDA
  const routineActivities = ['moodLog', 'lesson', 'quiz', 'practice'];
  const totalActivities = routineActivities.length; // Sempre 4
  const totalCompleted = routineActivities.filter(act => completedActivities.includes(act)).length;
  const progress = totalActivities > 0 ? (totalCompleted / totalActivities) * 100 : 0;

  const isMoodLogged = completedActivities.includes('moodLog');
  const isLessonCompleted = completedActivities.includes('lesson');
  const isQuizCompleted = completedActivities.includes('quiz');
  const isPracticeCompleted = completedActivities.includes('practice');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4 pb-24">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-primary" /></div>
          <h1 className="text-3xl font-bold text-white mb-2">Rotina Diária</h1>
          <p className="text-white/70">Sua jornada de bem-estar de hoje</p>
        </div>

        {/* Card de Progresso com dados corrigidos */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Progresso de Hoje</CardTitle>
            <CardDescription className="text-white/70">{totalCompleted} de {totalActivities} atividades concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-white/60 mt-2">{Math.round(progress)}% concluído</p>
          </CardContent>
        </Card>
        
        {/* Card de Registrar Humor */}
        <Card className={`transition-all duration-200 ${isMoodLogged ? 'bg-primary/10 border-primary/30' : 'bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 cursor-pointer hover:scale-[1.02]'}`} onClick={() => !isMoodLogged && navigate('/rotina/humor/nivel')}>
          <CardContent className="p-6"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"><Heart className="w-8 h-8 text-primary" /></div><div className="flex-1"><h3 className="text-xl font-bold text-white mb-1">{isMoodLogged ? 'Humor Registrado' : 'Registrar Humor'}</h3><p className="text-white/70">{isMoodLogged ? 'Obrigado por compartilhar!' : 'Como você está se sentindo hoje?'}</p></div><div className="flex items-center">{isMoodLogged ? <CheckCircle2 className="w-8 h-8 text-primary" /> : <Plus className="w-8 h-8 text-primary" />}</div></div></CardContent>
        </Card>
        
        {/* Atividades do Dia */}
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-semibold text-white">Atividades do Dia</h2>
          <ActivityItem title="Lição do dia" description="Conteúdo para seu desenvolvimento" isCompleted={isLessonCompleted} onToggleComplete={() => completeActivity('lesson')} icon={BookOpen} onClick={() => navigate(`/licao/seu-id`)} />
          <ActivityItem title="Teste de bem-estar" description="Avalie seu progresso" isCompleted={isQuizCompleted} onToggleComplete={() => completeActivity('quiz')} icon={Brain} onClick={() => navigate(`/teste/seu-id`)} />
          <ActivityItem title="Atividades Práticas" description="Suas tarefas personalizadas do dia" isCompleted={isPracticeCompleted} onToggleComplete={() => completeActivity('practice')} icon={CheckCircleIcon} onClick={() => navigate('/tarefas')} />
        </div>
        
        {/* 3. MENSAGEM DE PARABÉNS REINTRODUZIDA */}
        {progress === 100 && (
            <div className="mt-8 bg-primary/20 border border-primary/30 rounded-2xl p-6 text-center animate-fade-in">
                <h3 className="text-xl font-bold text-primary mb-2">🎉 Dia Concluído!</h3>
                <p className="text-white/80">Você completou todas as atividades da sua rotina de hoje. Um excelente progresso!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Rotina;