import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PetalsAnimation from '../components/PetalsAnimation';
// A importação do useDailyTasks foi removida pois não é mais necessária aqui
// import { useDailyTasks } from '../hooks/useDailyTasks';
import { useAuth } from '../hooks/useAuth.jsx';
import { addTaskApi } from '../lib/tasksApi';
import toolsTemplatesData from '../data/tools-templates.json';

const getIconComponent = (iconName) => {
  const iconMap = { 'coffee': '☕', 'sun': '☀️', 'stretch-horizontal': '🤸', 'heart': '❤️', 'music': '🎵', 'palette': '🎨', 'book': '📚', 'brain': '🧠', 'pen-tool': '✍️', 'users': '👥', 'phone': '📞', 'heart-handshake': '🤝' };
  return iconMap[iconName] || '📝';
};

const AdicionarTarefa = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isAdding, setIsAdding] = useState(false);
  const [customTaskText, setCustomTaskText] = useState('');
  const [selectedTab, setSelectedTab] = useState('Rotina Matinal');

  const templatesPorCategoria = toolsTemplatesData.reduce((acc, template) => {
    const categoria = template.category_pt;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(template);
    return acc;
  }, {});
  const categorias = Object.keys(templatesPorCategoria);

  const handleAddTask = async (taskText) => {
    if (isAdding || !taskText.trim() || !user) return;
    setIsAdding(true);
    
    // Usando a API diretamente
    const result = await addTaskApi(taskText, user.id);
    
    if (result.success) {
      // --- CORREÇÃO DO REDIRECIONAMENTO ---
      // Navega para a rota correta: /tarefas
      navigate('/tarefas', { state: { taskJustAdded: true } });
    } else {
      console.error("Falha ao adicionar a tarefa.");
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
      <PetalsAnimation />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          {/* O botão de voltar agora também usa a rota correta */}
          <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/tarefas')} className="text-white hover:text-white/80"><ArrowLeft className="w-6 h-6" /></Button>
          <div><h1 className="text-2xl font-bold text-white">Adicionar Tarefa</h1><p className="text-white/70">Escolha um template ou crie uma tarefa personalizada</p></div>
        </div>
        
        {/* A ÁREA DE TESTE FOI REMOVIDA */}
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="flex flex-wrap justify-start gap-2 h-auto bg-card/30 backdrop-blur-sm border border-border/50 mb-8 p-2">
            {categorias.map((categoria) => (<TabsTrigger key={categoria} value={categoria} className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{categoria}</TabsTrigger>))}
          </TabsList>
          {categorias.map((categoria) => (
            <TabsContent key={categoria} value={categoria} className="space-y-4">
              <div className="grid gap-4">
                {templatesPorCategoria[categoria].map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getIconComponent(template.icon_name)}</div>
                      <div><h4 className="font-medium text-white">{template.title_pt}</h4><p className="text-sm text-white/70">{categoria}</p></div>
                    </div>
                    <Button type="button" size="icon" onClick={() => handleAddTask(template.title_pt)} disabled={isAdding} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-9 h-9">
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-8 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Criar Tarefa Personalizada</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleAddTask(customTaskText); setCustomTaskText('') }} className="flex gap-4">
            <input type="text" value={customTaskText} onChange={(e) => setCustomTaskText(e.target.value)} placeholder="Digite sua tarefa personalizada..." className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary" />
            <Button type="submit" disabled={isAdding || !customTaskText.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Adicionar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdicionarTarefa;