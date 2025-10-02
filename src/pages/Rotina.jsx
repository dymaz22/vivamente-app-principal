import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, BookOpen, Brain, CheckCircle, Circle, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useRoutine } from '../hooks/useRoutine';

// Componente para item de tarefa diária
const DailyTaskItem = ({ task, isCompleted, onToggleComplete, icon: Icon, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isCompleted) return;
    
    // Navegar para a tela correspondente baseado no tipo
    switch (type) {
      case 'lesson':
        if (task?.id) navigate(`/licao/${task.id}`);
        break;
      case 'quiz':
        if (task?.id) navigate(`/teste/${task.id}`);
        break;
      case 'task':
        // Para tarefas, navegar para ferramentas por enquanto
        navigate('/tarefas');
        break;
      default:
        break;
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Evitar que o clique no checkbox acione o clique do card
    if (onToggleComplete) {
      onToggleComplete();
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:scale-[1.02] ${
        isCompleted 
          ? 'bg-primary/10 border-primary/30' 
          : 'bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/40'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-primary/20' : 'bg-muted/30'
          }`}>
            <Icon className={`w-6 h-6 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div 
            className="flex-1 cursor-pointer"
            onClick={handleCardClick}
          >
            <h4 className={`font-medium ${isCompleted ? 'text-primary' : 'text-white'}`}>
              {task?.title_pt || task?.title || 'Tarefa'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {type === 'lesson' && 'Lição do dia'}
              {type === 'quiz' && 'Teste de bem-estar'}
              {type === 'task' && 'Atividade prática'}
              {type === 'moodLog' && 'Registro de humor'}
            </p>
          </div>
          
          <div 
            className="flex items-center cursor-pointer p-2"
            onClick={handleCheckboxClick}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Rotina = () => {
  const navigate = useNavigate();
  const { 
    dailyRoutine, 
    isLoading, 
    isAuthenticated, 
    authLoading, 
    error, 
    getDailyRoutine, 
    markTaskAsCompleted 
  } = useRoutine();

  // Não executar useEffect se ainda estiver carregando autenticação
  useEffect(() => {
    // Os dados são carregados automaticamente pelo hook quando o usuário está autenticado
    // Não precisamos chamar getDailyRoutine aqui pois o hook já faz isso
  }, []);

  // Estado de carregamento de autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/70 mt-4">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de não autenticado (não deveria acontecer devido ao ProtectedRoute, mas é uma segurança extra)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
            <p className="text-white/70 mb-4">Você precisa estar logado para acessar esta página.</p>
            <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
              Fazer Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado de carregamento de dados
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/70 mt-4">Carregando sua rotina...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error && !dailyRoutine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-md">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Erro ao Carregar</h2>
            <p className="text-white/70 mb-4">{error}</p>
            <Button onClick={() => getDailyRoutine()} className="bg-primary hover:bg-primary/90">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calcular progresso
  const completedTasks = dailyRoutine?.completions ? Object.values(dailyRoutine.completions).filter(Boolean).length : 0;
  const totalTasks = 4;
  const progress = (completedTasks / totalTasks) * 100;

  const handleMoodLogPress = () => {
    navigate('/rotina/humor/nivel');
  };

  const handleTaskComplete = async (taskType) => {
    await markTaskAsCompleted(taskType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Rotina Diária</h1>
          <p className="text-white/70">Sua jornada de bem-estar de hoje</p>
        </div>

        {/* Progresso */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Progresso de Hoje</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {completedTasks}/{totalTasks}
              </Badge>
            </CardTitle>
            <CardDescription className="text-white/70">
              {completedTasks === totalTasks 
                ? '🎉 Parabéns! Você completou todas as atividades!'
                : `${totalTasks - completedTasks} atividades restantes`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-white/60 mt-2">{Math.round(progress)}% concluído</p>
          </CardContent>
        </Card>

        {/* Registro de Humor - Card Principal */}
        <Card 
          className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 mb-6 cursor-pointer hover:scale-[1.02] transition-all duration-200"
          onClick={handleMoodLogPress}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {dailyRoutine?.completions?.moodLog ? 'Humor Registrado' : 'Registrar Humor'}
                </h3>
                <p className="text-white/70">
                  {dailyRoutine?.completions?.moodLog 
                    ? 'Obrigado por compartilhar como se sente!'
                    : 'Como você está se sentindo hoje?'
                  }
                </p>
              </div>
              <div className="flex items-center">
                {dailyRoutine?.completions?.moodLog ? (
                  <CheckCircle className="w-8 h-8 text-primary" />
                ) : (
                  <Plus className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Tarefas Diárias */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Atividades do Dia</h2>
          
          {/* Lição */}
          <DailyTaskItem
            task={dailyRoutine?.lesson}
            isCompleted={dailyRoutine?.completions?.lesson}
            onToggleComplete={() => handleTaskComplete('lesson')}
            icon={BookOpen}
            type="lesson"
          />

          {/* Teste */}
          <DailyTaskItem
            task={dailyRoutine?.quiz}
            isCompleted={dailyRoutine?.completions?.quiz}
            onToggleComplete={() => handleTaskComplete('quiz')}
            icon={Brain}
            type="quiz"
          />

          {/* Tarefa/Ferramenta */}
          <DailyTaskItem
            task={dailyRoutine?.task}
            isCompleted={dailyRoutine?.completions?.task}
            onToggleComplete={() => handleTaskComplete('task')}
            icon={CheckCircle}
            type="task"
          />
        </div>

        {/* Mensagem de Motivação */}
        {completedTasks === totalTasks && (
          <Card className="bg-primary/20 border-primary/30 mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-primary mb-2">🌟 Dia Completo!</h3>
              <p className="text-white/80">
                Você completou todas as atividades de hoje. Continue assim e transforme sua vida!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Aviso de erro (se houver erro mas ainda temos dados) */}
        {error && dailyRoutine && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 mt-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-yellow-200">
                  Alguns dados podem estar desatualizados. {error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Espaço para navegação inferior */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Rotina;
