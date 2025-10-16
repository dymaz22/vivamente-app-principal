import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORTANDO O ÍCONE DE LIXEIRA
import { ArrowLeft, Plus, Calendar, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import CustomCheckbox from '../components/CustomCheckbox';
import PetalsAnimation from '../components/PetalsAnimation';
import { useDailyTasks } from '../hooks/useDailyTasks';

const Ferramentas = () => {
  const navigate = useNavigate();
  
  // 2. OBTENDO A NOVA FUNÇÃO 'deleteTask' DO HOOK
  const { 
    tasks: tarefas, 
    loading, 
    error, 
    toggleTaskCompletion,
    deleteTask
  } = useDailyTasks();

  // Limpando o console.log de depuração
  const handleTaskToggle = (taskId, currentStatus) => {
    toggleTaskCompletion(taskId, currentStatus);
  };

  // 3. NOVA FUNÇÃO PARA DELETAR TAREFA
  const handleDeleteTask = (taskId) => {
    // Adiciona a confirmação elegante que você pediu
    if (window.confirm("Você tem certeza que deseja excluir esta tarefa?")) {
      deleteTask(taskId);
    }
  };
  
  const tarefasCompletas = tarefas.filter(t => t.is_completed).length;
  const totalTarefas = tarefas.length;
  const progressoPercentual = totalTarefas > 0 ? Math.round((tarefasCompletas / totalTarefas) * 100) : 0;
  
  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header (sem alterações) */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/aprender')}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Tarefas do Dia</h1>
            <p className="text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Hoje, {getFormattedDate()}
            </p>
          </div>
          <Button 
            onClick={() => navigate("/tarefas/nova")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading && ( <div className="text-center py-10"><Loader2 className="w-8 h-8 text-white animate-spin mx-auto" /><p className="text-white/70 mt-2">Carregando...</p></div> )}
        {error && ( <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center"><h3 className="text-xl font-bold text-red-400">Erro</h3><p>{error}</p></div> )}

        {!loading && !error && (
          <>
            {/* Resumo do progresso (sem alterações) */}
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-lg font-semibold text-white">Progresso de Hoje</h3><p className="text-white/70">{tarefasCompletas} de {totalTarefas} tarefas</p></div>
                <div className="text-2xl font-bold text-primary">{progressoPercentual}%</div>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3"><div className="progress-bar h-3 rounded-full" style={{ width: `${progressoPercentual}%` }} /></div>
            </div>

            {/* Lista de tarefas */}
            <div className="space-y-3">
              {tarefas.length > 0 ? (
                tarefas.map((tarefa) => (
                  <div key={tarefa.id} className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                    <CustomCheckbox
                      checked={tarefa.is_completed}
                      onChange={() => handleTaskToggle(tarefa.id, tarefa.is_completed)}
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium transition-colors ${tarefa.is_completed ? 'text-white/60 line-through' : 'text-white'}`}>
                        {tarefa.text}
                      </h4>
                    </div>
                    {/* 4. BOTÃO DE LIXEIRA ADICIONADO */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(tarefa.id)}
                      className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 w-8 h-8 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-card/20 rounded-2xl"><p className="text-white/70">Nenhuma tarefa para hoje.</p></div>
              )}
            </div>

            {progressoPercentual === 100 && totalTarefas > 0 && (
              <div className="mt-8 bg-primary/20 border border-primary/30 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-primary">🎉 Parabéns!</h3>
                <p className="text-white/80">Você completou tudo hoje!</p>
              </div>
            )}
            
            <div className="h-20" />
          </>
        )}
      </div>
    </div>
  );
};

export default Ferramentas;