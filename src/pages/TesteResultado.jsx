import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Share2, Download, Trophy, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';

const TesteResultado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Dados passados pela navegação
  const { results, categories, completed_at } = location.state || {};

  // Se não há dados, redirecionar
  if (!results || !categories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Resultado não encontrado</h2>
              <p className="text-white/70 mb-6">
                Não foi possível carregar os resultados do teste.
              </p>
              <Button onClick={() => navigate(`/teste/${id}`)} className="bg-primary hover:bg-primary/90">
                Voltar ao Teste
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calcular estatísticas com verificações de segurança
  const totalScore = results && typeof results === 'object' ? 
    Object.values(results).reduce((sum, score) => sum + (typeof score === 'number' ? score : 0), 0) : 0;
  const maxPossibleScore = results && typeof results === 'object' ? 
    Object.keys(results).length * 25 : 25; // Assumindo score máximo de 25 por categoria
  const overallPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  // Encontrar categoria dominante com verificações de segurança
  const dominantCategory = results && typeof results === 'object' ? 
    Object.entries(results).reduce((max, [category, score]) => 
      (typeof score === 'number' && score > max.score) ? { category, score } : max, 
      { category: '', score: 0 }
    ) : { category: '', score: 0 };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score, maxScore = 25) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLevel = (score, maxScore = 25) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Alto';
    if (percentage >= 60) return 'Moderado-Alto';
    if (percentage >= 40) return 'Moderado';
    return 'Baixo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/aprender')}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Resultado do Teste</h1>
            <p className="text-white/70">
              Concluído em {completed_at ? formatDate(completed_at) : 'agora'}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl text-white">
              Teste Concluído!
            </CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Aqui estão seus resultados detalhados
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-white/70 text-sm">Pontuação Total</p>
                <p className="text-3xl font-bold text-white">{totalScore}</p>
                <p className="text-white/50 text-sm">de {maxPossibleScore} pontos</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-white/70 text-sm">Percentual Geral</p>
                <p className="text-3xl font-bold text-primary">{overallPercentage}%</p>
                <Progress value={overallPercentage} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <p className="text-white/70 text-sm">Categoria Dominante</p>
                <p className="text-lg font-bold text-white">{dominantCategory.category}</p>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  {dominantCategory.score} pontos
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid gap-6 mb-8">
          <Card className="bg-card/30 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Resultados por Categoria
              </CardTitle>
              <CardDescription className="text-white/70">
                Sua pontuação em cada área avaliada
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {results && typeof results === 'object' ? 
                Object.entries(results).map(([categoryName, score]) => {
                  const category = Array.isArray(categories) ? 
                    categories.find(c => c?.title_pt === categoryName) : null;
                  const numericScore = typeof score === 'number' ? score : 0;
                  const percentage = Math.round((numericScore / 25) * 100);
                  
                  return (
                    <div key={categoryName} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{categoryName || 'Categoria'}</h4>
                          {category?.description_pt && (
                            <p className="text-white/70 text-sm mt-1">{category.description_pt}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getScoreColor(numericScore)}`}>
                            {numericScore}
                          </p>
                          <p className="text-white/50 text-sm">
                            {getScoreLevel(numericScore)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{percentage}%</span>
                          <span className="text-white/50">{numericScore}/25 pontos</span>
                        </div>
                        <Progress value={percentage} className="h-3" />
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <p className="text-white/70">Nenhum resultado disponível</p>
                  </div>
                )
              }
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate(`/teste/${id}/responder`)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refazer Teste
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(`/teste/${id}`)}
            className="border-border/50 text-white hover:bg-card/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Teste
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Implementar compartilhamento
              if (navigator.share) {
                navigator.share({
                  title: 'Meu Resultado do Teste',
                  text: `Acabei de completar um teste e obtive ${overallPercentage}% de pontuação!`,
                  url: window.location.href
                });
              }
            }}
            className="border-border/50 text-white hover:bg-card/50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Implementar download/print
              window.print();
            }}
            className="border-border/50 text-white hover:bg-card/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Salvar PDF
          </Button>
        </div>

        {/* Recommendations */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl text-white">Próximos Passos</CardTitle>
            <CardDescription className="text-white/70">
              Recomendações baseadas nos seus resultados
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-card/20 border border-border/30">
                <h4 className="font-semibold text-white mb-2">Explore Cursos</h4>
                <p className="text-white/70 text-sm mb-3">
                  Baseado nos seus resultados, recomendamos explorar nossos cursos de bem-estar.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate('/aprender')}
                  className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                  variant="outline"
                >
                  Ver Cursos
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-card/20 border border-border/30">
                <h4 className="font-semibold text-white mb-2">Outros Testes</h4>
                <p className="text-white/70 text-sm mb-3">
                  Continue sua jornada de autoconhecimento com outros testes disponíveis.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate('/aprender')}
                  className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/30"
                  variant="outline"
                >
                  Explorar Testes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TesteResultado;

