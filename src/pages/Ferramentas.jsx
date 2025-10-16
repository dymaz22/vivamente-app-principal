import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Loader2, Trash2, X, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import CustomCheckbox from '../components/CustomCheckbox';
import PetalsAnimation from '../components/PetalsAnimation';
import { useDailyTasks } from '../hooks/useDailyTasks';

const Ferramentas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [taskPendingDeletion, setTaskPendingDeletion] = useState(null);
  
  // 1. ESTADOS PARA ANIMAÇÃO DE EXCLUSÃO
  // 'tarefas' é a fonte da verdade, 'tasksToRender' é o que aparece na tela
  const { tasks: tarefas, loading, error, toggleTaskCompletion, deleteTask, refetchTasks } = useDailyTasks();
  const [tasksToRender, setTasksToRender] = useState(tarefas);

  useEffect(() => {
    setTasksToRender(tarefas); // Sincroniza a lista de renderização com a lista real
  }, [tarefas]);

  useEffect(() => {
    if (location.state?.taskJustAdded) {
      refetchTasks();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, refetchTasks, navigate]);

  const handleTaskToggle = (taskId, currentStatus) => {
    toggleTaskCompletion(taskId, currentStatus);
  };
  
  const handleDeleteClick = (taskId) => {
    setTaskPendingDeletion(taskId);
  };

  // 2. FUNÇÃO DE CONFIRMAÇÃO COM LÓGICA DE ANIMAÇÃO
  const handleConfirmDelete = (taskId) => {
    // Adiciona uma classe para iniciar a animação de fade-out
    document.getElementById(`task-${taskId}`).classList.add('fade-out-up');

    // Espera a animação terminar (300ms) antes de deletar de verdade
    setTimeout(() => {
      deleteTask(taskId);
      setTaskPendingDeletion(null);
    }, 300);
  };

  const handleCancelDelete = () => {
    setTaskPendingDeletion(null);
  };

  const tarefasCompletas = tarefas.filter(t => t.is_completed).length;
  const totalTarefas = tarefas.length;
  const progressoPercentual = totalTarefas > 0 ? Math.round((tarefasCompletas / totalTarefas) * 100) : 0;
  
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header e Loading (sem alterações) */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/aprender')} className="text-white hover:text-white/80"><ArrowLeft className="w-6 h-6" /></Button>
          <div className="flex-1"><h1 className="text-2xl font-bold text-white">Tarefas do Dia</h1><p className="text-white/70 flex items-center gap-2"><Calendar className="w-4 h-4" />Hoje, {getFormattedDate()}</p></div>
          <Button onClick={() => navigate("/tarefas/nova")} className="bg-primary hover:bg-primary/90 text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Adicionar</Button>
        </div>
        {loading && (<div className="text-center py-10"><Loader2 className="w-8 h-8 text-white animate-spin mx-auto" /><p>Carregando...</p></div>)}
        {error && (<div className="bg-red-500/20 p-6 rounded-2xl"><h3 className="text-red-400">Erro</h3><p>{error}</p></div>)}

        {!loading && !error && (
          <>
            {/* Progresso (sem alterações) */}
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-lg font-semibold text-white">Progresso</h3><p className="text-white/70">{tarefasCompletas} de {totalTarefas} tarefas</p></div>
                <div className="text-2xl font-bold text-primary">{progressoPercentual}%</div>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3"><div className="progress-bar h-3 rounded-full" style={{ width: `${progressoPercentual}%` }} /></div>
            </div>

            {/* Lista de tarefas com animação */}
            <div className="space-y-3">
              {tasksToRender.length > 0 ? (
                tasksToRender.map((tarefa) => (
                  <div 
                    key={tarefa.id} 
                    id={`task-${tarefa.id}`} // ID para a animação
                    className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-300"
                  >
                    <CustomCheckbox checked={tarefa.is_completed} onChange={() => handleTaskToggle(tarefa.id, tarefa.is_completed)} />
                    <div className="flex-1"><h4 className={`font-medium transition-colors ${tarefa.is_completed ? 'text-white/60 line-through' : 'text-white'}`}>{tarefa.text}</h4></div>
                    
                    {taskPendingDeletion === tarefa.id ? (
                      <div className="flex items-center gap-2 animate-fade-in">
                        <Button variant="ghost" size="icon" onClick={handleCancelDelete} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"><X className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleConfirmDelete(tarefa.id)} className="text-red-500 hover:text-white hover:bg-red-500 rounded-full w-8 h-8"><Check className="w-5 h-5" /></Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(tarefa.id)} className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 w-8 h-8 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-card/20 rounded-2xl"><p className="text-white/70">Nenhuma tarefa para hoje.</p></div>
              )}
            </div>

            {/* 3. MENSAGEM DE PARABÉNS REINTRODUZIDA */}
            {progressoPercentual === 100 && totalTarefas > 0 && (
              <div className="mt-8 bg-primary/20 border border-primary/30 rounded-2xl p-6 text-center animate-fade-in">
                <h3 className="text-xl font-bold text-primary mb-2">🎉 Parabéns!</h3>
                <p className="text-white/80">Você completou todas as suas tarefas de hoje. Continue assim!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Ferramentas;