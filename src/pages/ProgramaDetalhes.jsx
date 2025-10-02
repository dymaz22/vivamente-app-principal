import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import ListItemLicao from '../components/ListItemLicao';
import PetalsAnimation from '../components/PetalsAnimation';

// Importar dados mock
import programsData from '../data/programs.json';
import lessonsData from '../data/lessons.json';

const ProgramaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Encontrar programa
  const programa = programsData.find(p => p.id === id);
  
  // Encontrar lições do programa
  const licoes = lessonsData.filter(l => l.program_id === id);
  
  // Calcular progresso
  const licoesCompletas = licoes.filter(l => l.status === 'completed').length;
  const progressoPercentual = Math.round((licoesCompletas / licoes.length) * 100);
  
  // Encontrar próxima lição disponível
  const proximaLicao = licoes.find(l => l.status === 'unlocked') || licoes.find(l => l.status === 'completed');

  if (!programa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Programa não encontrado</h2>
          <Button onClick={() => navigate('/aprender')}>
            Voltar para Aprender
          </Button>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="text-2xl font-bold text-white">{programa.title_pt}</h1>
            <p className="text-white/70">{programa.description_pt}</p>
          </div>
        </div>

        {/* Informações do programa */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Seu Progresso</h3>
              <p className="text-white/70">{licoesCompletas} de {licoes.length} lições concluídas</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progressoPercentual}%</div>
            </div>
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-muted/30 rounded-full h-3 mb-4">
            <div 
              className="progress-bar h-3 rounded-full"
              style={{ width: `${progressoPercentual}%` }}
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>📚 {programa.lessons_count} lições</span>
            <span>⏱️ {programa.duration}</span>
          </div>
        </div>

        {/* Lista de lições */}
        <div className="space-y-3 mb-8">
          {licoes.map((licao) => (
            <ListItemLicao
              key={licao.id}
              title={licao.title_pt}
              position={licao.position}
              duration={licao.duration}
              status={licao.status}
              onClick={() => {
                if (licao.status !== 'locked') {
                  navigate(`/licao/${licao.id}`);
                }
              }}
            />
          ))}
        </div>

        {/* Botão continuar fixo */}
        {proximaLicao && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
            <div className="container mx-auto">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate(`/licao/${proximaLicao.id}`)}
              >
                <Play className="w-4 h-4 mr-2" />
                {proximaLicao.status === 'completed' ? 'Revisar Lição' : 'Continuar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramaDetalhes;

