import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import CustomCheckbox from '../components/CustomCheckbox';
import PetalsAnimation from '../components/PetalsAnimation';
import { useDailyTasks } from '../hooks/useDailyTasks';

const Ferramentas = () => {
  const navigate = useNavigate();
  
  const { 
    tasks: tarefas, 
    loading, 
    error, 
    toggleTaskCompletion 
  } = useDailyTasks();

  // --- TESTE DE DEPURAÇÃO ADICIONADO ---
  const handleTaskToggle = (taskId, currentStatus) => {
    // Esta mensagem deve aparecer no console do navegador quando você clicar
    console.log(`[DEPURAÇÃO] Tentando mudar a tarefa ${taskId} de ${currentStatus} para ${!currentStatus}`);
    
    toggleTaskCompletion(taskId, currentStatus);
  };
  // --- FIM DO TESTE ---
  
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
        {/* Header */}
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

        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
            <p className="text-white/70 mt-2">Carregando suas tarefas...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-red-400 mb-2">Ops! Ocorreu um erro.</h3>
            <p className="text-white/80">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Resumo do progresso */}
            <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Progresso de Hoje</h3>
                  <p className="text-white/70">{tarefasCompletas} de {totalTarefas} tarefas concluídas</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{progressoPercentual}%</div>
                </div>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-3">
                <div 
                  className="progress-bar h-3 rounded-full"
                  style={{ width: `${progressoPercentual}%` }}
                />
              </div>
            </div>

            {/* Lista de tarefas */}
            <div className="space-y-3">
              {tarefas.length > 0 ? (
                tarefas.map((tarefa) => (
                  <div 
                    key={tarefa.id}
                    className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl"
                  >
                    <CustomCheckbox
                      checked={tarefa.is_completed}
                      onChange={() => handleTaskToggle(tarefa.id, tarefa.is_completed)}
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium transition-colors ${tarefa.is_completed ? 'text-white/60 line-through' : 'text-white'}`}>
                        {tarefa.text}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-card/20 rounded-2xl">
                    <p className="text-white/70">Você ainda não tem tarefas para hoje.</p>
                    <p className="text-white/50 text-sm mt-2">Clique em "Adicionar" para criar uma nova.</p>
                </div>
              )}
            </div>

            {progressoPercentual === 100 && totalTarefas > 0 && (
              <div className="mt-8 bg-primary/20 border border-primary/30 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-primary mb-2">🎉 Parabéns!</h3>
                <p className="text-white/80">Você completou todas as tarefas de hoje. Continue assim!</p>
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