import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PetalsAnimation from '../components/PetalsAnimation';

// Importar dados mock
import toolsTemplatesData from '../data/tools-templates.json';

// Função para obter ícone por nome
const getIconComponent = (iconName) => {
  // Mapeamento simples de ícones (em um projeto real, usaria lucide-react)
  const iconMap = {
    'coffee': '☕',
    'sun': '☀️',
    'stretch-horizontal': '🤸',
    'heart': '❤️',
    'music': '🎵',
    'palette': '🎨',
    'book': '📚',
    'brain': '🧠',
    'pen-tool': '✍️',
    'users': '👥',
    'phone': '📞',
    'heart-handshake': '🤝'
  };
  
  return iconMap[iconName] || '📝';
};

const AdicionarTarefa = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Rotina Matinal');

  // Agrupar templates por categoria
  const templatesPorCategoria = toolsTemplatesData.reduce((acc, template) => {
    const categoria = template.category_pt;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(template);
    return acc;
  }, {});

  const categorias = Object.keys(templatesPorCategoria);

  const handleAddTask = (template) => {
    // Simular adição de tarefa
    console.log('Adicionando tarefa:', template.title_pt);
    
    // Mostrar feedback visual (em um projeto real, salvaria no estado/API)
    alert(`Tarefa "${template.title_pt}" adicionada com sucesso!`);
    
    // Voltar para a tela de ferramentas
    navigate('/ferramentas');
  };

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
            onClick={() => navigate('/ferramentas')}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Adicionar Tarefa</h1>
            <p className="text-white/70">Escolha um template ou crie uma tarefa personalizada</p>
          </div>
        </div>

        {/* Abas de categorias */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/30 backdrop-blur-sm border border-border/50 mb-8">
            {categorias.map((categoria) => (
              <TabsTrigger 
                key={categoria} 
                value={categoria}
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {categoria}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Conteúdo das abas */}
          {categorias.map((categoria) => (
            <TabsContent key={categoria} value={categoria} className="space-y-4">
              <div className="grid gap-4">
                {templatesPorCategoria[categoria].map((template) => (
                  <div 
                    key={template.id}
                    className="flex items-center justify-between p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getIconComponent(template.icon_name)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{template.title_pt}</h4>
                        <p className="text-sm text-white/70">{categoria}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddTask(template)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Seção de tarefa personalizada */}
        <div className="mt-8 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Criar Tarefa Personalizada</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Digite sua tarefa personalizada..."
              className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Dicas */}
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">💡 Dicas para suas tarefas</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• Comece com tarefas pequenas e fáceis de completar</li>
            <li>• Defina horários específicos para cada atividade</li>
            <li>• Celebre cada conquista, por menor que seja</li>
            <li>• Seja consistente, mesmo que seja por poucos minutos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdicionarTarefa;

