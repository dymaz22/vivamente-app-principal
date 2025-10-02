import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import CustomCheckbox from '../components/CustomCheckbox';
import PetalsAnimation from '../components/PetalsAnimation';

// Importar dados mock
import userTasksData from '../data/user-tasks.json';

const Ferramentas = () => {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState(userTasksData);

  const handleTaskToggle = (taskId, completed) => {
    setTarefas(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  const tarefasCompletas = tarefas.filter(t => t.completed).length;
  const totalTarefas = tarefas.length;
  const progressoPercentual = Math.round((tarefasCompletas / totalTarefas) * 100);

  // Agrupar tarefas por categoria
  const tarefasPorCategoria = tarefas.reduce((acc, tarefa) => {
    if (!acc[tarefa.category]) {
      acc[tarefa.category] = [];
    }
    acc[tarefa.category].push(tarefa);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      {/* Animação de pétalas */}
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
              Hoje, 15 de Janeiro
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
          
          {/* Barra de progresso */}
          <div className="w-full bg-muted/30 rounded-full h-3">
            <div 
              className="progress-bar h-3 rounded-full"
              style={{ width: `${progressoPercentual}%` }}
            />
          </div>
        </div>

        {/* Lista de tarefas por categoria */}
        <div className="space-y-6">
          {Object.entries(tarefasPorCategoria).map(([categoria, tarefasCategoria]) => (
            <div key={categoria}>
              <h2 className="text-lg font-semibold text-white mb-4">{categoria}</h2>
              <div className="space-y-3">
                {tarefasCategoria.map((tarefa) => (
                  <div 
                    key={tarefa.id}
                    className="flex items-center gap-4 p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl"
                  >
                    <CustomCheckbox
                      checked={tarefa.completed}
                      onChange={(completed) => handleTaskToggle(tarefa.id, completed)}
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${tarefa.completed ? 'text-white/60 line-through' : 'text-white'}`}>
                        {tarefa.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem de motivação */}
        {progressoPercentual === 100 && (
          <div className="mt-8 bg-primary/20 border border-primary/30 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-primary mb-2">🎉 Parabéns!</h3>
            <p className="text-white/80">Você completou todas as tarefas de hoje. Continue assim!</p>
          </div>
        )}

        {/* Espaço para o botão fixo */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default Ferramentas;

